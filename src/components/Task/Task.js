import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { backDark } from "../../utils/color";
import {
  addSpinner,
  removeSpinner,
  showToastError,
  showToastSuccess,
} from "../../utils/action";
import { Col, Row } from "react-bootstrap";
import Axios from "../../utils/axios";
import { useLocation } from "react-router-dom";

function Task(props) {
  const location = useLocation();
  const cardRef = useRef(null)
  const [title, setTitle] = useState("");
  const [data, setData] = useState([]);

  const renderCount = parseInt(location.search?.slice(6))
  const [cardNo, setCardNo] = useState(renderCount)

  // add task
  const addTask = async (e) => {
    addSpinner(e);
    if (title) {
      try {
        const resp = await Axios.post("/addTask", {
          title: title,
        });
        if (resp.data.success) {
          showToastSuccess(resp.data.message);
          // handleSize(Math.random());
        } else {
          showToastError(resp.data.message);
        }
      } catch (error) {
        showToastError("Task added failed");
      } finally {
        removeSpinner(e, "Add Task");
        getTask();
      }
    } else {
      showToastError("please add note!");
      removeSpinner(e, "Add Task");
    }
    setTitle("");
  };

  // fetch task
  const getTask = async () => {
    try {
      const resp = await Axios.get("/getTask");
      if (resp.data.success) {
        setData(resp.data.data);
        return;
      } else {
        showToastError(resp.data.message);
      }
    } catch (error) {
      showToastError(error.message);
    }
  };
  // delete task
  const deleteTask = async (e, id) => {
    addSpinner(e);
    try {
      const resp = await Axios.post("/removeTask", { id: id });
      if (resp.data.success) {
        showToastSuccess(resp.data.message);
        // handleSize(Math.random());
      } else {
        showToastError(resp.data.message);
      }
    } catch (error) {
      showToastError("Task added failed");
    } finally {
      removeSpinner(e, "Add Task");
      getTask();
    }
  };

  useEffect(() => {
    getTask();
    // eslint-disable-next-line
  }, [cardRef]);

  // useEffect(() => {
  //   setCardNo(cardLocation)
  // }, [cardLocation])
  useEffect(() => {
    if (cardRef.current) {
      const cardElement = cardRef.current;
      const cardToScrollTo = cardElement.children[cardNo - 1];
      if (cardToScrollTo) {
        setTimeout(() => {
          const offsetTop = cardToScrollTo.offsetTop;
          window.scrollTo(0, offsetTop);
        }, 10);

      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderCount, cardRef, location.search]);

  return (
    <>
      <section>
        <div className="companyStatus issResolveCon">
          <div
            style={{ background: backDark, padding: ".5em", color: "white" }}
          >
            <h2>My task</h2>
          </div>
          <div className="divider"></div>

          <div class="card">
            <div class="card-header ">
              <div>
                <label for="exampleFormControlInput1" class="form-label">
                  <strong>Add task</strong>
                </label>
                <input
                  type="email"
                  class="form-control w-100"
                  id="exampleFormControlInput1"
                  placeholder="task.."
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <button
                  className="btn border mt-3"
                  style={{ backgroundColor: backDark, color: "white" }}
                  onClick={(e) => addTask(e)}
                >
                  Add task
                </button>
              </div>
            </div>

            <Row
              ref={(el) => { cardRef.current = el }}

            >
              {data?.map((d, index) => {
                return (
                  <Col col={12} lg={4} md={4} sm={6} key={index}>
                    <div
                      class="card-body"

                    >
                      <div style={{
                        height: "12rem",
                        border: cardNo === index + 1 ? "5px solid blue" : "1px solid gray"
                      }}
                      >
                        <div class="card-header">
                          <h5>#Task - {index + 1}</h5>
                        </div>
                        <div class="card-body ">
                          <a
                            href={d?.title}
                            rel="noreferrer"
                            target="_blank"
                            class="card-title"
                          >
                            {d?.title?.slice(0, 39)}
                          </a>
                          <div className="mt-2">
                            <button
                              className="btn btn-danger"
                              onClick={(e) => deleteTask(e, d._id)}
                            >
                              remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </div>
        </div>
      </section >
    </>
  );
}

export default Task;
