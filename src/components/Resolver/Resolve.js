import React, { useEffect, useState } from "react";
import {
  addSpinner,
  removeSpinner,
  showToastError,
  showToastSuccess,
} from "../../utils/action";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import Axios from "../../utils/axios";
import { PageHeader, StatusBadge, SkeletonCards, EmptyState } from "../ui/chrome";

function stripHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html || "";
  return (div.textContent || div.innerText || "").trim();
}

function IssueCard({ d, footer }) {
  const preview = stripHtml(d.content).slice(0, 140);
  return (
    <div className="card wms-card h-100">
      <div className="card-header d-flex align-items-start justify-content-between gap-2">
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.4 }} className="clamp-2">
            {d.title}
          </div>
        </div>
        <StatusBadge status={d.isResolved ? "Resolved" : "Pending"} />
      </div>
      <div className="card-body d-flex flex-column">
        {preview && (
          <p className="clamp-2" style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>
            {preview}{preview.length >= 140 ? "…" : ""}
          </p>
        )}
        <div className="mt-auto">{footer}</div>
      </div>
    </div>
  );
}

function Resolve() {
  const [spinner, setSpinner] = useState(true);
  const [data, setData] = useState([]);

  const resolvedIssues = async (e, id) => {
    addSpinner(e);
    try {
      const resp = await Axios.patch(`/updateIssues/status/${id}`);
      if (resp.data.success) {
        showToastSuccess(resp.data.message);
      } else {
        showToastError(resp.data.message);
      }
    } catch (error) {
      showToastError("Restore failed");
    } finally {
      removeSpinner(e, "Restore");
      fetchIssues();
    }
  };

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

  const deleteIssues = async (e, id) => {
    addSpinner(e);
    try {
      const resp = await Axios.delete(`/removeIssues/${id}`);
      if (resp.data.success) {
        showToastSuccess(resp.data.message);
      } else {
        showToastError(resp.data.message);
      }
    } catch (error) {
      showToastError("Delete failed");
    } finally {
      removeSpinner(e, "Remove");
      fetchIssues();
    }
  };

  const deletePermanentTask = async (e, id) => {
    addSpinner(e);
    try {
      const resp = await Axios.delete(`/permanent-delete/${id}`);
      if (resp.data.success) {
        showToastSuccess(resp.data.message);
      } else {
        showToastError(resp.data.message);
      }
    } catch (error) {
      showToastError("Delete failed");
    } finally {
      removeSpinner(e, "Remove");
      fetchIssues();
    }
  };

  useEffect(() => {
    fetchIssues();
    // eslint-disable-next-line
  }, []);

  const active = data?.filter((d) => !d.isDeleted) || [];
  const trashed = data?.filter((d) => d.isDeleted) || [];

  return (
    <div className="content-stack">
      <PageHeader
        breadcrumb="WMS · Resolve"
        title="Resolver"
        sub={spinner ? "Loading…" : `${active.length} active · ${trashed.length} in trash`}
        right={
          <Link to="/add-issues" className="btn btn-sm btn-redis">
            + New issue
          </Link>
        }
      />

      <div className="section-card p-3 p-md-4">
        {spinner ? (
          <SkeletonCards n={3} />
        ) : (
          <Tabs defaultActiveKey="home" id="resolve-tabs" className="mb-3" justify>
            <Tab eventKey="home" title={`Active (${active.length})`}>
              {active.length === 0 ? (
                <EmptyState
                  title="No active issues"
                  sub="All clear — create a new issue to get started."
                  action={<Link to="/add-issues" className="btn btn-sm btn-redis">+ New issue</Link>}
                />
              ) : (
                <Row className="g-3 mt-1">
                  {active.map((d) => (
                    <Col md={6} xl={4} key={d._id}>
                      <IssueCard
                        d={d}
                        footer={
                          <div className="d-flex gap-2">
                            <Link to={`/resolve/${d._id}`} className="btn btn-sm btn-ink">Read</Link>
                            <Link to={`/add-issues/${d?._id}/`} className="btn btn-sm btn-outline-dark">Edit</Link>
                            <button className="btn btn-sm btn-outline-danger ms-auto" onClick={(e) => deleteIssues(e, d._id)}>
                              Delete
                            </button>
                          </div>
                        }
                      />
                    </Col>
                  ))}
                </Row>
              )}
            </Tab>
            <Tab eventKey="profile" title={`Trash (${trashed.length})`}>
              {trashed.length === 0 ? (
                <EmptyState title="Trash is empty" sub="Deleted issues will show up here." />
              ) : (
                <Row className="g-3 mt-1">
                  {trashed.map((d) => (
                    <Col md={6} xl={4} key={d._id}>
                      <IssueCard
                        d={d}
                        footer={
                          <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-ink" onClick={(e) => resolvedIssues(e, d._id)}>
                              Restore
                            </button>
                            <button className="btn btn-sm btn-outline-danger ms-auto" onClick={(e) => deletePermanentTask(e, d._id)}>
                              Delete forever
                            </button>
                          </div>
                        }
                      />
                    </Col>
                  ))}
                </Row>
              )}
            </Tab>
          </Tabs>
        )}
      </div>
    </div>
  );
}

export default Resolve;
