import React, { useEffect, useState } from 'react'
import { mapExtTofile } from '../../utils/extPath'
import { addSpinner, removeSpinner, showToastError, showToastSuccess } from '../../utils/action';
import { deleteFilesDocs, getFileMultiple } from '../../api';
import ShowFileModel from './model/ShowFileModel';

function FileCard({ folderId = null, uploadProgress }) {
    // const {  } = props;
    const [files, setFiles] = useState([])
    const [singleFile, setSingleFile] = useState(null)
    const [show, setShow] = useState(false)


    const handleOpen = () => {
        setShow(true)
    }
    const handleClose = () => {
        setShow(false)
    }

    async function getMultipleFileSystem() {
        try {
            const resp = await getFileMultiple(folderId);
            if (resp.status === 200) {
                setFiles(resp.data)
            } else {
                showToastError(resp.data.message);
            }
        } catch (error) {
            showToastError(error.message);
        }
    }
    useEffect(() => {
        getMultipleFileSystem();
        // eslint-disable-next-line
    }, [uploadProgress]);
    return (
        <div className='file-content  d-flex mt-5 gap-2'>
            {
                files?.map((file, index) => {
                    return (
                        <div key={index}
                            title={file?.fileName}
                            className='border ptr'
                            style={{
                                width: "130px",
                                padding: "5px"
                            }}
                            onClick={() => {
                                setSingleFile(file)
                                handleOpen()
                            }}
                        >
                            <div >
                                {
                                    mapExtTofile(file?.fileName?.split('.')[1])
                                }
                                <span >{file?.fileName?.slice(0, 13)}</span>
                                <span className='btn btn-danger btn-sm d-block mt-2' onClick={async (e) => {
                                    e.stopPropagation();

                                    const confirm = window.confirm("Are you sure you want to delete")
                                    if (!confirm) {
                                        return;
                                    }
                                    addSpinner(e);
                                    // call delete
                                    try {
                                        const resp = await deleteFilesDocs(file?._id);
                                        if (resp?.status === 200) {
                                            removeSpinner(e, "Delete")
                                        }
                                        await getMultipleFileSystem()
                                        showToastSuccess("File deleted successfully")
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
            {
                singleFile != null && <ShowFileModel show={show} file={singleFile} handleClose={handleClose} />
            }
        </div>
    )
}

export default FileCard
