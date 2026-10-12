import React, { useEffect, useState } from "react";
import { mapExtTofile } from "../../utils/extPath";
import {
  addSpinner,
  removeSpinner,
  showToastError,
  showToastSuccess,
} from "../../utils/action";
import { deleteFilesDocs, getFileMultiple } from "../../api";
import ShowFileModel from "./model/ShowFileModel";
import { SkeletonCards, EmptyState } from "../ui/chrome";
import "./storage.css";

function FileCard({ folderId = null, uploadProgress }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [singleFile, setSingleFile] = useState(null);
  const [show, setShow] = useState(false);

  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);

  async function getMultipleFileSystem() {
    try {
      const resp = await getFileMultiple(folderId);
      if (resp.status === 200) {
        setFiles(resp.data);
      } else {
        showToastError(resp.data.message);
      }
    } catch (error) {
      showToastError(error.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getMultipleFileSystem();
    // eslint-disable-next-line
  }, [uploadProgress, folderId]);

  const deleteFile = async (e, fileId) => {
    e.stopPropagation();
    const confirm = window.confirm("Delete this file?");
    if (!confirm) return;
    addSpinner(e);
    try {
      const resp = await deleteFilesDocs(fileId);
      if (resp?.status === 200) removeSpinner(e, "Delete");
      await getMultipleFileSystem();
      showToastSuccess("File deleted successfully");
    } catch (error) {
      showToastError(error);
      removeSpinner(e, "Delete");
    }
  };

  if (loading) return <SkeletonCards n={3} />;
  if (!files?.length)
    return <EmptyState title="No files here" sub="Upload files to see them in this view." />;

  return (
    <div className="d-flex gap-3 flex-wrap">
      {files?.map((file, index) => {
        return (
          <div
            key={file?._id || index}
            title={file?.fileName}
            className="card wms-card ptr"
            style={{ width: 148, padding: 10, textAlign: "center" }}
            onClick={() => {
              setSingleFile(file);
              handleOpen();
            }}
          >
            <div className="d-flex justify-content-center">
              {mapExtTofile(file?.fileName?.split(".")[1])}
            </div>
            <div className="clamp-2 mt-1" style={{ fontSize: 12, fontWeight: 600, wordBreak: "break-word" }}>
              {file?.fileName}
            </div>
            <button
              className="btn btn-sm btn-outline-danger w-100 mt-2"
              onClick={(e) => deleteFile(e, file?._id)}
            >
              Delete
            </button>
          </div>
        );
      })}
      {singleFile != null && (
        <ShowFileModel
          show={show}
          file={singleFile}
          handleClose={handleClose}
        />
      )}
    </div>
  );
}

export default FileCard;
