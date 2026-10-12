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
import Axios from "../../utils/axios";
import { useParams, Link } from "react-router-dom";
import { PageHeader, StatusBadge, SkeletonCards, EmptyState } from "../ui/chrome";

function Company() {
    const { id } = useParams();
    const isEdit = id !== undefined;
    const [spinner, setSpinner] = useState(false);
    const [loadingList, setLoadingList] = useState(true);
    const [data, setData] = useState({
        name: "",
        role: "",
        skill: "",
        status: "",
    });
    const [text, setText] = useState("");

    const handleComp = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };
    const [company, setCompany] = useState([]);
    const addCompany = async (e) => {
        setSpinner(true);
        const { name, skill, role, status } = data;
        if (name && skill && role && status) {
            try {
                const resp = await Axios.post("/addCompany", { ...data });
                if (resp.data.success) {
                    showToastSuccess(resp.data.message);
                    setData({ name: "", role: "", skill: "", status: "" });
                } else {
                    showToastError(resp.data.message);
                }
            } catch (error) {
                showToastError(error.message);
            } finally {
                setSpinner(false);
                removeSpinner(e, "Submit");
                getCompany();
            }
        } else {
            setSpinner(false);
            removeSpinner(e, "Submit");
            showToastError("add proper fields!");
        }
    };
    const updateCompany = async (e) => {
        addSpinner(e)
        const { name, skill, role, status } = data;
        if (name && skill && role && status) {
            try {
                const resp = await Axios.post("/updateCompany", { ...data });
                if (resp.data.success) {
                    showToastSuccess(resp.data.message);
                } else {
                    showToastError(resp.data.message);
                }
            } catch (error) {
                showToastError(error.message);
            } finally {
                removeSpinner(e, "Update company");
            }
        } else {
            removeSpinner(e, "Update company");
            showToastError("add proper fields!");
        }
    };

    const getCompany = async () => {
        try {
            const resp = await Axios.get("/getCompany");
            if (resp.data.success) {
                setCompany(resp.data.data);
                return;
            } else {
                showToastError(resp.data.message);
            }
        } catch (error) {
            showToastError(error.message);
        } finally {
            setLoadingList(false);
        }
    };
    const fetchCompanyById = async () => {
        try {
            const resp = await Axios.post("/getCompanyById", { id: id });
            if (resp.data.success) {
                const { name, role, skill, status, _id } = resp.data.data;
                setData({ name, role, skill, status, id: _id });
            } else {
                showToastError(resp.data.message);
            }
        } catch (error) {
            showToastError(error.message);
        }
    };

    const addTaskCompany = async (e, compId, taskText, clear) => {
        addSpinner(e);
        if (taskText) {
            try {
                const resp = await Axios.post("/addCompanyTask", {
                    name: taskText,
                    company: compId,
                });
                if (resp.data.success) {
                    showToastSuccess(resp.data.message);
                    clear?.();
                } else {
                    showToastError(resp.data.message);
                }
            } catch (error) {
                showToastError("Task added failed");
            } finally {
                removeSpinner(e, "Add");
                getCompany();
            }
        } else {
            showToastError("please add task");
            removeSpinner(e, "Add");
        }
    };

    useEffect(() => {
        getCompany();
        if (isEdit) {
            fetchCompanyById();
        }
        // eslint-disable-next-line
    }, [id]);

    const inputCls = "form-control";
    const labelStyle = { fontSize: 12, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--muted)" };

    return (
        <div className="content-stack">
            <PageHeader
                breadcrumb={isEdit ? "WMS · Company · Edit" : "WMS · Company"}
                title={isEdit ? (data.name || "Edit company") : "Companies"}
                sub={isEdit ? "Update details, then save." : `${company.length} total — add, profile & assign tasks.`}
                right={
                    isEdit ? (
                        <Link to="/add-company" className="btn btn-sm btn-ink">← All companies</Link>
                    ) : (
                        <span className="pill pill-neutral">{company.length}</span>
                    )
                }
            />

            <div className="section-card p-3 p-md-4">
                <Tabs defaultActiveKey={isEdit ? "home" : "home"} id="company-tabs" className="mb-3" justify>
                    <Tab eventKey="home" title={isEdit ? "Edit company" : "Add company"}>
                        <Row className="g-3" style={{ maxWidth: 720 }}>
                            <Col md={6}>
                                <label className="form-label" style={labelStyle} htmlFor="comp-name">Company name</label>
                                <input type="text" name="name" className={inputCls} id="comp-name" placeholder="Acme Inc" onChange={handleComp} value={data.name} required />
                            </Col>
                            <Col md={6}>
                                <label className="form-label" style={labelStyle} htmlFor="comp-role">Role</label>
                                <input type="text" name="role" className={inputCls} id="comp-role" placeholder="SDE" onChange={handleComp} value={data.role} required />
                            </Col>
                            <Col md={6}>
                                <label className="form-label" style={labelStyle} htmlFor="comp-skill">Skill</label>
                                <input type="text" name="skill" className={inputCls} id="comp-skill" placeholder="Java, React" onChange={handleComp} value={data.skill} required />
                            </Col>
                            <Col md={6}>
                                <label className="form-label" style={labelStyle} htmlFor="comp-status">Status</label>
                                <select className="form-select" id="comp-status" name="status" onChange={handleComp} value={data.status} required>
                                    <option value="" disabled>Select status…</option>
                                    <option value="Running">Running</option>
                                    <option value="Ends up">Ends up</option>
                                </select>
                            </Col>
                            <Col xs={12}>
                                {isEdit ? (
                                    <button className="btn btn-redis" onClick={(e) => updateCompany(e)}>Update company</button>
                                ) : (
                                    <button className="btn btn-redis" onClick={(e) => addCompany(e)}>Add company</button>
                                )}
                            </Col>
                        </Row>
                    </Tab>
                    <Tab eventKey="profile" title={`Profiles (${company.length})`}>
                        {loadingList ? (
                            <SkeletonCards n={3} />
                        ) : company?.length === 0 ? (
                            <EmptyState title="No companies yet" sub="Add your first company from the previous tab." />
                        ) : (
                            <Row className="g-3 mt-1">
                                {company?.map((d) => (
                                    <CompanyTaskCard key={d._id} d={d} onAdd={addTaskCompany} />
                                ))}
                            </Row>
                        )}
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
}

function CompanyTaskCard({ d, onAdd }) {
    const [val, setVal] = useState("");
    const initial = (d.name || "?").trim().charAt(0).toUpperCase();
    return (
        <Col md={6} xl={4}>
            <div className="card wms-card h-100">
                <div className="card-header d-flex align-items-center justify-content-between gap-2">
                    <div className="d-flex align-items-center gap-2" style={{ minWidth: 0 }}>
                        <span className="avatar-initial red">{initial}</span>
                        <strong className="clamp-2" style={{ fontSize: 14 }}>{d.name}</strong>
                    </div>
                    <StatusBadge status={d.status} />
                </div>
                <div className="card-body">
                    <div className="d-flex gap-2">
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="New task…"
                            value={val}
                            onChange={(e) => setVal(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") onAdd(e, d._id, val, () => setVal("")); }}
                        />
                        <button className="btn btn-sm btn-ink flex-shrink-0" onClick={(e) => onAdd(e, d._id, val, () => setVal(""))}>
                            Add
                        </button>
                    </div>
                    <div className="mt-2">
                        <Link to={`/company/${d._id}`} style={{ fontSize: 12 }}>Open / edit →</Link>
                    </div>
                </div>
            </div>
        </Col>
    );
}

export default Company;
