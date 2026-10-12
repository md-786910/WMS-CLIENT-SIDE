import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Axios from "../../utils/axios";
import { addSpinner, removeSpinner, showToastError, showToastSuccess } from "../../utils/action";
import { Link } from "react-router-dom";
import { Section, StatusBadge, SkeletonCards, EmptyState } from "../ui/chrome";

function Company() {
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState([]);

    const compeleteTask = async (e, id) => {
        addSpinner(e);
        if (id) {
            try {
                const resp = await Axios.post("/completeTask", { id: id });
                if (resp.data.success) {
                    showToastSuccess("Task completed");
                } else {
                    showToastError(resp.data.message);
                }
            } catch (error) {
                showToastError("Task update failed")
            } finally {
                removeSpinner(e, "")
                fetchCompany();
            }
        } else {
            removeSpinner(e, "Add Task")
        }
    }

    const fetchCompany = async () => {
        try {
            const resp = await Axios.get("/getCompanyTask");
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

    const deleteCompany = async (e, id) => {
        const check = window.confirm("Are you sure you want to delete this company?");
        if (!check) return;
        addSpinner(e);
        try {
            const resp = await Axios.post("/removeCompany", { id: id });
            if (resp.data.success) {
                showToastSuccess(resp.data.message);
            } else {
                showToastError(resp.data.message);
            }
        } catch (error) {
            showToastError("Delete failed")
        } finally {
            removeSpinner(e, "Remove")
            fetchCompany();
        }
    }

    useEffect(() => {
        fetchCompany();
        // eslint-disable-next-line
    }, []);

    const openCount = data?.reduce((a, d) => a + (d.task?.filter(t => !t.isCompleted).length || 0), 0) || 0;

    return (
        <Section
            title="Companies"
            count={spinner ? undefined : data.length}
            sub={spinner ? "Loading…" : openCount > 0 ? `${openCount} tasks open` : "All clear"}
            action={<Link to="/add-company" className="btn btn-sm btn-ink">Manage</Link>}
        >
            {spinner ? (
                <SkeletonCards n={2} />
            ) : data?.length === 0 ? (
                <EmptyState
                    title="No companies yet"
                    sub="Add your first company to start tracking tasks."
                    action={<Link to="/add-company" className="btn btn-sm btn-redis">Add company</Link>}
                />
            ) : (
                <Row className="g-3">
                    {data?.map((d) => {
                        const open = d.task?.filter(t => !t.isCompleted) || [];
                        const initial = (d.company?.name || "?").trim().charAt(0).toUpperCase();
                        return (
                            <Col md={6} xl={6} key={d.company?._id}>
                                <div className="card wms-card h-100">
                                    <div className="card-header d-flex align-items-center justify-content-between gap-2">
                                        <div className="d-flex align-items-center gap-2" style={{ minWidth: 0 }}>
                                            <span className="avatar-initial red">{initial}</span>
                                            <div style={{ minWidth: 0 }}>
                                                <div style={{ fontSize: 15, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                    {d.company.name}
                                                </div>
                                                <div style={{ fontSize: 12, color: "var(--muted)" }}>
                                                    {open.length} open · {d.task?.length || 0} total
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                            <StatusBadge status={d.company.status} />
                                            <div className="dropdown">
                                                <button
                                                    className="btn btn-sm btn-outline-dark dropdown-toggle"
                                                    type="button"
                                                    id={`companyMenu${d.company._id}`}
                                                    data-bs-toggle="dropdown"
                                                    aria-expanded="false"
                                                    aria-label="Company actions"
                                                >
                                                    •••
                                                </button>
                                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby={`companyMenu${d.company._id}`}>
                                                    <li>
                                                        <Link className="dropdown-item" to={`/company/${d.company._id}`}>Open / Update</Link>
                                                    </li>
                                                    <li><hr className="dropdown-divider" /></li>
                                                    <li>
                                                        <button className="dropdown-item text-danger" onClick={(e) => deleteCompany(e, d.company._id)}>
                                                            Remove
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <Row className="g-3">
                                            <Col xs={6} md={4}>
                                                <div className="meta-label">Role</div>
                                                <div className="meta-value">{d.company.role || "—"}</div>
                                            </Col>
                                            <Col xs={6} md={4}>
                                                <div className="meta-label">Skill</div>
                                                <div className="meta-value clamp-2">{d.company.skill || "—"}</div>
                                            </Col>
                                            <Col xs={12} md={4}>
                                                <div className="meta-label">Status</div>
                                                <div className="meta-value">{d.company.status || "—"}</div>
                                            </Col>
                                        </Row>

                                        <div className="mt-3" style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
                                            <div className="d-flex align-items-center justify-content-between px-3 py-2" style={{ background: "#fafafa", borderBottom: "1px solid var(--border)" }}>
                                                <strong style={{ fontSize: 13 }}>Today's tasks</strong>
                                                {open.length > 0 && <span className="pill pill-danger" style={{ fontSize: 11 }}>{open.length} open</span>}
                                            </div>
                                            <div className="p-2" style={{ maxHeight: 220, overflowY: "auto" }}>
                                                {open.length === 0 && (
                                                    <div className="px-2 py-2" style={{ fontSize: 13, color: "var(--success)", fontWeight: 600 }}>
                                                        ✓ All clear — nothing pending.
                                                    </div>
                                                )}
                                                {open.map((t) => (
                                                    <div className="task-check list-row" key={t._id}>
                                                        <input
                                                            type="checkbox"
                                                            id={`task-${t._id}`}
                                                            onClick={(e) => compeleteTask(e, t._id)}
                                                            defaultChecked={false}
                                                            aria-label={`Complete ${t.name}`}
                                                        />
                                                        <label htmlFor={`task-${t._id}`} style={{ fontSize: 14 }}>
                                                            {t.name}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
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

export default Company;
