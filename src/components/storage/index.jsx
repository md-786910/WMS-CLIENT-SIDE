import React, { useEffect, useState } from 'react'
import { backDark } from '../../utils/color'
import FileManager from './model/FileManager'
import { FcFolder } from "react-icons/fc";
import FolderModel from './model/Folder';
import Axios from '../../utils/axios';
import ProgressBar from 'react-bootstrap/ProgressBar';
import FileCard from './FileCard';
import { createFolder, deleteFolderWithFiles, getFolders } from '../../api';
import { addSpinner, removeSpinner, showToastError, showToastSuccess } from '../../utils/action';
import { Link, useLocation } from 'react-router-dom';

function StorageIndex() {
    const location = useLocation();
    const params = new URLSearchParams(location?.search);
    const queryStr = {};
    for (const [key, value] of params) {
        queryStr[key] = value;
    }

    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState("");
    const [show, setShow] = useState(false)
    const [folderShow, setFolderShow] = useState(false)
    const [folderName, setFolderName] = useState("")
    const [folderArray, setFolderArray] = useState([])


    const handleOpen = () => {
        setShow(true)
    }
    const handleClose = () => {
        setShow(false)
    }
    const handleOpenFolder = () => {
        setFolderShow(true)
    }
    const handleCloseFolder = () => {
        setFolderShow(false)
    }

    // handle folder actions
    const handleChange = (e) => {
        const value = e.target.value
        setFolderName(value)
    }

    const createFolderNameHandler = async (e) => {
        try {
            if (!folderName) {
                return;
            }
            addSpinner(e)
            const resp = await createFolder(folderName)
            if (resp?.status === 201) {
                setFolderName('')
                handleCloseFolder()
                getFolderArray();
                removeSpinner(e, "Create folder")
            }
        } catch (error) {
            showToastError(error)
            removeSpinner(e, "Create folder")

        }
    }

    // handle files
    const handleFiles = async (files) => {
        setUploadProgress(0);
        if (files.length === 0) {
            setUploadStatus('Please select files first.');
            return;
        }

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('selectedFiles', files[i]);
        }

        try {
            const isFolderContain = parseInt(queryStr.stage) === 2 ? true : false
            const folderId = parseInt(queryStr.stage) === 2 ? queryStr?.folderId : null
            const response = await Axios.post(`/upload-files?isFolderContain=${isFolderContain}&folderId=${folderId}`, formData, {
                onUploadProgress: (progressEvent) => {
                    if (progressEvent) {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        // check if we already displayed a toast
                        setUploadProgress(progress)
                        setUploadStatus("uploading in progress...")


                    }
                }
            });

            if (response.status === 200) {
                setUploadStatus('Files uploaded successfully!');
                setUploadProgress(0)
                setUploadStatus("")
            } else {
                setUploadStatus('File upload failed.');
            }
        } catch (error) {
            console.error('Error uploading files:', error);
            setUploadStatus('Error uploading files.');
        }
    }

    async function getFolderArray() {
        try {
            const resp = await getFolders();
            if (resp.status === 200) {
                setFolderArray(resp.data)
            } else {
                showToastError(resp.data.message);
            }
        } catch (error) {
            showToastError(error.message);
        }
    }
    useEffect(() => {
        getFolderArray();
        // eslint-disable-next-line
    }, []);
    return (
        <section>
            {uploadProgress > 0 && (
                uploadProgress
            )}
            {
                uploadStatus !== "" && <div className='mb-2'>
                    <ProgressBar animated label={`${uploadStatus}`} striped variant={"danger"} min={1} now={uploadProgress} max={100} />
                </div>
            }


            <div className="companyStatus issResolveCon">
                <div
                    className='d-flex justify-content-between align-items-center'
                    style={{ background: backDark, padding: ".5em", color: "white" }}
                >
                    <div className='d-flex align-items-center gap-2'>
                        {
                            parseInt(queryStr.stage) === 2 && <button className='btn btn-primary btn-sm' onClick={() => {
                                window.history.back();
                            }}>
                                Back me
                            </button>
                        }
                        <h2>Cloud storage &nbsp;

                            {
                                parseInt(queryStr.stage) === 2 && <span className='text-warning'>{queryStr?.folderName} &nbsp;
                                    <FcFolder />
                                </span>
                            }

                        </h2>
                    </div>

                    <div>

                        {
                            <button className="btn btn-primary me-3" onClick={handleOpenFolder}>
                                Create folder
                            </button>
                        }

                        <button className="btn btn-danger " onClick={handleOpen}>
                            upload files
                        </button>
                    </div>
                </div>
                <div className="divider"></div>

                <div className='file-content  d-flex gap-2'>
                    {
                        parseInt(queryStr.stage) !== 2 && folderArray?.map((folder, index) => {
                            return (
                                <div key={index}
                                    title={folder?.folderName}
                                    className='border ptr'
                                    style={{
                                        width: "130px",
                                        padding: "5px"
                                    }}
                                >
                                    <div >
                                        <Link to={`/cloud-storage?type=folder&lable=child&stage=2&folderId=${folder?._id}&folderName=${folder?.folderName}`}>
                                            <FcFolder size={120} />
                                            <span >{folder?.folderName?.slice(0, 13)}</span>
                                        </Link>
                                        <span className='btn btn-danger btn-sm d-block mt-2' onClick={async (e) => {

                                            const confirm = window.confirm("Are you sure you want to delete")
                                            if (!confirm) {
                                                return;
                                            }
                                            addSpinner(e);
                                            // call delete
                                            try {
                                                const resp = await deleteFolderWithFiles(folder?._id);
                                                if (resp?.status === 200) {
                                                    removeSpinner(e, "Delete")
                                                }
                                                await getFolderArray()
                                                showToastSuccess("Folder deleted successfully")
                                            } catch (error) {
                                                showToastError(error)
                                                removeSpinner(e, "Delete")

                                            }

                                        }}>Delete</span>
                                    </div>
                                </div>
                            )
                        })
                    }

                </div>

                {/* for folder > files */}

                {
                    parseInt(queryStr.stage) === 2 && <FileCard folderId={queryStr?.folderId} uploadProgress={uploadProgress} />
                }

                {/* files  */}
                {
                    parseInt(queryStr.stage) === 1 && <FileCard folderId={null} uploadProgress={uploadProgress} />
                }



            </div>
            <FolderModel show={folderShow} handleClose={handleCloseFolder} folderName={folderName} handleChange={handleChange} createFolderNameHandler={createFolderNameHandler} />
            <FileManager show={show} handleClose={handleClose} handleFiles={handleFiles}
            />
        </section>
    )
}

export default StorageIndex
