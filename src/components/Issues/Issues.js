import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { backDark } from "../../utils/color";
import {
  addSpinner,
  removeSpinner,
  showToastError,
  showToastSuccess,
} from "../../utils/action";
import Axios from "../../utils/axios";
import { useNavigate, useParams } from "react-router-dom";

function Issues() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [initVal, setInitVal] = useState("");

  const editorRef = useRef(null);

  const log = async (e) => {
    addSpinner(e);
    try {
      if (editorRef.current.getContent() !== "" && title) {
        const data = { content: editorRef.current.getContent(), title: title };
        const resp = await Axios.post("/addIssues", data);
        if (resp.data.success) {
          showToastSuccess(resp.data.message);
          navigate("/resolve");
        } else {
          showToastError(resp.data.message);
        }
      } else {
        showToastError("please write something!");
      }
    } catch (error) {
      showToastError(error.message);
    } finally {
      removeSpinner(e, "Add issues");
    }
  };

  const updateIssues = async (e) => {
    addSpinner(e);
    try {
      const data = { content: editorRef.current.getContent(), title: title };
      const resp = await Axios.patch(`/update-issues/${id}`, data);
      if (resp.data.success) {
        showToastSuccess(resp.data.message);
        navigate("/resolve");
      } else {
        showToastError(resp.data.message);
      }
    } catch (error) {
      showToastError(error.message);
    } finally {
      removeSpinner(e, "Update issue");
    }
  };

  const fetchIssues = async () => {
    try {
      const resp = await Axios.post("/getIssuesById", { id: id });
      if (resp.data.success) {
        setTitle(resp?.data?.data?.title);
        setInitVal(resp?.data?.data?.content);

        return;
      } else {
        showToastError(resp.data.message);
      }
    } catch (error) {
      showToastError(error.message);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(true);
    }, 1000);

    if (id) {
      fetchIssues();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <section>
        <div className="companyStatus issResolveCon">
          <div
            style={{ background: backDark, padding: ".5em", color: "white" }}
          >
            <h2>Add your issues</h2>
          </div>
          <div className="divider"></div>
          {loading && (
            <div className="issuesResol">
              <div className="form">
                <div>
                  <div class="card">
                    <div class="card-header ">
                      <div>
                        <label
                          for="exampleFormControlInput1"
                          class="form-label"
                        >
                          <strong>Issues Name</strong>
                        </label>
                        <input
                          type="email"
                          class="form-control w-100"
                          id="exampleFormControlInput1"
                          value={title}
                          placeholder="add title of your issues"
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>
                    </div>
                    <div class="card-body">
                      <div className="">
                        <Editor
                          onInit={(evt, editor) => (editorRef.current = editor)}
                          initialValue={initVal}
                          init={{
                            height: 400,
                            menubar: false,
                            plugins: [
                              "advlist",
                              "autolink",
                              "lists",
                              "link",
                              "image",
                              "charmap",
                              "anchor",
                              "searchreplace",
                              "visualblocks",
                              "code",
                              "fullscreen",
                              "insertdatetime",
                              "media",
                              "table",
                              "preview",
                              "help",
                              "wordcount",
                            ],
                            toolbar:
                              "undo redo | blocks | " +
                              "bold italic forecolor | alignleft aligncenter " +
                              "alignright alignjustify | bullist numlist outdent indent | " +
                              "removeformat | help",
                            content_style:
                              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                          }}
                          apiKey={process.env.REACT_APP_TINY_API}
                        />
                        {!id ? (
                          <button
                            className="btn text-white mt-4"
                            style={{ backgroundColor: backDark }}
                            onClick={(e) => log(e)}
                          >
                            Add issues
                          </button>
                        ) : (
                          <button
                            className="btn text-white mt-4"
                            style={{ backgroundColor: backDark }}
                            onClick={(e) => updateIssues(e)}
                          >
                            Update
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Issues;
