import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { backDark } from "../../utils/color";
import Axios from "../../utils/axios";
import { SpinnerRole, addSpinner, removeSpinner, showToastError, showToastSuccess } from "../../utils/action";
import { Link } from "react-router-dom";

function Company() {
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState([]);


    const compeleteTask = async (e, id) => {
        addSpinner(e);
        if (id) {
            try {
                const resp = await Axios.post("/completeTask", {
                    id: id
                });
                if (resp.data.success) {
                    showToastSuccess("remove task");
                } else {
                    showToastError(resp.data.message);

                }
            } catch (error) {
                showToastError("Task added failed")
            } finally {
                removeSpinner(e, "")
                fetchCompany();

            }
        } else {
            removeSpinner(e, "Add Task")
        }

    }

    // fetch task
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

    // delete company
    const deleteCompany = async (e, id) => {
        const check = window.confirm("Are you sure you want to delete this company");
        if (check) {
            addSpinner(e);
            try {
                const resp = await Axios.post("/removeCompany", { id: id });
                if (resp.data.success) {
                    showToastSuccess(resp.data.message);

                } else {
                    showToastError(resp.data.message);
                }
            } catch (error) {
                showToastError("Task added failed")
            } finally {
                removeSpinner(e, "Remove")
                fetchCompany();
            }
        } else {
            return;
        }
    }



    useEffect(() => {
        fetchCompany();
        // eslint-disable-next-line
    }, []);

    return (
        <section>
            <div className="companyStatus">
                <div style={{ background: backDark, padding: ".5em", color: "white" }}>
                    <h2>Company {spinner && <SpinnerRole />}</h2>
                </div>
                <div className="divider"></div>

                <div className="companyBox">
                    <Row>
                        {data?.map((d, index) => {
                            let count = 0;
                            return (
                                <Col lg={12} key={index} className="mb-4">
                                    <div className="card">
                                        <div className="card-header d-flex align-items-center justify-content-between">
                                            <div className="leftBox">
                                                <strong>
                                                    <h4>
                                                        <strong>{d.company.name}</strong>
                                                    </h4>
                                                </strong>
                                            </div>
                                            <div className="rightBox">
                                                <div className="dropdown">
                                                    <button
                                                        className="btn  dropdown-toggle"
                                                        style={{
                                                            backgroundColor: backDark,
                                                            color: "white",
                                                        }}
                                                        type="button"
                                                        id="dropdownMenuButton1"
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                    >
                                                        Actions
                                                    </button>
                                                    <ul
                                                        className="dropdown-menu"
                                                        aria-labelledby="dropdownMenuButton1"
                                                    >
                                                        <li>
                                                            <button className="btn border dropdown-item" onClick={(e) => deleteCompany(e, d.company._id)}>
                                                                Remove
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <Link to={`/company/${d.company._id}`}>
                                                                <button className="btn btn-danger dropdown-item">
                                                                    Update
                                                                </button>
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <h5 className="card-title">
                                                <strong>Role : </strong>
                                                {d.company.role}
                                            </h5>
                                            <p className="card-text">
                                                <strong>Skill : </strong>

                                                {d.company.skill}
                                            </p>

                                            <div className="status">
                                                {d.company.status === "Running" ? (
                                                    <strong class="text-success">
                                                        Status : {d.company.status}
                                                    </strong>
                                                ) : (
                                                    <strong class="text-danger">
                                                        Status : {d.company.status}
                                                    </strong>
                                                )}
                                            </div>

                                            <div className="workingPerDays mt-3">
                                                <div
                                                    class="accordion accordion-flush"
                                                    id="accordionFlushExample"
                                                >
                                                    <div class="accordion-item border">
                                                        <h2 class="accordion-header" id="flush-headingOne">
                                                            <button
                                                                class="accordion-button collapsed"
                                                                type="button"
                                                                data-bs-toggle="collapse"
                                                                data-bs-target={`#flush-collapseOne${d.company._id}`}
                                                                aria-expanded="false"
                                                                aria-controls="flush-collapseOne"
                                                            >
                                                                <strong> Todays Task
                                                                </strong>
                                                            </button>
                                                        </h2>
                                                        <div
                                                            id={`flush-collapseOne${d.company._id}`}
                                                            class="accordion-collapse collapse show"
                                                            aria-labelledby="flush-headingOne"
                                                            data-bs-parent="#accordionFlushExample"
                                                        >
                                                            <div class="accordion-body">
                                                                <div className="mt-1">
                                                                    <Row>
                                                                        {d.task?.map((d, index) => {

                                                                            return (
                                                                                <Col
                                                                                    lg={12}
                                                                                    className="mt-2"
                                                                                    key={index}
                                                                                >
                                                                                    {
                                                                                        !d.isCompleted && <div class="form-check">
                                                                                            <input
                                                                                                class="form-check-input"
                                                                                                type="checkbox"
                                                                                                value={d.name}
                                                                                                id="defaultCheck1"
                                                                                                onClick={(e) => compeleteTask(e, d._id)}
                                                                                                checked={d.isCompleted}
                                                                                            />
                                                                                            <label
                                                                                                class="form-check-label"
                                                                                                for="defaultCheck1"
                                                                                            >
                                                                                                {d.name}
                                                                                            </label>
                                                                                        </div>
                                                                                    }
                                                                                </Col>
                                                                            );
                                                                        })}
                                                                    </Row>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
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
        </section>
    );
}

export default Company;
