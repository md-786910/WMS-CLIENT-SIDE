import React from 'react'
import { Container } from "react-bootstrap";
import Company from '../components/Company/Company';

function CompanyPage() {
    return (
        <Container fluid className="p-0" style={{ marginTop: "6em" }}>
            <Company />
        </Container>

    )
}

export default CompanyPage