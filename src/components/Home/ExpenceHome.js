import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { backDark } from "../../utils/color";
import { SpinnerRole, showToastError } from "../../utils/action";
import axios from "axios";
import Axios from "../../utils/axios";

function ExpenceHome() {
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState([])

    // fetch money

    const getMoneyTrack = async () => {
        try {
            const resp = await Axios.get("/getMoney");
            if (resp.data.success) {
                setData(resp.data.data)
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
        getMoneyTrack();
        // eslint-disable-next-line 
    }, [])



    return (
        <section>
            <div className="companyStatus">
                <div style={{ background: backDark, padding: ".5em", color: "white" }}>
                    <h2>
                        My expence monthly {
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
                                    <Col lg={4} key={index} className="mb-4">
                                        <div class="card">
                                            <div class="card-header d-flex align-items-center justify-content-between">
                                                <div className="leftBox">
                                                    <strong><h4># {d.month[0].month}</h4></strong>
                                                </div>
                                            </div>
                                            <div class="card-body">
                                                <h5 class="card-title">
                                                    <strong>Total amount :  </strong>
                                                    {d.amount.toLocaleString("en-Us")} in (Rs)
                                                </h5>
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

export default ExpenceHome;
