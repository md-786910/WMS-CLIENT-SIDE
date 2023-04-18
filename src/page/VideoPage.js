import React from 'react'
import { Container } from "react-bootstrap";
import VideoBox from '../components/Video/VideoBox';

function VideoPage() {
    return (
        <Container fluid className="p-0" style={{ marginTop: "4em" }}>
            <VideoBox />
        </Container>

    )
}

export default VideoPage