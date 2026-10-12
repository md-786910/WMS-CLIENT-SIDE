import React from "react";
import { Link, useLocation } from "react-router-dom";
import Searchbar from "./Searchbar";
import { getAllFile } from "../api";
import { showToastError } from "../utils/action";

const NAV_GROUPS = [
  { label: "Home", to: "/" },
  { label: "Company", to: "/add-company" },
  { label: "Resolve", to: "/resolve" },
  { label: "Tasks", to: "/task", badgeKey: "len" },
  { label: "Expenses", to: "/expence" },
  { label: "Learning", to: "/learning" },
  { label: "Alarm", to: "/alarm" },
];

function Header({ len }) {
  const [checkFile, setCheckFile] = React.useState([]);
  const location = useLocation();

  async function getFiles() {
    try {
      const response = await getAllFile();
      if (response.status === 200) {
        setCheckFile(response.data?.files);
      }
    } catch (error) {
      showToastError(error);
    }
  }
  React.useEffect(() => {
    getFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const notebookLink = checkFile[0]
    ? `/notebook/${checkFile[0]?._id}-${checkFile[0]?.fileName}`
    : "/notebook/new-notebook";

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  const { handleLogout } = require("../utils/isAuth");

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top redis-topbar">
      <div className="container-fluid px-3">
        <Link className="navbar-brand redis-brand" to="/">
          <span className="redis-brand-mark">R</span>
          <span>
            W-M-S
            <span style={{ color: "var(--redis-red)", marginLeft: 6 }}>●</span>
          </span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 redis-nav gap-1">
            {NAV_GROUPS.map((n) => (
              <li className="nav-item" key={n.to}>
                <Link
                  className={`nav-link ${isActive(n.to) ? "active-link" : ""}`}
                  aria-current={isActive(n.to) ? "page" : undefined}
                  to={n.to}
                >
                  {n.label}
                  {n.badgeKey && typeof len === "number" && len > 0 && (
                    <span
                      className="badge ms-1"
                      style={{ background: "var(--redis-red)" }}
                    >
                      {len}
                    </span>
                  )}
                </Link>
              </li>
            ))}
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname.startsWith("/notebook") ? "active-link" : ""}`}
                to={notebookLink}
              >
                Notebook
              </Link>
            </li>
          </ul>
          <div className="d-flex align-items-center gap-2 py-2 py-lg-0">
            <Searchbar />
            <Link to="/code-editor" className="btn btn-sm btn-ink">
              Code Editor
            </Link>
            <Link
              to="/cloud-storage?type=folder&lable=root&stage=1"
              className="btn btn-sm btn-redis"
            >
              Cloud storage
            </Link>
            <button
              className="btn btn-sm btn-outline-light"
              type="button"
              onClick={() => handleLogout()}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
