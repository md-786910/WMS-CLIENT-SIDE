import React, { useEffect, useState } from "react";
import {
  addSpinner,
  removeSpinner,
  showToastError,
  showToastSuccess,
} from "../../utils/action";
import Axios from "../../utils/axios";
import ChartExp from "../../utils/ChartEx";
import { Row, Col } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import moment from "moment";
import { PageHeader, SkeletonCards, EmptyState } from "../ui/chrome";

function Expence() {
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [data, setData] = useState([]);
  const month = moment().format("MMMM");

  const addMoney = async (e) => {
    addSpinner(e);
    if (amount && Number(amount) > 0) {
      try {
        const resp = await Axios.post("/addMoney", { amount: amount });
        if (resp.data.success) {
          getMoneyTrack();
          showToastSuccess(resp.data.message);
        } else {
          showToastError(resp.data.message);
        }
      } catch (error) {
        showToastError("amount added failed");
      } finally {
        removeSpinner(e, "Add");
      }
    } else {
      showToastError("please enter a valid amount!");
      removeSpinner(e, "Add");
    }
    setAmount("");
  };

  async function getMoneyTrack() {
    try {
      const resp = await Axios.get("/getMoney");
      if (resp.data.success) {
        setData(resp.data.data);
        return;
      } else {
        showToastError(resp.data.message);
      }
    } catch (error) {
      showToastError(error.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getMoneyTrack();
    // eslint-disable-next-line
  }, []);

  const current = data.find((d) => d.month?.[0]?.month === month);
  const total = data.reduce((a, d) => a + (Number(d.amount) || 0), 0);

  return (
    <div className="content-stack">
      <PageHeader
        breadcrumb="WMS · Expenses"
        title="Expenses"
        sub={loading ? "Loading…" : `${data.length} months · ₹${total.toLocaleString("en-IN")} total`}
        right={
          current ? (
            <span className="pill" style={{ background: "#fff", color: "var(--ink)" }}>
              {month} · ₹{Number(current.amount).toLocaleString("en-IN")}
            </span>
          ) : undefined
        }
      />

      <div className="section-card p-3 p-md-4">
        <div className="d-flex gap-2 flex-wrap" style={{ maxWidth: 560 }}>
          <input
            type="number"
            min="1"
            className="form-control"
            style={{ maxWidth: 240 }}
            placeholder="Amount in ₹…"
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
            onKeyDown={(e) => { if (e.key === "Enter") addMoney(e); }}
            required
          />
          <button className="btn btn-redis" onClick={(e) => addMoney(e)}>
            Add amount
          </button>
        </div>

        <div className="mt-4">
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--faint)", marginBottom: 8 }}>
            Monthly trend
          </div>
          {loading ? (
            <SkeletonCards n={1} />
          ) : data?.length === 0 ? (
            <EmptyState title="No expenses yet" sub="Add your first amount above to start the tracker." />
          ) : (
            <Row className="chartBox">
              <Col lg={12}>
                <div className="chart" style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
                  <ChartExp bg="#1A1E23" Mode={Bar} d={data} />
                </div>
              </Col>
            </Row>
          )}
        </div>

        {!loading && data?.length > 0 && (
          <Row className="g-3 mt-3">
            {data?.slice(0, 6).map((d, i) => (
              <Col md={6} xl={4} key={i}>
                <div className="card wms-card">
                  <div className="card-body">
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--muted)" }}>
                      {d.month?.[0]?.month}
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>
                      ₹{Number(d.amount).toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default Expence;
