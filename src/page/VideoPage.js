import React from 'react'
import { Container } from "react-bootstrap";
import VideoBox from '../components/Video/VideoBox';
import Footer from '../components/Footer';

function VideoPage() {
    return (
        <Container fluid className="app-fluid">
            <VideoBox />
            <Footer />
        </Container>
    )
}

export default VideoPage
