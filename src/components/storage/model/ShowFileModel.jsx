import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { downloadFile } from '../../../utils/extPath';

function ShowFileModel(props) {
    const { show, handleClose, file } = props;

    const getFileView = (ext) => {
        if (ext === 'pdf') {
            return <embed src={file?.fileUrl} type="application/pdf" width="760" height="400" />
        }
        if (ext === 'docx' || ext === 'doc') {
            // eslint-disable-next-line jsx-a11y/iframe-has-title
            return <iframe src={file?.fileUrl} style={{ width: '100%', height: '500px' }} />
        }
        if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
            // eslint-disable-next-line jsx-a11y/iframe-has-title
            return <iframe src={file?.fileUrl} style={{ width: '100%', height: '500px' }} />
        }
        if (ext === 'txt') {
            return <pre>{file?.fileUrl}</pre>
        }
        if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') {
            return <img src={file?.fileUrl} alt="" style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
            }} />
        }
        if (ext === 'mp3') {
            return <audio controls src={file?.fileUrl} alt="audio" muted autoPlay />
        }
        if (ext === 'mp4') {
            return <video controls src={file?.fileUrl} alt="video" muted autoPlay style={{
                width: "100%"
            }} />
        }
        return <a href={file?.fileUrl}>{file?.fileName}</a>

    }

    return (
        <div>
            <Modal show={show} onHide={handleClose}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title >
                        File Viewer
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div >
                        {getFileView(file?.fileName?.split('.')[1])}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <a variant="success" href={"#"} download={file?.fileName} target='_blank' rel="noreferrer">
                        Download
                    </a>
                    <Button variant="danger" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ShowFileModel
