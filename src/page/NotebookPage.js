import React, { useState } from 'react'
import NotebookIndex from '../components/Notebook'
import Notebooksidebar from '../components/Notebook/Notebooksidebar'
import { Container, Col, Row } from 'react-bootstrap'
import Footer from '../components/Footer'
import { PageHeader } from '../components/ui/chrome'

function NotebookPage() {
    const [checkFile, setCheckFile] = useState(0);
    const handleFileLength = (props) => {
        setCheckFile(props)
    }


    return (
        <Container fluid className="app-fluid">
            <div className="content-stack">
                <PageHeader
                    breadcrumb="WMS · Notebook"
                    title="Notebook"
                    sub={checkFile ? `${checkFile} notes — autosaves as you type.` : "Autosaving editor with quick sidebar."}
                    right={<span className="pill pill-neutral">{checkFile || 0} notes</span>}
                />
                <Row className="g-3">
                    <Col xl={2} lg={3} md={4}>
                        <Notebooksidebar handleFileLength={handleFileLength} />
                    </Col>
                    <Col xl={10} lg={9} md={8}>
                        {
                            checkFile ? <NotebookIndex /> : <div className="section-card p-4 text-center" style={{ color: "var(--muted)", fontSize: 14 }}>
                                <strong style={{ display: "block", color: "var(--text)", marginBottom: 4 }}>No notes yet</strong>
                                Create your first note from the sidebar.
                            </div>
                        }
                    </Col>
                </Row>
            </div>
            <Footer />
        </Container>
    )
}

export default NotebookPage
