import React from "react";

export function PageHeader({ title, sub, right, count, breadcrumb }) {
  return (
    <div className="redis-band px-3 py-3 px-md-4 d-flex align-items-center justify-content-between gap-3 flex-wrap">
      <div style={{ minWidth: 0 }}>
        {breadcrumb && (
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--redis-red)", marginBottom: 4 }}>
            {breadcrumb}
          </div>
        )}
        <div className="d-flex align-items-center gap-2">
          <h1 className="page-header-title" style={{ color: "#fff" }}>{title}</h1>
          {typeof count === "number" && (
            <span className="pill" style={{ background: "var(--redis-red)", color: "#fff", borderColor: "transparent" }}>
              {count}
            </span>
          )}
        </div>
        {sub && <p className="page-header-sub">{sub}</p>}
      </div>
      {right && <div className="flex-shrink-0 d-flex gap-2">{right}</div>}
    </div>
  );
}

export function Section({ title, sub, action, children, pad = true, count }) {
  return (
    <section className="section-card overflow-hidden">
      <div className="d-flex align-items-center justify-content-between px-3 py-3 px-md-4 gap-2" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="d-flex align-items-center gap-2" style={{ minWidth: 0 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--redis-red)", flexShrink: 0 }} />
          <h2 className="m-0" style={{ fontSize: 16, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</h2>
          {typeof count === "number" && (
            <span className="pill pill-neutral" style={{ fontSize: 11 }}>{count}</span>
          )}
        </div>
        <div className="d-flex align-items-center gap-2">
          {sub && <span className="d-none d-md-inline" style={{ fontSize: 12, color: "var(--muted)" }}>{sub}</span>}
          {action}
        </div>
      </div>
      <div className={pad ? "p-3 p-md-4" : ""}>{children}</div>
    </section>
  );
}

export function StatusBadge({ status, text }) {
  const s = String(status || text || "").toLowerCase();
  let cls = "pill-neutral";
  if (s.includes("resolv") || s.includes("run") || s.includes("complet") || s.includes("done")) cls = "pill-success";
  else if (s.includes("pend") || s.includes("fail") || s.includes("stop") || s.includes("trash") || s.includes("clos")) cls = "pill-danger";
  else if (s.includes("warn") || s.includes("progress")) cls = "pill-warn";
  return <span className={`pill ${cls}`}>{text || status}</span>;
}

export function SkeletonCards({ n = 2 }) {
  return (
    <div>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="card wms-card mb-3">
          <div className="card-body d-flex gap-3 align-items-center">
            <div className="skel" style={{ width: 36, height: 36 }} />
            <div className="flex-grow-1">
              <div className="skel mb-2" style={{ height: 14, width: "40%" }} />
              <div className="skel" style={{ height: 12, width: "70%" }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ title, sub, action }) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      {sub && <div>{sub}</div>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
