import React, { useState } from 'react'
import NotebookIndex from '../components/Notebook'
import Notebooksidebar from '../components/Notebook/Notebooksidebar'
import { Col, Row } from 'react-bootstrap'

function NotebookPage() {
    const [checkFile, setCheckFile] = useState(0);
    const handleFileLength = (props) => {
        setCheckFile(props)
    }


    return (
        <div fluid className="p-0" style={{ marginTop: "4em", position: "relative", top: 0 }}>
            <Row>
                <Col lg={2} >
                    <Notebooksidebar handleFileLength={handleFileLength} />
                </Col>
                <Col lg={10} >
                    {
                        checkFile ? <NotebookIndex /> : <div className='d-flex justify-content-center align-items-center'>
                            <h3>
                                Not file found yet create new one.
                            </h3>
                        </div>
                    }
                </Col>
            </Row>
        </div>
    )
}

export default NotebookPage
