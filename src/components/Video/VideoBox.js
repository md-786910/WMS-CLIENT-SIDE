import React, { useEffect, useState } from "react";
import { backDark } from "../../utils/color";
import {
  SpinnerRole,
  addSpinner,
  removeSpinner,
  showToastError,
  showToastSuccess,
} from "../../utils/action";
import { Col, Row, Modal, Button, Card } from "react-bootstrap";
import Axios from "../../utils/axios";
import { Link, useLocation } from "react-router-dom";

function VideoBox() {
  const videoId = useLocation().search.slice(7);
  const [title, setTitle] = useState("");
  const [data, setData] = useState([]);
  const [spinner, setSpinner] = useState(true);

  // Model
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // add video
  const addVideo = async (e) => {
    addSpinner(e);
    if (title) {
      try {
        const resp = await Axios.post("/postVideo", {
          title: title,
        });
        if (resp.data.success) {
          showToastSuccess(resp.data.message);
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

  // fetch video
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

  return (
    <>
      <div style={{ background: "black" }}>
        <div className="companyStatus issResolveCon">
          <div
            className="d-flex gap-3"
            style={{ background: backDark, padding: ".5em", color: "white" }}
          >
            <h2>My learning {spinner && <SpinnerRole />}</h2>
            <Button
              variant="bg-black border text-white"
              onClick={() => handleShow()}
            >
              Add Video
            </Button>
          </div>

          <div className="divider"></div>

          <div className="">
            <Row className="px-2">
              <Col lg={8} className="border">
                <div className="iframeVideo ">
                  <iframe
                    width="100%"
                    height="560"
                    src={`https://www.youtube.com/embed/${videoId}?rel=0&amp;autoplay=1&amp;controls=1&amp;showinfo=0&suggest=none`}

                    title="YouTube video player"
                    frameborder="1"
                    allow="accelerometer;autoplay;gyroscope;"
                    allowFullScreen
                  />
                </div>
              </Col>

              <Col lg={4} className="border">
                <div
                  className="videoSame mt-2"
                  style={{ height: "100dvh", overflowY: "auto" }}
                >
                  {data?.map((_, idx) => (
                    <Link to={`/learning?watch=${_.videoId}`} key={_._id}>
                      <Card
                        className="mb-3 bg-black text-white border"
                        style={{ cursor: "pointer" }}
                        key={idx}
                      >
                        <Row>
                          <Col lg={6}>
                            <div>
                              <Card.Img
                                variant="top"
                                src={_.image}
                                className="img-size"
                              />
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div>
                              <Card.Body>
                                <Card.Title>{_.title}</Card.Title>
                              </Card.Body>
                            </div>
                          </Col>
                        </Row>
                      </Card>
                    </Link>
                  ))}
                </div>
              </Col>

              <Col lg={12}>

                <button>
                  Prev
                </button>

              </Col>
            </Row>
          </div>
        </div>

        <Modal show={show} onHide={handleClose} animation={false} centered>
          <Modal.Header closeButton>
            <Modal.Title>Add Video Id / Plyalist Id</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <label for="exampleFormControlInput1" class="form-label">
                <strong>Add playlist</strong>
              </label>
              <input
                type="text"
                class="form-control w-100"
                id="exampleFormControlInput1"
                placeholder="playlist Id.."
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required={true}
              />
              <button
                className="btn border mt-3"
                style={{ backgroundColor: backDark, color: "white" }}
                onClick={(e) => addVideo(e)}
              >
                Add playlist
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default VideoBox;
