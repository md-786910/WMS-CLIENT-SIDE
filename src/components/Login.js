import React from "react";
import { addSpinner, removeSpinner } from "../utils/action";
import { authenticateUser, enrollNewUser } from "../face_auths/faceAuth";

function Login() {
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
                <button
                  type="button"
                  className="w-100 btn btn-danger btn-block"
                  onClick={(e) => {
                    addSpinner(e);
                    authenticateUser(e);
                    removeSpinner(e, "LOGIN");
                  }}
                >
                  LOGIN
                </button>
                <button onClick={enrollNewUser}>Enroll</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
