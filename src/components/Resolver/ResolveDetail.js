import React, { useEffect, useState } from "react";
import { backDark } from "../../utils/color";
import { SpinnerRole, showToastError } from "../../utils/action";

import Axios from "../../utils/axios";
import { useParams } from "react-router-dom";
function ResolveDetail() {
  const { id } = useParams();
  const [spinner, setSpinner] = useState(true);

  const [data, setData] = useState([]);

  // fetch task
  const fetchIssues = async () => {
    try {
      const resp = await Axios.post("/getIssuesById", { id: id });
      if (resp.data.success) {
        setData(resp.data.data);
        return;
      } else {
        showToastError(resp.data.message);
      }
    } catch (error) {
      showToastError(error.message);
    } finally {
      setSpinner(false);
    }
  };
  useEffect(() => {
    fetchIssues();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <section>
        <div className="companyStatus issResolveCon">
          <div
            style={{ background: backDark, padding: ".5em", color: "white" }}
          >
            <h2>Read issues {spinner && <SpinnerRole />}</h2>
          </div>
          <div className="divider"></div>

          <div class="card">
            <div class="card-header ">
              <strong>{data?.title}</strong>
            </div>

            <div
              class="card-body"
              dangerouslySetInnerHTML={{ __html: data?.content }}
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default ResolveDetail;
