import React from 'react'
import { Container } from "react-bootstrap";
import Issues from '../components/Issues/Issues';

function IssuePage() {
    return (
        <Container fluid className="p-0" style={{ marginTop: "6em" }}>

            <Issues />


        </Container>

    )
}

export default IssuePage