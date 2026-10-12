import React from "react";
import { Container } from "react-bootstrap";
import Expence from "../components/Expence/Expence";
import Footer from "../components/Footer";

function ExpencePage() {
  return (
    <Container fluid className="app-fluid">
      <Expence />
      <Footer />
    </Container>
  );
}

export default ExpencePage;
