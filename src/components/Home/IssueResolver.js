import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { backDark } from "../../utils/color";
import { SpinnerRole, addSpinner, removeSpinner, showToastError, showToastSuccess } from "../../utils/action";
import Axios from "../../utils/axios";

function IssueResolver() {
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState([]);

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
            showToastError("Task added failed")
        } finally {
            removeSpinner(e, "Remove")
            fetchIssues();
        }

    }


    useEffect(() => {
        fetchIssues();
        // eslint-disable-next-line
    }, []);

    return (
        <section>
            <div className="companyStatus">
                <div style={{ background: backDark, padding: ".5em", color: "white" }}>
                    <h2>Issues Resolver</h2>
                </div>
                <div className="divider"></div>

                <div className="companyBox">
                    <Row>
                        {data?.map((d, index) => {
                            return (
                                <Col lg={12} key={index} className="mb-4">
                                    <div class="card">
                                        <div class="card-header d-flex align-items-center justify-content-between">
                                            <div className="leftBox">
                                                <strong>
                                                    <h4># Issue {index + 1}
                                                        {
                                                            spinner && <SpinnerRole />
                                                        }
                                                    </h4>
                                                </strong>
                                            </div>
                                            <div className="rightBox">
                                                <div class="dropdown">
                                                    {
                                                        d.isResolved ? <button class="btn btn-success " type="button">
                                                            Resolved
                                                        </button> : <button class="btn btn-danger " type="button">
                                                            Peding
                                                        </button>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card-body">
                                            <h5 class="card-title">
                                                <strong>Title : </strong>
                                                {d.title}
                                            </h5>

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
                                                                data-bs-target={`#flush-collapseOne${index + 1}`}
                                                                aria-expanded="false"
                                                                aria-controls="flush-collapseOne"
                                                            >
                                                                <strong>See solution</strong>
                                                            </button>
                                                        </h2>
                                                        <div
                                                            id={`flush-collapseOne${index + 1}`}
                                                            class="accordion-collapse collapse"
                                                            aria-labelledby="flush-headingOne"
                                                            data-bs-parent="#accordionFlushExample"
                                                        >
                                                            <div class="accordion-body">
                                                                <div className="mt-1" dangerouslySetInnerHTML={{ __html: d.content }}>

                                                                </div>

                                                                <div className="mt-3" onClick={(e) => removedIssues(e, d._id)}>
                                                                    <button className="btn btn-danger">
                                                                        Removed
                                                                    </button>
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

export default IssueResolver;
