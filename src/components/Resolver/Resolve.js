import React, { useEffect, useState } from "react";
import { backDark } from "../../utils/color";
import {
  SpinnerRole,
  addSpinner,
  removeSpinner,
  showToastError,
  showToastSuccess,
} from "../../utils/action";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { Button, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BsCheckCircleFill } from "react-icons/bs";
import { TiDelete } from "react-icons/ti";
import { FaEdit } from "react-icons/fa";

import { RxCross2 } from "react-icons/rx";
import Axios from "../../utils/axios";
function Resolve() {
  const [spinner, setSpinner] = useState(true);
  const [data, setData] = useState([]);
  // add task
  const resolvedIssues = async (e, id) => {
    addSpinner(e);
    try {
      const resp = await Axios.patch("/updateIssues", { id: id });
      if (resp.data.success) {
        showToastSuccess(resp.data.message);
      } else {
        showToastError(resp.data.message);
      }
    } catch (error) {
      showToastError("Task added failed");
    } finally {
      removeSpinner(e, "Resolve ❌");
      fetchIssues();
    }
  };

  // fetch task
  const fetchIssues = async () => {
    try {
      const resp = await Axios.get("/getIssues");
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
  // delete task
  const deleteIssues = async (e, id) => {
    addSpinner(e);
    try {
      const resp = await Axios.post("/removeIssues", { id: id });
      if (resp.data.success) {
        showToastSuccess(resp.data.message);
      } else {
        showToastError(resp.data.message);
      }
    } catch (error) {
      showToastError("Task added failed");
    } finally {
      removeSpinner(e, "Remove");
      fetchIssues();
    }
  };

  useEffect(() => {
    fetchIssues();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <section>
        <div className="companyStatus issResolveCon">
          <div
            style={{ background: backDark, padding: ".5em", color: "white" }}
          >
            <h2>Your resolver {spinner && <SpinnerRole />}</h2>
          </div>
          <div className="divider"></div>

          <div class="card">
            <div class="card-body">
              <Tabs
                defaultActiveKey="home"
                id="justify-tab-example"
                className="mb-3"
                justify
              >
                <Tab eventKey="home" title={`Resolve issues`}>
                  <Row>
                    {data?.map((d, index) => {
                      return (
                        d.isResolved && (
                          <Col lg={4} className="mb-4" key={index}>
                            <div
                              class="card"
                              style={{
                                height: "15rem",
                              }}
                            >
                              <div class="card-body">
                                <h5 class="card-title">
                                  <strong>{d.title}</strong>
                                </h5>
                                <p
                                  class="card-text"
                                  dangerouslySetInnerHTML={{
                                    __html: d.content.substr(0, 100),
                                  }}
                                ></p>
                                <div className="d-flex gap-4 position-absolute bottom-0 pb-2">
                                  <button
                                    style={{
                                      border: "none",
                                    }}
                                  >
                                    <Link to={`/resolve/${d._id}`} class="btn">
                                      Read &nbsp;
                                      <BsCheckCircleFill
                                        color={"green"}
                                        size={18}
                                      />
                                    </Link>
                                  </button>
                                  <button
                                    style={{
                                      border: "none",
                                    }}
                                  >
                                    <Link
                                      to={`/add-issues/${d?._id}/`}
                                      class="btn"
                                    >
                                      Edit &nbsp;
                                      <FaEdit color={"blue"} size={18} />
                                    </Link>
                                  </button>
                                  <button
                                    style={{
                                      border: "none",
                                    }}
                                    onClick={(e) => deleteIssues(e, d._id)}
                                  >
                                    <Link to="#" class="btn">
                                      Delete &nbsp;
                                      <TiDelete color={"red"} size={27} />
                                    </Link>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </Col>
                        )
                      );
                    })}
                  </Row>
                </Tab>
                <Tab eventKey="profile" title="Pending">
                  <Row>
                    {data?.map((d, index) => {
                      return (
                        !d.isResolved && (
                          <Col lg={4} className="mb-4" key={index}>
                            <div
                              class="card"
                              style={{
                                height: "15rem",
                              }}
                            >
                              <div class="card-body">
                                <h5 class="card-title">
                                  <strong>{d.title}</strong>
                                </h5>

                                <p
                                  class="card-text"
                                  dangerouslySetInnerHTML={{
                                    __html: d.content.substr(0, 100),
                                  }}
                                ></p>
                                <button
                                  class="btn border"
                                  onClick={(e) => resolvedIssues(e, d._id)}
                                >
                                  Resolve &nbsp;
                                  <RxCross2 color={"red"} size={18} />
                                </button>
                                <div
                                  className="btn mx-2"
                                  onClick={(e) => deleteIssues(e, d._id)}
                                >
                                  <button className="btn border">Remove</button>
                                </div>
                              </div>
                            </div>
                          </Col>
                        )
                      );
                    })}
                  </Row>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Resolve;
