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
import { Col, Row } from "react-bootstrap";
import Axios from "../../utils/axios";
import { useParams } from "react-router-dom";
function Company() {
    const { id } = useParams();
    const [spinner, setSpinner] = useState(false);
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
                const resp = await Axios.post("/addCompany", {
                    ...data,
                });
                if (resp.data.success) {
                    showToastSuccess(resp.data.message);
                } else {
                    showToastError(resp.data.message);
                }
            } catch (error) {
                showToastError(error.message);
            } finally {
                setSpinner(false);
                removeSpinner(e, "Submit");
            }
        } else {
            setSpinner(false);
            removeSpinner(e, "Submit");
            showToastError("add proper fields!");
        }
    };
    const updateCompany = async (e,) => {
        addSpinner(e)
        const { name, skill, role, status } = data;
        if (name && skill && role && status) {
            try {
                const resp = await Axios.post("/updateCompany", {
                    ...data,
                });
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

    // fetch task
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
        }
    };
    // fetch company by id
    const fetchCompanyById = async () => {
        try {
            const resp = await Axios.post("/getCompanyById", { id: id });
            if (resp.data.success) {
                const { name, role, skill, status, _id } = resp.data.data;
                setData({
                    name: name,
                    role: role,
                    skill: skill,
                    status: status,
                    id: _id,
                });
            } else {
                showToastError(resp.data.message);
            }
        } catch (error) {
            showToastError(error.message);
        }
    };

    const addTaskCompany = async (e, id) => {
        addSpinner(e);
        if (text) {
            try {
                const resp = await Axios.post("/addCompanyTask", {
                    name: text,
                    company: id,
                });
                if (resp.data.success) {
                    showToastSuccess(resp.data.message);
                } else {
                    showToastError(resp.data.message);
                }
            } catch (error) {
                showToastError("Task added failed");
            } finally {
                removeSpinner(e, "Add task");
                getCompany();
            }
        } else {
            showToastError("please add task");
            removeSpinner(e, "Add task");
        }
    };

    useEffect(() => {
        getCompany();
        if (id !== undefined) {
            fetchCompanyById();
        }
        // eslint-disable-next-line
    }, []);
    return (
        <>
            <section>
                <div className="companyStatus issResolveCon">
                    <div
                        style={{ background: backDark, padding: ".5em", color: "white" }}
                    >
                        <h2>Add new company {spinner && <SpinnerRole />}</h2>
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
                                <Tab eventKey="home" title="Add company">
                                    <div className="form" name="form">
                                        <div class="mb-3">
                                            <label for="exampleFormControlInput1" class="form-label">
                                                <strong>Company name</strong>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                class="form-control"
                                                id="exampleFormControlInput1"
                                                placeholder="xyz"
                                                onChange={handleComp}
                                                value={data.name}
                                                required={true}
                                            />
                                        </div>
                                        <div class="mb-3">
                                            <label for="exampleFormControlInput1" class="form-label">
                                                <strong>Role</strong>
                                            </label>
                                            <input
                                                type="text"
                                                name="role"
                                                class="form-control"
                                                id="exampleFormControlInput1"
                                                placeholder="SDE"
                                                onChange={handleComp}
                                                value={data.role}
                                                required={true}
                                            />
                                        </div>
                                        <div class="mb-3">
                                            <label for="exampleFormControlInput1" class="form-label">
                                                <strong>Skill</strong>
                                            </label>
                                            <input
                                                type="text"
                                                name="skill"
                                                class="form-control"
                                                id="exampleFormControlInput1"
                                                placeholder="Java"
                                                onChange={handleComp}
                                                value={data.skill}
                                                required={true}
                                            />
                                        </div>
                                        <select
                                            class="mb-3 form-select"
                                            aria-label="Default select example"
                                            name="status"
                                            onChange={handleComp}
                                            required={true}
                                        >
                                            <option selected disabled>
                                                {data.status}
                                            </option>
                                            <option value="Running">Running</option>
                                            <option value="Ends up">Ends up</option>
                                        </select>

                                        {id !== undefined ? (
                                            <button
                                                className="btn border"
                                                style={{ backgroundColor: backDark, color: "white" }}
                                                onClick={(e) => updateCompany(e, data._id)}
                                            >
                                                Update company
                                            </button>
                                        ) : (
                                            <button
                                                className="btn border"
                                                style={{ backgroundColor: backDark, color: "white" }}
                                                onClick={(e) => addCompany(e)}
                                            >
                                                submit
                                            </button>
                                        )}
                                    </div>
                                </Tab>
                                <Tab eventKey="profile" title="Company Profile">
                                    <Row>
                                        {company?.map((d, index) => {
                                            return (
                                                <Col lg={4} className="mb-4" key={index}>
                                                    <div class="card">
                                                        <div class="card-body">
                                                            <h5 class="card-title">
                                                                <strong># {d.name}</strong>
                                                            </h5>

                                                            <div className="form mt-3">
                                                                <div class="mb-3">
                                                                    <h6>Add task</h6>
                                                                    <input
                                                                        type="email"
                                                                        class="form-control"
                                                                        id="exampleFormControlInput1"
                                                                        placeholder="xyz"
                                                                        onChange={(e) => setText(e.target.value)}
                                                                    />
                                                                </div>
                                                                <button
                                                                    className="btn border"
                                                                    style={{
                                                                        backgroundColor: backDark,
                                                                        color: "white",
                                                                    }}
                                                                    onClick={(e) => addTaskCompany(e, d._id)}
                                                                >
                                                                    Add task
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>
                                            );
                                        })}
                                    </Row>
                                </Tab>
                                <Tab eventKey="history" title="History" disabled>
                                    <Row>
                                        {[...new Array(6)].map((d, index) => {
                                            return (
                                                <Col lg={4} className="mb-4" key={index}>
                                                    <div class="card">
                                                        <div class="card-body">
                                                            <h5 class="card-title">
                                                                <strong>Company name</strong>
                                                            </h5>
                                                            <div className="card-text">
                                                                <li>npwie</li>
                                                                <li>npwie</li>
                                                                <li>npwie</li>
                                                                <li>npwie</li>
                                                                <li>npwie</li>
                                                                <li>npwie</li>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>
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

export default Company;
