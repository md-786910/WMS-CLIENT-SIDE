import React, { useEffect, useRef, useState } from 'react';
import { Editor } from "@tinymce/tinymce-react";
import { useParams } from 'react-router-dom';
import { createNotebook, getAllContentNotebook } from '../../api';
import { showToastError } from '../../utils/action';
import debounce from 'lodash.debounce';



function NotebookIndex() {
    const { fileName } = useParams();
    const [initVal, setInitVal] = useState("");
    const [content, setContent] = useState("");

    const editorRef = useRef();
    const debouncedChangeHandler = debounce(handleChange, 500); // 500ms delay
    const fileSplit = fileName?.split("-")[0];




    async function handleChange(content) {
        try {
            if (content !== "") {
                const data = { content, fileId: fileSplit };
                console.log({ data })
                const resp = await createNotebook(data);
                if (resp.status === 201) {
                    // pass
                }
            }
        } catch (error) {
            showToastError(error.message);
        }
    };

    useEffect(() => {
        const editor = editorRef.current;
        if (editor) {
            editor.on('input', (e) => {
                debouncedChangeHandler(editor.getContent());
                setContent(editor.getContent());
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editorRef]);


    async function getAllContent() {
        try {
            const resp = await getAllContentNotebook(fileSplit);
            if (resp.status === 200) {
                setInitVal(resp.data?.content?.content);
            }
        } catch (error) {
            showToastError(error.message);
        }
    }

    useEffect(() => {
        getAllContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fileName]);



    return (
        <div>
            {(
                <div className="card-body">
                    <div className="">
                        <Editor
                            onInit={(evt, editor) => {
                                editorRef.current = editor;
                                editor.on('input', (e) => {
                                    debouncedChangeHandler(editor.getContent());
                                    setContent(editor.getContent());
                                });
                            }}
                            initialValue={initVal}
                            init={{
                                height: 800,
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