import React from 'react'
import { Container } from "react-bootstrap";
import Alarm from '../components/Alarm/Alarm';
import Footer from '../components/Footer';

function AlarmPage() {
    return (
        <Container fluid className="app-fluid">
            <Alarm />
            <Footer />
        </Container>
    )
}

export default AlarmPage
