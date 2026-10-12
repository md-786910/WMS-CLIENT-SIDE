import React from 'react'
import { Container } from "react-bootstrap";
import Task from '../components/Task/Task';
import Footer from '../components/Footer';

function MyTaskPage({ handleSize }) {
    return (
        <Container fluid className="app-fluid">
            <Task handleSize={handleSize} />
            <Footer />
        </Container>
    )
}

export default MyTaskPage
