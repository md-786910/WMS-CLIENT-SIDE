import React, { useCallback, useEffect, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript'
import { vscodeDark, vscodeLight } from '@uiw/codemirror-theme-vscode';
import { basicSetup, minimalSetup } from '@uiw/codemirror-extensions-basic-setup';
import { Alert, Button, Col, Row } from 'react-bootstrap';

function CodeEditor() {
    const [value, setValue] = useState("console.log('hello world!');");
    const [output, setOutput] = useState('');
    const [error, setError] = useState(null);

    const onChange = useCallback((val, viewUpdate) => {
        console.log('val:', val);
        setValue(val);
    }, []);

    const executeCode = useCallback(() => {
        try {
            setError(null);
            let consoleOutput = [];

            const customConsole = {
                log: (...args) => {
                    consoleOutput.push(args.join(' '));
                }
            };

            // Use Function constructor for better scoping
            const scriptFunction = new Function('console', value);

            // Execute the user code with custom console
            scriptFunction(customConsole);

            // Set the output by joining all console logs
            setOutput(consoleOutput.join('\n'));
        } catch (err) {
            setError(err.toString());
            setOutput('');
        }
    }, [value]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key === "r") {
                e.preventDefault();
                executeCode();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [executeCode]);
    return (
        <div fluid className="p-0 " style={{ marginTop: "4.4em", position: "relative", top: 0 }}>
            <Row>
                <Col lg={8} md={8} sm={12} col={12}>
                    <CodeMirror
                        className='CodeMirror'
                        value={value}
                        height="600px"
                        theme={vscodeDark}
                        fontSize={30}
                        extensions={[
                            javascript({}),
                            basicSetup({
                                foldGutter: false,
                                dropCursor: false,
                                allowMultipleSelections: false,
                                indentOnInput: false,
                            }),

                        ]}
                        onChange={onChange}
                    />

                </Col>
                <Col lg={4} md={4} col={12} sm={12}>
                    <div style={{ marginRight: "10px" }}>
                        <div className="d-flex my-3 align-items-center justify-content-between">
                            <h3>Output</h3>
                            <button className='btn btn-success' onClick={() => {
                                executeCode()
                            }}>
                                Execute - ctrl+r
                            </button>
                        </div>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <pre style={{ backgroundColor: '#1e1e1e', color: '#d4d4d4', padding: '1em', borderRadius: '4px', minHeight: '500px', overflow: "auto" }}>
                            {output || 'No output'}
                        </pre>
                    </div>
                </Col>

            </Row>
        </div>
    )
}

export default CodeEditor
