import React from 'react'
import { Container } from "react-bootstrap";
import Expence from '../components/Expence/Expence';

function ExpencePage() {
    return (
        <Container fluid className="p-0" style={{ marginTop: "6em" }}>

            <Expence />


        </Container>

    )
}

export default ExpencePage