import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { SpinnerRole, showToastError } from "../../utils/action";
import axios from "axios";
import { Section } from "../ui/chrome";

function Github() {
    const [spinner, setSpinner] = useState(true);
    const [data, setData] = useState([])
    const url = "https://api.github.com/users/md-786910/repos";

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
        <Section
            title="GitHub"
            sub="Recent repositories."
            action={spinner ? <SpinnerRole /> : (
                <a href="https://github.com/md-786910" target="_blank" rel="noreferrer" className="btn btn-sm btn-ink">
                    Profile
                </a>
            )}
        >
            <Row>
                {data?.slice(0, 5).map((d, index) => (
                    <Col lg={6} key={d.id || index} className="mb-3">
                        <div className="card wms-card h-100">
                            <div className="card-body">
                                <div className="d-flex align-items-start justify-content-between gap-2">
                                    <strong className="clamp-2" style={{ fontSize: 14 }}>{d.name}</strong>
                                    <a href={d.html_url} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-dark flex-shrink-0">
                                        Open
                                    </a>
                                </div>
                                {d.description && (
                                    <p className="clamp-2 mt-2 mb-0" style={{ fontSize: 13, color: "var(--muted)" }}>
                                        {d.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
        </Section>
    );
}

export default Github;
