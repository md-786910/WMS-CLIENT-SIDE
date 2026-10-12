import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Countdown from "react-countdown";
import alarm from "./audio.mp3";
import { PageHeader, StatusBadge } from "../ui/chrome";

const DEFAULTS = [
  { title: "10 seconds", interval: 1000 * 10, id: 1, puchIn: false },
  { title: "1 hour", interval: 3600 * 1000, id: 2, puchIn: false },
  { title: "1.5 hours", interval: 5400 * 1000, id: 3, puchIn: false },
  { title: "2 hours", interval: 7200 * 1000, id: 4, puchIn: false },
];

function loadAlarms() {
  try {
    const raw = localStorage.getItem("alarm");
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

function Alarm() {
  const [rand, setRand] = useState(0)
  const [int, setInt] = useState(0)
  const [data, setData] = useState(DEFAULTS);

  const audio = new Audio(alarm)

  function punchInBtn(id, interval) {
    const jsonAlarm = loadAlarms();
    const found = jsonAlarm.find((e) => e.id === id);
    if (found) found.puchIn = true;
    setInt(interval);
    localStorage.setItem("alarm", JSON.stringify(jsonAlarm));
    setRand(Math.random());
  }
  const resetAlarm = (id) => {
    try { audio.pause() } catch { /* noop */ }
    const jsonAlarm = loadAlarms();
    const found = jsonAlarm.find((e) => e.id === id);
    if (found) found.puchIn = false;
    setInt(0)
    localStorage.setItem("alarm", JSON.stringify(jsonAlarm));
    setRand(Math.random())
  };

  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      try { audio.play() } catch { /* noop */ }
      return <Timer interval={int} />
    } else {
      document.title = `${hours}:${minutes}:${seconds}`
      return <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 800, fontSize: 22 }}>{hours}:{minutes}:{seconds}</span>;
    }
  };

  function Timer({ interval }) {
    return <Countdown date={Date.now() + parseInt(interval)} renderer={renderer} />
  }

  useEffect(() => {
    setData(loadAlarms())
    // eslint-disable-next-line
  }, [rand]);

  useEffect(() => {
    if (!localStorage.getItem("alarm")) {
      localStorage.setItem("alarm", JSON.stringify(DEFAULTS));
    }
    // eslint-disable-next-line
  }, []);

  const activeCount = data?.filter((d) => d.puchIn).length || 0;

  return (
    <div className="content-stack">
      <PageHeader
        breadcrumb="WMS · Alarm"
        title="Alarms"
        sub={`${data.length} timers · ${activeCount} running`}
        right={activeCount > 0 ? <span className="pill pill-danger">{activeCount} live</span> : <span className="pill pill-neutral">idle</span>}
      />

      <div className="section-card p-3 p-md-4">
        <Row className="g-3 mb-0">
          {data?.map((d, index) => (
            <Col md={6} xl={3} key={d.id || index} className="d-flex">
              <div className="card wms-card h-100 w-100" style={d.puchIn ? { borderColor: "var(--redis-red)" } : undefined}>
                <div className="card-header d-flex align-items-center justify-content-between">
                  <strong style={{ fontSize: 14 }}>Timer #{index + 1}</strong>
                  <StatusBadge status={d.puchIn ? "Running" : "Idle"} />
                </div>
                <div className="card-body text-center d-flex flex-column">
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--faint)" }}>Interval</div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>{d.title}</div>
                  <div className="my-3 d-flex align-items-center justify-content-center" style={{ minHeight: 48 }}>
                    {d.puchIn ? (
                      <Timer interval={d.interval} />
                    ) : (
                      <span style={{ color: "var(--faint)", fontSize: 13 }}>Not started</span>
                    )}
                  </div>
                  <div className="d-flex gap-2 justify-content-center mt-auto pt-2">
                    <button
                      className="btn btn-sm btn-redis"
                      onClick={() => punchInBtn(d.id, d.interval)}
                      disabled={d.puchIn}
                    >
                      Punch in
                    </button>
                    {d.puchIn && (
                      <button className="btn btn-sm btn-outline-danger" onClick={() => resetAlarm(d.id)}>
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default Alarm;
