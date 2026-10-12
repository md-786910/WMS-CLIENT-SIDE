import React, { useEffect, useRef, useState } from "react";
import {
  addSpinner,
  removeSpinner,
  showToastError,
  showToastSuccess,
} from "../../utils/action";
import { Col, Row } from "react-bootstrap";
import Axios from "../../utils/axios";
import { useLocation } from "react-router-dom";
import { PageHeader, SkeletonCards, EmptyState } from "../ui/chrome";

function isUrl(s) {
  try { const u = new URL(s); return u.protocol.startsWith("http"); } catch { return false; }
}

function Task(props) {
  const location = useLocation();
  const cardRef = useRef(null)
  const [title, setTitle] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const renderCount = parseInt(location.search?.slice(6))
  const [cardNo] = useState(renderCount)

  const addTask = async (e) => {
    addSpinner(e);
    if (title.trim()) {
      try {
        const resp = await Axios.post("/addTask", { title: title.trim() });
        if (resp.data.success) {
          showToastSuccess(resp.data.message);
        } else {
          showToastError(resp.data.message);
        }
      } catch (error) {
        showToastError("Task added failed");
      } finally {
        removeSpinner(e, "Add task");
        getTask();
      }
    } else {
      showToastError("please add note!");
      removeSpinner(e, "Add task");
    }
    setTitle("");
  };

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
    } finally {
      setLoading(false);
    }
  };
  const deleteTask = async (e, id) => {
    addSpinner(e);
    try {
      const resp = await Axios.post("/removeTask", { id: id });
      if (resp.data.success) {
        showToastSuccess(resp.data.message);
      } else {
        showToastError(resp.data.message);
      }
    } catch (error) {
      showToastError("Delete failed");
    } finally {
      removeSpinner(e, "Remove");
      getTask();
    }
  };

  useEffect(() => {
    getTask();
    // eslint-disable-next-line
  }, [cardRef]);

  useEffect(() => {
    if (cardRef.current) {
      const cardToScrollTo = cardRef.current.children[cardNo - 1];
      if (cardToScrollTo) {
        setTimeout(() => {
          cardToScrollTo.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 50);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderCount, location.search]);

  return (
    <div className="content-stack">
      <PageHeader
        breadcrumb="WMS · Tasks"
        title="My tasks"
        sub={loading ? "Loading…" : `${data.length} total — quick capture, link-aware.`}
        right={<span className="pill pill-neutral">{loading ? "…" : data.length}</span>}
      />

      <div className="section-card p-3 p-md-4">
        <div className="d-flex gap-2" style={{ maxWidth: 640 }}>
          <input
            type="text"
            className="form-control"
            placeholder="Add task… paste a link or type a note, Enter to save"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") addTask(e); }}
          />
          <button className="btn btn-redis flex-shrink-0" onClick={(e) => addTask(e)}>
            Add task
          </button>
        </div>

        <div className="mt-4">
          {loading ? (
            <SkeletonCards n={3} />
          ) : data?.length === 0 ? (
            <EmptyState title="No tasks yet" sub="Capture your first task above — it takes seconds." />
          ) : (
            <Row className="g-3" ref={(el) => { cardRef.current = el }}>
              {data?.map((d, index) => {
                const url = isUrl(d?.title);
                const hl = cardNo === index + 1;
                return (
                  <Col md={6} xl={4} key={d._id || index}>
                    <div className="card wms-card h-100" style={hl ? { borderColor: "var(--redis-red)", boxShadow: "var(--shadow-md)" } : undefined}>
                      <div className="card-body d-flex flex-column">
                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--faint)" }}>
                          Task #{index + 1}{hl ? " · highlighted" : ""}
                        </div>
                        <div className="mt-1 clamp-2" style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.45, wordBreak: "break-word" }}>
                          {url ? (
                            <a href={d?.title} rel="noreferrer" target="_blank">{d?.title}</a>
                          ) : (
                            d?.title
                          )}
                        </div>
                        <div className="mt-auto pt-3 d-flex gap-2">
                          {url && (
                            <a href={d?.title} rel="noreferrer" target="_blank" className="btn btn-sm btn-ink">Open link</a>
                          )}
                          <button className="btn btn-sm btn-outline-danger ms-auto" onClick={(e) => deleteTask(e, d._id)}>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          )}
        </div>
      </div>
    </div>
  );
}

export default Task;
