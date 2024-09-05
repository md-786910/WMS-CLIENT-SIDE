import React, { useCallback, useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { basicSetup } from '@uiw/codemirror-extensions-basic-setup';
import { Alert, Button, Col, Row } from 'react-bootstrap';

function CodeEditor() {
    const [value, setValue] = useState("console.log('hello world!');");
    const [output, setOutput] = useState('');
    const [error, setError] = useState(null);

    const onChange = useCallback((val) => {
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

            // const scriptFunction = new Function('console', value);
            // scriptFunction(customConsole);

            // Add offset lines to match CodeMirror line numbers
            const offsetLines = 2;
            const scriptFunction = new Function('console', '\n'.repeat(offsetLines) + value);
            scriptFunction(customConsole);

            setOutput(consoleOutput.join('\n'));
        } catch (err) {
            const errorMessage = parseError(err);
            setError(errorMessage);
            setOutput('');
        }
    }, [value]);

    const parseError = (err) => {
        const offsetLines = 2;  // This should match the number of lines added before the code
        const lineMatch = err.stack.match(/<anonymous>:(\d+):\d+/);
        let lineNumber = lineMatch ? parseInt(lineMatch[1], 10) - offsetLines : 'unknown';
        if (lineNumber < 1) lineNumber = 1;  // Ensure line number doesn't go below 1
        return `${err.message} (at line ${lineNumber})`;
    };

    const parseError1 = (err) => {
        const lineMatch = err.stack.match(/<anonymous>:(\d+):\d+/);
        let lineNumber = lineMatch ? parseInt(lineMatch[1], 10) : 'unknown';

        // Adjust line number if necessary
        if (lineNumber > 0) {
            lineNumber -= 1; // Adjust based on the offset in your actual code execution environment
        }

        return `${err.message} (at line ${lineNumber})`;
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key === "r") {
                e.preventDefault();
                executeCode();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [executeCode]);

    return (
        <div className="p-0" style={{ marginTop: "4.4em", position: "relative" }}>
            <Row>
                <Col lg={8} md={8} sm={12}>
                    <CodeMirror
                        value={value}
                        height="600px"
                        theme={vscodeDark}
                        extensions={[
                            javascript(),
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
                <Col lg={4} md={4} sm={12}>
                    <div style={{ marginRight: "10px" }}>
                        <div className="d-flex my-3 align-items-center justify-content-between">
                            <h3>Output</h3>
                            <Button variant="success" onClick={executeCode}>
                                Execute - ctrl+r
                            </Button>
                        </div>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <pre style={{
                            backgroundColor: '#1e1e1e',
                            color: '#d4d4d4',
                            padding: '1em',
                            borderRadius: '4px',
                            minHeight: '500px',
                            overflow: "auto"
                        }}>
                            {output || 'No output'}
                        </pre>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default CodeEditor;
