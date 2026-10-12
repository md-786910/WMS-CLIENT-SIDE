import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { SpinnerRole, showToastError } from "../../utils/action";
import Axios from "../../utils/axios";
import { Link } from "react-router-dom";
import { Section } from "../ui/chrome";

function ExpenceHome() {
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState([])

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
        <Section
            title="Spend"
            sub="Monthly totals at a glance."
            action={spinner ? <SpinnerRole /> : <Link to="/expence" className="btn btn-sm btn-ink">Details</Link>}
        >
            <Row>
                {data?.slice(0, 6).map((d, index) => (
                    <Col lg={4} md={6} key={index} className="mb-3">
                        <div className="card wms-card">
                            <div className="card-body">
                                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--muted)" }}>
                                    {d.month?.[0]?.month || `Month ${index + 1}`}
                                </div>
                                <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>
                                    ₹ {Number(d.amount || 0).toLocaleString("en-IN")}
                                </div>
                            </div>
                        </div>
                    </Col>
                ))}
                {!spinner && data?.length === 0 && (
                    <Col><div style={{ fontSize: 13, color: "var(--muted)" }}>No expense data yet.</div></Col>
                )}
            </Row>
        </Section>
    );
}

export default ExpenceHome;
