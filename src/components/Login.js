import React, { useState } from "react";
import {
  addSpinner,
  removeSpinner,
  showToastError,
  showToastSuccess,
} from "../utils/action";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");

  return (
    <>
      <div className="container-fluid login-container">
        <div className="row justify-content-center align-items-center h-100">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body text-center">
                <div
                  style={{
                    fontSize: "3rem",
                  }}
                >
                  😍
                </div>
                <h3 className="mb-3">Login to WMS</h3>
                <input
                  type="password"
                  name="user"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  className="form-control absolute"
                  placeholder=" login to WMS"
                />
                <button
                  type="button"
                  className="mt-3 w-100 btn btn-danger btn-block"
                  onClick={(e) => {
                    addSpinner(e);
                    console.log("user", user);
                    console.log(
                      "String(process.env.REACT_APP_USER",
                      String(process.env.REACT_APP_USER)
                    );

                    if (user === String(process.env.REACT_APP_USER)) {
                      localStorage.setItem(
                        "faceAuth",
                        JSON.stringify({ user })
                      );
                      showToastSuccess("i am login success");
                      navigate("/");
                    } else {
                      showToastError("Please enter a valid username");
                    }
                    removeSpinner(e, "LOGIN");
                  }}
                >
                  LOGIN
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
