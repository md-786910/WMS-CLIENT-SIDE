import React from 'react'
import { Container } from "react-bootstrap";
import Company from '../components/Company/Company';
import Footer from '../components/Footer';

function CompanyPage() {
    return (
        <Container fluid className="app-fluid">
            <Company />
            <Footer />
        </Container>
    )
}

export default CompanyPage
