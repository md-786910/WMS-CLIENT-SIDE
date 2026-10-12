import React from 'react'
import { Container } from 'react-bootstrap'
import StorageIndex from '../components/storage'
import Footer from '../components/Footer'


function StoragePage() {
    return (
        <Container fluid className="app-fluid">
            <StorageIndex />
            <Footer />
        </Container>
    )
}

export default StoragePage
