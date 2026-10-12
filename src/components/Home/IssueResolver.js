import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { addSpinner, removeSpinner, showToastError, showToastSuccess } from "../../utils/action";
import Axios from "../../utils/axios";
import { Link } from "react-router-dom";
import { Section, StatusBadge, SkeletonCards, EmptyState } from "../ui/chrome";

function stripHtml(html) {
    const div = document.createElement("div");
    div.innerHTML = html || "";
    return (div.textContent || div.innerText || "").trim();
}

function IssueResolver() {
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState([]);

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

    const removedIssues = async (e, id) => {
        addSpinner(e);
        try {
            const resp = await Axios.post("/removeIssues", { id: id });
            if (resp.data.success) {
                showToastSuccess(resp.data.message);
            } else {
                showToastError(resp.data.message);
            }
        } catch (error) {
            showToastError("Remove failed")
        } finally {
            removeSpinner(e, "Remove")
            fetchIssues();
        }
    }

    useEffect(() => {
        fetchIssues();
        // eslint-disable-next-line
    }, []);

    const open = data?.filter(d => !d.isResolved).length || 0;

    return (
        <Section
            title="Issues"
            count={spinner ? undefined : data.length}
            sub={spinner ? "Loading…" : open > 0 ? `${open} open` : "All resolved"}
            action={<Link to="/resolve" className="btn btn-sm btn-ink">View all</Link>}
        >
            {spinner ? (
                <SkeletonCards n={2} />
            ) : data?.length === 0 ? (
                <EmptyState
                    title="No issues yet"
                    sub="Create your first issue to start tracking."
                    action={<Link to="/add-issues" className="btn btn-sm btn-redis">+ New issue</Link>}
                />
            ) : (
                <Row className="g-3">
                    {data?.slice(0, 6).map((d, index) => {
                        const preview = stripHtml(d.content).slice(0, 120);
                        return (
                            <Col md={6} xl={6} key={d._id || index}>
                                <div className="card wms-card h-100">
                                    <div className="card-header d-flex align-items-start justify-content-between gap-2">
                                        <div style={{ minWidth: 0 }}>
                                            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--faint)" }}>
                                                Issue #{index + 1}
                                            </div>
                                            <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.4 }} className="clamp-2">
                                                {d.title}
                                            </div>
                                        </div>
                                        <StatusBadge status={d.isResolved ? "Resolved" : "Pending"} />
                                    </div>
                                    <div className="card-body d-flex flex-column">
                                        {preview && (
                                            <p className="clamp-2" style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>
                                                {preview}{preview.length >= 120 ? "…" : ""}
                                            </p>
                                        )}
                                        <div className="mt-auto d-flex gap-2">
                                            <Link to={`/resolve/${d._id}`} className="btn btn-sm btn-ink">Open</Link>
                                            <button className="btn btn-sm btn-outline-danger" onClick={(e) => removedIssues(e, d._id)}>
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
        </Section>
    );
}

export default IssueResolver;
