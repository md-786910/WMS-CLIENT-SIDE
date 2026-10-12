import React from 'react'
import Home from '../components/Home/Home'
import Footer from '../components/Footer'
import { Container } from "react-bootstrap";

function HomePage() {
    return (
        <Container fluid className="app-fluid">
            <Home />
            <Footer />
        </Container>
    )
}

export default HomePage
