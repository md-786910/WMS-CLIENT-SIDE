import React from 'react'
import { Container } from 'react-bootstrap'
import StorageIndex from '../components/storage'


function StoragePage() {
    return (
        <Container fluid className="p-0" style={{ marginTop: "6em" }}>
            <StorageIndex />
        </Container>
    )
}

export default StoragePage
