import React from 'react'
import { Container } from "react-bootstrap";
import Resolve from '../components/Resolver/Resolve';
import ResolveDetail from '../components/Resolver/ResolveDetail';

function ResolveDetailPage() {
    return (
        <Container fluid className="p-0" style={{ marginTop: "6em" }}>

            <ResolveDetail />


        </Container>

    )
}

export default ResolveDetailPage