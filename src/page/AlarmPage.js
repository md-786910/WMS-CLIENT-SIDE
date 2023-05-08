import React from 'react'
import { Container } from "react-bootstrap";
import Alarm from '../components/Alarm/Alarm';

function AlarmPage() {
    return (
        <Container fluid className="p-0" style={{ marginTop: "6em" }}>
            <Alarm />
        </Container>

    )
}

export default AlarmPage