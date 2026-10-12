import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Editor } from "@tinymce/tinymce-react";
import { useParams } from 'react-router-dom';
import { createNotebook, getAllContentNotebook } from '../../api';
import { showToastError } from '../../utils/action';
import debounce from 'lodash.debounce';



function NotebookIndex() {
    const { fileName } = useParams();
    const [initVal, setInitVal] = useState("");
    const [loading, setLoading] = useState(true);

    const editorRef = useRef();
    const fileSplit = fileName?.split("-")[0];

    async function handleChange(content) {
        try {
            if (content !== "") {
                const data = { content, fileId: fileSplit };
                const resp = await createNotebook(data);
                if (resp.status === 201) {
                    // autosaved
                }
            }
        } catch (error) {
            showToastError(error.message);
        }
    };

    // Stable debounced saver per file — recreated only when file changes
    const debouncedChangeHandler = useMemo(
        () => debounce((content) => handleChange(content), 500),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [fileSplit]
    );

    useEffect(() => {
        return () => debouncedChangeHandler.cancel();
    }, [debouncedChangeHandler]);

    async function getAllContent() {
        setLoading(true);
        setInitVal("");
        try {
            const resp = await getAllContentNotebook(fileSplit);
            if (resp.status === 200) {
                setInitVal(resp.data?.content?.content || "");
            }
        } catch (error) {
            showToastError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getAllContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fileName]);



    return (
        <div className="section-card p-2 p-md-3">
            {loading ? (
                <div className="p-3">
                    <div className="skel mb-2" style={{ height: 14, width: "30%" }} />
                    <div className="skel mb-2" style={{ height: 12, width: "90%" }} />
                    <div className="skel mb-2" style={{ height: 12, width: "80%" }} />
                    <div className="skel" style={{ height: 320, width: "100%" }} />
                </div>
            ) : (
                <div className="card-body p-0">
                    <div className="">
                        <Editor
                            key={fileSplit}
                            onInit={(evt, editor) => {
                                editorRef.current = editor;
                                editor.on('input', () => {
                                    debouncedChangeHandler(editor.getContent());
                                });
                            }}
                            initialValue={initVal}
                            init={{
                                height: 640,
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
                                    "body { font-family:Helvetica,Arial,sans-serif; font-size:17px }",
                            }}
                            apiKey={process.env.REACT_APP_TINY_API}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotebookIndex;
