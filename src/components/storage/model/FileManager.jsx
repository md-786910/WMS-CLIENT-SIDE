import React, { useCallback, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import Dropzone from 'react-dropzone'
import { RiDeleteBack2Fill } from 'react-icons/ri'
import { showToastError } from '../../../utils/action'
import Axios from '../../../utils/axios'


function FileManager({ show, handleClose, handleFiles }) {
    const [selectedFiles, setSelectedFiles] = useState([])


    const onDrop = useCallback(acceptedFiles => {
        setSelectedFiles(acceptedFiles)
    }, [])

    const handleDeleteFile = (lastModified) => {
        const filters = selectedFiles?.filter((file) => file?.lastModified !== lastModified)
        setSelectedFiles(filters)
    }

    const handleSubmitFiles = async () => {
        // const resp = await uploadFiles(selectedFiles)
        handleFiles(selectedFiles)
        handleClose()
        setSelectedFiles([])
    }
    return (
        <div>
            <Modal show={show} onHide={handleClose}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
            >
                <Modal.Header >
                    <Modal.Title className='fw-bold text-danger' >
                        Upload file / documents
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{
                        border: "2px dotted red"
                    }}>
                        <Dropzone onDrop={onDrop} multiple={true}>
                            {({ getRootProps, getInputProps }) => (
                                <section >
                                    <div {...getRootProps()}>
                                        <input {...getInputProps()} style={{
                                            height: "50px"
                                        }} />
                                        <p>Drag 'n' drop some files here, or click to select files</p>
                                    </div>
                                </section>
                            )}
                        </Dropzone>
                    </div>
                    <div className='file-list mt-1'>
                        {
                            selectedFiles?.length > 0 && selectedFiles?.map((file, index) => (
                                <div key={index} className='card border border-danger mb-1 p-1 d-flex justify-content-between '>
                                    <p style={{
                                        margin: 0
                                    }}
                                    >{file.name}</p>
                                    <span className='text-success fw-bold'>{(file?.size / 1024 / 1024).toFixed(2)}MB</span>
                                    <span>
                                        <Button variant='danger' size='sm' onClick={() => handleDeleteFile(file?.lastModified)}><RiDeleteBack2Fill /></Button>
                                    </span>
                                </div>
                            ))
                        }
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => handleSubmitFiles()}>
                        Submit files
                    </Button>
                    <Button variant="danger" onClick={handleClose}>
                        Close
                    </Button>

                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default FileManager
