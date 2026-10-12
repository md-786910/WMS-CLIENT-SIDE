import React from "react";

function Footer() {
  return (
    <div className="container-fluid footer-slim px-3">
      <footer className="d-flex align-items-center justify-content-between py-3 px-1">
        <span>
          <strong style={{ color: "#fff" }}>WMS</strong>
          <span className="ms-2">Working Management System</span>
        </span>
        <span className="d-none d-md-inline" style={{ color: "rgba(255,255,255,.55)" }}>
          Redis-pattern theme ● clean &amp; sharp
        </span>
      </footer>
    </div>
  );
}

export default Footer;
