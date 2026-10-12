import React, { useEffect, useState } from "react";
import FileManager from "./model/FileManager";
import { FcFolder } from "react-icons/fc";
import FolderModel from "./model/Folder";
import Axios from "../../utils/axios";
import ProgressBar from "react-bootstrap/ProgressBar";
import FileCard from "./FileCard";
import { createFolder, deleteFolderWithFiles, getFolders } from "../../api";
import {
  addSpinner,
  removeSpinner,
  showToastError,
  showToastSuccess,
} from "../../utils/action";
import { Link, useLocation } from "react-router-dom";
import { PageHeader, SkeletonCards, EmptyState } from "../ui/chrome";

function StorageIndex() {
  const location = useLocation();
  const params = new URLSearchParams(location?.search);
  const queryStr = {};
  for (const [key, value] of params) {
    queryStr[key] = value;
  }
  const inFolder = parseInt(queryStr.stage) === 2;

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const [show, setShow] = useState(false);
  const [folderShow, setFolderShow] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [folderArray, setFolderArray] = useState([]);
  const [loadingFolders, setLoadingFolders] = useState(true);

  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);
  const handleOpenFolder = () => setFolderShow(true);
  const handleCloseFolder = () => setFolderShow(false);

  const handleChange = (e) => setFolderName(e.target.value);

  const createFolderNameHandler = async (e) => {
    try {
      if (!folderName.trim()) {
        showToastError("Enter a folder name");
        return;
      }
      addSpinner(e);
      const resp = await createFolder(folderName.trim());
      if (resp?.status === 201) {
        setFolderName("");
        handleCloseFolder();
        getFolderArray();
        removeSpinner(e, "Create folder");
      }
    } catch (error) {
      showToastError(error);
      removeSpinner(e, "Create folder");
    }
  };

  const handleFiles = async (files) => {
    setUploadProgress(0);
    if (files.length === 0) {
      setUploadStatus("Please select files first.");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("selectedFiles", files[i]);
    }

    try {
      const isFolderContain = inFolder ? true : false;
      const folderId = inFolder ? queryStr?.folderId : null;
      const response = await Axios.post(
        `/upload-files?isFolderContain=${isFolderContain}&folderId=${folderId}`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            if (progressEvent?.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(progress);
              setUploadStatus("Uploading…");
            }
          },
        }
      );

      if (response.status === 200) {
        setUploadProgress(0);
        setUploadStatus("done");
      } else {
        setUploadStatus("File upload failed.");
      }
    } catch (error) {
      setUploadStatus("Error uploading files.");
    }
  };

  async function getFolderArray() {
    try {
      const resp = await getFolders();
      if (resp.status === 200) {
        setFolderArray(resp.data);
      } else {
        showToastError(resp.data.message);
      }
    } catch (error) {
      showToastError(error.message);
    } finally {
      setLoadingFolders(false);
    }
  }
  useEffect(() => {
    getFolderArray();
    // eslint-disable-next-line
  }, []);

  const deleteFolder = async (e, folderId) => {
    const confirm = window.confirm("Delete this folder and its files?");
    if (!confirm) return;
    addSpinner(e);
    try {
      const resp = await deleteFolderWithFiles(folderId);
      if (resp?.status === 200) removeSpinner(e, "Delete");
      await getFolderArray();
      showToastSuccess("Folder deleted successfully");
    } catch (error) {
      showToastError(error);
      removeSpinner(e, "Delete");
    }
  };

  return (
    <div className="content-stack">
      <PageHeader
        breadcrumb={inFolder ? `WMS · Storage · ${queryStr?.folderName || "Folder"}` : "WMS · Storage"}
        title={inFolder ? (queryStr?.folderName || "Folder") : "Cloud storage"}
        sub={inFolder ? "Files inside this folder." : `${folderArray.length} folders — organized & searchable.`}
        right={
          <>
            {inFolder && (
              <button className="btn btn-sm btn-ink" onClick={() => window.history.back()}>
                ← Back
              </button>
            )}
            {!inFolder && (
              <button className="btn btn-sm btn-ink" onClick={handleOpenFolder}>
                + New folder
              </button>
            )}
            <button className="btn btn-sm btn-redis" onClick={handleOpen}>
              Upload files
            </button>
          </>
        }
      />

      {uploadStatus !== "" && uploadStatus !== "done" && (
        <div className="section-card p-3">
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", marginBottom: 6 }}>
            {uploadStatus} {uploadProgress > 0 && `${uploadProgress}%`}
          </div>
          <ProgressBar animated striped variant="danger" min={1} now={uploadProgress} max={100} />
        </div>
      )}

      {!inFolder && (
        <div className="section-card p-3 p-md-4">
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--faint)", marginBottom: 12 }}>
            Folders
          </div>
          {loadingFolders ? (
            <SkeletonCards n={3} />
          ) : folderArray?.length === 0 ? (
            <EmptyState
              title="No folders yet"
              sub="Create your first folder to organize uploads."
              action={<button className="btn btn-sm btn-redis" onClick={handleOpenFolder}>+ New folder</button>}
            />
          ) : (
            <div className="d-flex gap-3 flex-wrap">
              {folderArray?.map((folder) => (
                <div
                  key={folder?._id}
                  title={folder?.folderName}
                  className="card wms-card ptr"
                  style={{ width: 148, padding: 10, textAlign: "center" }}
                >
                  <Link
                    to={`/cloud-storage?type=folder&lable=child&stage=2&folderId=${folder?._id}&folderName=${folder?.folderName}`}
                    style={{ textDecoration: "none", color: "var(--text)" }}
                  >
                    <FcFolder size={64} />
                    <div className="clamp-2 mt-1" style={{ fontSize: 13, fontWeight: 600 }}>
                      {folder?.folderName}
                    </div>
                  </Link>
                  <button
                    className="btn btn-sm btn-outline-danger w-100 mt-2"
                    onClick={(e) => deleteFolder(e, folder?._id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="section-card p-3 p-md-4">
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--faint)", marginBottom: 12 }}>
          {inFolder ? "Files in folder" : "Root files"}
        </div>
        <FileCard
          folderId={inFolder ? queryStr?.folderId : null}
          uploadProgress={uploadStatus}
        />
      </div>

      <FolderModel
        show={folderShow}
        handleClose={handleCloseFolder}
        folderName={folderName}
        handleChange={handleChange}
        createFolderNameHandler={createFolderNameHandler}
      />
      <FileManager
        show={show}
        handleClose={handleClose}
        handleFiles={handleFiles}
      />
    </div>
  );
}

export default StorageIndex;
