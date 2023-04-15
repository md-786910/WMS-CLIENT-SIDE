import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { backDark } from "../../utils/color";
import { SpinnerRole, showToastError } from "../../utils/action";
import axios from "axios";

function Github() {
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState([])
    const url = "https://api.github.com/users/md-786910/repos";

    // fetch task
    const getGithub = async () => {
        try {
            const resp = await axios.get(url);
            if (resp.status === 200) {
                setData(resp.data)
                return;
            } else {
                showToastError(resp.data.message);
            }
        } catch (error) {
            showToastError(error.message)
        } finally {
            setSpinner(false)
        }

    }

    useEffect(() => {
        getGithub();
        // eslint-disable-next-line 
    }, [])



    return (
        <section>
            <div className="companyStatus">
                <div style={{ background: backDark, padding: ".5em", color: "white" }}>
                    <h2>
                        Github {
                            spinner && <SpinnerRole />
                        }
                    </h2>
                </div>
                <div className="divider"></div>

                <div className="companyBox">
                    <Row>
                        {
                            data?.slice(0, 5).map((d, index) => {
                                return (
                                    <Col lg={12} key={index} className="mb-4">
                                        <div class="card">
                                            <div class="card-header d-flex align-items-center justify-content-between">

                                                <div className="leftBox">
                                                    <strong><h4># {index + 1}</h4></strong>
                                                </div>
                                                <div className="rightBox">
                                                    <div class="dropdown">
                                                        <a href={d.html_url} target="_blank" rel="noreferrer" >
                                                            <button class="btn btn-info " type="button" >
                                                                open
                                                            </button>
                                                        </a>
                                                    </div>

                                                </div>

                                            </div>
                                            <div class="card-body">
                                                <h5 class="card-title">
                                                    <strong>Title :  </strong>
                                                    {d.name}
                                                </h5>
                                                <p class="card-text">
                                                    {
                                                        d.description && <>
                                                            <strong>Description : </strong>
                                                            {d.description}
                                                        </>
                                                    }
                                                </p>


                                            </div>
                                        </div>
                                    </Col>
                                )
                            })
                        }

                        <div className="mt-3">
                            <a href="https://github.com/md-786910" target="_blank" rel="noreferrer">
                                <button className="btn" style={{ background: backDark, color: "white" }}>
                                    Github profile
                                </button>
                            </a>
                        </div>
                    </Row>
                </div>

            </div>


        </section>
    );
}

export default Github;
