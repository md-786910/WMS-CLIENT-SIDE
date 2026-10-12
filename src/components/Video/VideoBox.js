import React, { useEffect, useState } from "react";
import {
  addSpinner,
  removeSpinner,
  showToastError,
  showToastSuccess,
} from "../../utils/action";
import { Col, Row, Modal, Button } from "react-bootstrap";
import Axios from "../../utils/axios";
import { Link, useLocation } from "react-router-dom";
import { PageHeader, SkeletonCards, EmptyState } from "../ui/chrome";

function VideoBox() {
  const videoId = useLocation().search.slice(7);
  const [title, setTitle] = useState("");
  const [data, setData] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const addVideo = async (e) => {
    addSpinner(e);
    if (title.trim()) {
      try {
        const resp = await Axios.post("/postVideo", { title: title.trim() });
        if (resp.data.success) {
          showToastSuccess(resp.data.message);
          setTitle("");
          handleClose();
        } else {
          showToastError(resp.data.message);
        }
      } catch (error) {
        showToastError("video added failed");
      } finally {
        removeSpinner(e, "Add video");
        getTask();
      }
    } else {
      showToastError("add playlist Id");
      removeSpinner(e, "Add video");
    }
  };

  const getTask = async () => {
    try {
      const resp = await Axios.get("/getVideo");
      if (resp.data.success) {
        setData(resp.data.data);
        return;
      } else {
        showToastError(resp.data.message);
      }
    } catch (error) {
      showToastError(error.message);
    } finally {
      setSpinner(false);
    }
  };

  useEffect(() => {
    getTask();
    // eslint-disable-next-line
  }, []);

  const active = data?.find((v) => v.videoId === videoId) || data?.[0];

  return (
    <div className="content-stack">
      <PageHeader
        breadcrumb="WMS · Learning"
        title="Learning"
        sub={spinner ? "Loading…" : `${data.length} videos in library`}
        right={
          <Button size="sm" className="btn-redis border-0" onClick={handleShow}>
            + Add video
          </Button>
        }
      />

      {spinner ? (
        <div className="section-card p-3 p-md-4"><SkeletonCards n={2} /></div>
      ) : data?.length === 0 ? (
        <div className="section-card p-3 p-md-4">
          <EmptyState title="No videos yet" sub="Add a YouTube playlist ID to start learning." action={<Button size="sm" className="btn-redis border-0" onClick={handleShow}>+ Add video</Button>} />
        </div>
      ) : (
        <Row className="g-3">
          <Col lg={8}>
            <div className="section-card overflow-hidden">
              <div style={{ background: "#000", aspectRatio: "16/9" }}>
                {active ? (
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ aspectRatio: "16/9", border: 0, display: "block" }}
                    src={`https://www.youtube.com/embed/${active.videoId}?rel=0`}
                    title={active.title || "Learning video"}
                    allow="accelerometer;autoplay;gyroscope;"
                    allowFullScreen
                  />
                ) : null}
              </div>
              {active && (
                <div className="p-3">
                  <strong className="clamp-2" style={{ fontSize: 15 }}>{active.title}</strong>
                </div>
              )}
            </div>
          </Col>
          <Col lg={4}>
            <div className="section-card p-2" style={{ maxHeight: "72vh", overflowY: "auto" }}>
              {data?.map((v) => {
                const isActive = v.videoId === (videoId || active?.videoId);
                return (
                  <Link key={v._id} to={`/learning?watch=${v.videoId}`} style={{ textDecoration: "none" }}>
                    <div
                      className="d-flex gap-2 p-2 mb-2"
                      style={{
                        borderRadius: 10,
                        border: isActive ? "1px solid var(--redis-red)" : "1px solid var(--border)",
                        background: isActive ? "var(--redis-red-soft)" : "#fff",
                      }}
                    >
                      <img
                        src={v.image}
                        alt={v.title}
                        style={{ width: 112, height: 64, objectFit: "cover", borderRadius: 8, flexShrink: 0 }}
                        loading="lazy"
                      />
                      <div className="clamp-2" style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", lineHeight: 1.4 }}>
                        {v.title}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Col>
        </Row>
      )}

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: 16 }}>Add playlist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label className="form-label" style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)" }} htmlFor="playlist-id">
            YouTube playlist / video ID
          </label>
          <input
            type="text"
            className="form-control"
            id="playlist-id"
            placeholder="e.g. PLxxxx…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") addVideo(e); }}
          />
          <button className="btn btn-redis mt-3 w-100" onClick={(e) => addVideo(e)}>
            Add playlist
          </button>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default VideoBox;
