import React from 'react'
import { Container } from "react-bootstrap";
import Resolve from '../components/Resolver/Resolve';
import Footer from '../components/Footer';

function ResolverPage() {
    return (
        <Container fluid className="app-fluid">
            <Resolve />
            <Footer />
        </Container>
    )
}

export default ResolverPage
