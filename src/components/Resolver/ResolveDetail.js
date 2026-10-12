import React, { useEffect, useState } from "react";
import { showToastError } from "../../utils/action";

import Axios from "../../utils/axios";
import { useParams, Link } from "react-router-dom";
import { PageHeader, SkeletonCards } from "../ui/chrome";

function ResolveDetail() {
  const { id } = useParams();
  const [spinner, setSpinner] = useState(true);
  const [data, setData] = useState(null);

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
  }, [id]);

  return (
    <div className="content-stack">
      <PageHeader
        breadcrumb="WMS · Resolve · Reader"
        title={spinner ? "Reading…" : data?.title || "Issue"}
        sub="Clean reading view — max width for focus."
        right={
          <>
            <Link to="/resolve" className="btn btn-sm btn-ink">← Back</Link>
            {data?._id && (
              <Link to={`/add-issues/${data._id}/`} className="btn btn-sm btn-redis">Edit</Link>
            )}
          </>
        }
      />

      {spinner ? (
        <div className="section-card p-3 p-md-4"><SkeletonCards n={1} /></div>
      ) : (
        <div className="section-card p-3 p-md-4">
          <article style={{ maxWidth: "72ch", margin: "0 auto", fontSize: 15, lineHeight: 1.7 }}>
            <div dangerouslySetInnerHTML={{ __html: data?.content }} />
          </article>
        </div>
      )}
    </div>
  );
}

export default ResolveDetail;
