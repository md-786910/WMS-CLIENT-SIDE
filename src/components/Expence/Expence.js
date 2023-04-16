import React, { useEffect, useState } from "react";
import { backDark } from "../../utils/color";
import {
    SpinnerRole,
    addSpinner,
    removeSpinner,
    showToastError,
    showToastSuccess,
} from "../../utils/action";
import Axios from "../../utils/axios";
import ChartExp from "../../utils/ChartEx";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap/esm";
import { Bar } from "react-chartjs-2";
import moment from "moment";

function Expence() {
    const [loading, setLoading] = useState(true);
    const [amount, setAmount] = useState("");
    const [data, setData] = useState([])
    const month = moment().format("MMMM");
    const addMoney = async (e) => {
        addSpinner(e);
        if (amount) {
            try {
                const resp = await Axios.post("/addMoney", {
                    amount: amount
                });
                if (resp.data.success) {
                    showToastSuccess(resp.data.message);
                } else {
                    showToastError(resp.data.message);
                }
            } catch (error) {
                showToastError("amount added failed")
            } finally {
                removeSpinner(e, "add amount")
                // getTask()
            }
        } else {
            showToastError("please enter amount!")
            removeSpinner(e, "add amount")
        }
        setAmount("")
    }
    // fetch task
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
            setLoading(false);
        }

    }
    useEffect(() => {
        getMoneyTrack();
        // eslint-disable-next-line 
    }, [])
    return (
        <>
            <section>
                <div className="companyStatus issResolveCon">
                    <div
                        style={{ background: backDark, padding: ".5em", color: "white" }}
                    >
                        <h2>Add your expence  {
                            loading && <SpinnerRole />
                        }</h2>
                    </div>
                    <div className="divider"></div>

                    <div>
                        <div class="card">
                            <div class="card-header ">
                                <div>
                                    <label for="exampleFormControlInput1" class="form-label">
                                        <strong>Add amount</strong>
                                    </label>
                                    <input
                                        type="number"
                                        class="form-control w-100"
                                        id="exampleFormControlInput1"
                                        placeholder="add amount"
                                        onChange={(e) => setAmount(e.target.value)}
                                        value={amount}
                                        required={true}
                                    />

                                    <div className="mt-3">
                                        <button
                                            className="btn text-white "
                                            style={{ backgroundColor: backDark }}
                                            onClick={(e) => addMoney(e)}
                                        >
                                            add amount
                                        </button>

                                        <div className="btn mx-2">
                                            <button className="btn fs-5 border fw-bold">
                                                {
                                                    data.map((d) => {
                                                        if (d.month[0].month === month) {
                                                            return d.month[0].month + " " + d?.amount.toLocaleString("en-Us")
                                                        }
                                                    })
                                                }
                                                &nbsp;
                                                (Rs)
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="card-body">
                                <div className="mt-1">
                                    <h5>
                                        <strong>Tracker</strong>
                                        <hr />
                                    </h5>
                                </div>

                                <Row className="chartBox">
                                    <Col lg={12}>
                                        <div className="chart" >
                                            <ChartExp bg="#393646" Mode={Bar} d={data} />
                                        </div>
                                    </Col>
                                </Row>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Expence;
