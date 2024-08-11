import React, { useEffect, useState } from "react";
import { backDark } from "../utils/color";
import { Link } from "react-router-dom";
import { handleLogout } from "../utils/isAuth";
import Searchbar from "./Searchbar";
import { getAllFile } from "../api";
import { showToastError } from "../utils/action";

function Header({ len }) {
  const [checkFile, setCheckFile] = useState([]);

  async function getFiles() {
    try {
      const response = await getAllFile()
      if (response.status === 200) {
        setCheckFile(response.data?.files)

      }
    } catch (error) {
      showToastError(error)

    }
  }
  useEffect(() => {
    getFiles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])



  return (
    <nav>
      <nav
        class="navbar navbar-expand-lg navbar-dark fixed-top"
        style={{ backgroundColor: backDark }}
      >
        <div class="container-fluid">
          <Link class="navbar-brand" to="/">
            <h4>
              <strong>W-M-S</strong>
            </h4>
          </Link>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <Link class="nav-link active" aria-current="page" to="/">
                  Home
                </Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link active" to="/add-company">
                  Add company
                </Link>
              </li>

              <li class="nav-item">
                <Link class="nav-link active" to="/resolve">
                  Resolve
                </Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link active" to="/task">
                  My task
                  <span class="badge bg-success">{len}</span>
                </Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link active" to="/expence">
                  My expences
                </Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link active" to="/learning">
                  My learning
                </Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link active" to="/alarm">
                  My alarm
                </Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link active bg-warning rounded text-black fw-bold" to={`/notebook/${checkFile[0]?._id}-${checkFile[0]?.fileName}`}>
                  My notebook
                </Link>
              </li>
            </ul>
            <div class="d-flex align-items-center gap-4">
              <Searchbar />
              <button
                class="btn btn-outline-danger"
                type="button"
                onClick={() => handleLogout()}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    </nav>
  );
}

export default Header;
