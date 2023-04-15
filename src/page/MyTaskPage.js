import React from 'react'
import { Container } from "react-bootstrap";
import Issues from '../components/Issues/Issues';
import Task from '../components/Task/Task';

function MyTaskPage({ handleSize }) {
    return (
        <Container fluid className="p-0" style={{ marginTop: "6em" }}>
            <Task handleSize={handleSize} />
        </Container>

    )
}

export default MyTaskPage