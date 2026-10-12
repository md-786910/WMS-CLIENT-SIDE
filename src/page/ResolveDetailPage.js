import React from 'react'
import { Container } from "react-bootstrap";
import ResolveDetail from '../components/Resolver/ResolveDetail';
import Footer from '../components/Footer';

function ResolveDetailPage() {
    return (
        <Container fluid className="app-fluid">
            <ResolveDetail />
            <Footer />
        </Container>
    )
}

export default ResolveDetailPage
