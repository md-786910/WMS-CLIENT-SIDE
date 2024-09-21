import React, { useCallback, useEffect, useRef, useState } from "react";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { basicSetup } from "@uiw/codemirror-extensions-basic-setup";
import { autocompletion } from "@codemirror/autocomplete";
import { githubDark, githubLight } from "@uiw/codemirror-theme-github";
import { Alert, Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { AiOutlineSetting } from "react-icons/ai";
import useLocalStorage from "../../hooks/useLocalStorage";
function CodeEditor() {
  const [value, setValue] = useState("console.log('Welcome to WMS');");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [theme, setTheme] = useState(vscodeDark);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const editorRef = useRef(null);
  const [localstorageData, setLocalStorageData] = useLocalStorage(
    "code",
    "console.log('Welcome to WMS');"
  );

  const onChange = useCallback((val) => {
    setValue(val);
    setLocalStorageData(val);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const executeCode = useCallback(() => {
    setIsLoading(true);
    try {
      setError(null);
      let consoleOutput = [];

      const customConsole = {
        log: (...args) => {
          consoleOutput.push(args.join(" "));
        },
      };

      // Add offset lines to match CodeMirror line numbers
      const offsetLines = 2;
      // eslint-disable-next-line no-new-func
      const scriptFunction = new Function(
        "console",
        "\n".repeat(offsetLines) + value
      );
      scriptFunction(customConsole);

      setOutput(consoleOutput.join("\n"));
    } catch (err) {
      const errorMessage = parseError(err);
      setError(errorMessage);
      setOutput("");
    } finally {
      setIsLoading(false);
    }
  }, [value]);

  const customCompletions = useCallback((context) => {
    let before = context.matchBefore(/\w+/);
    if (!before || before.from === before.to) return null;
    return {
      from: before.from,
      options: [
        { label: "console", type: "keyword" },
        { label: "log", type: "function" },
        { label: "error", type: "function" },
        { label: "warn", type: "function" },
        { label: "info", type: "function" },
        // Add more custom completions here
      ],
    };
  }, []);

  const parseError = (err) => {
    const offsetLines = 2; // This should match the number of lines added before the code
    const lineMatch = err.stack.match(/<anonymous>:(\d+):\d+/);
    let lineNumber = lineMatch
      ? parseInt(lineMatch[1], 10) - offsetLines
      : "unknown";
    if (lineNumber < 1) lineNumber = 1; // Ensure line number doesn't go below 1
    return `${err.message} (at line ${lineNumber})`;
  };

  // add font size functionality
  const fontSizeTheme = EditorView.theme({
    "&": {
      fontSize: `${fontSize}px`,
    },
  });
  const handleThemeChange = (selectedTheme) => {
    switch (selectedTheme) {
      case "vscodeDark":
        setTheme(vscodeDark);
        break;
      case "githubDark":
        setTheme(githubDark);
        break;
      case "githubLight":
        setTheme(githubLight);
        break;
      default:
        setTheme(vscodeDark);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        if (!isLoading) {
          executeCode();
        }
      }
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        executeCode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [executeCode, isLoading]);

  useEffect(() => {
    setValue(localstorageData);
  }, [localstorageData]);
  return (
    <div
      className="p-0"
      style={{
        marginTop: "4.4em",
        position: "relative",
        background: "#1e1e1e",
        overflowY: "hidden",
      }}
    >
      <div className="d-flex" title="Settings">
        <Button
          onClick={() => setShowSettingsModal(true)}
          className="btn btn-sm btn-dark mt-3"
        >
          <AiOutlineSetting />
        </Button>
      </div>
      <Row>
        <Col lg={8} md={8} sm={12}>
          <CodeMirror
            value={value}
            height="600px"
            theme={theme}
            extensions={[
              javascript(),
              basicSetup({
                foldGutter: false,
                dropCursor: false,
                allowMultipleSelections: false,
                indentOnInput: false,
              }),
              autocompletion({
                override: [customCompletions],
              }),
              fontSizeTheme,
            ]}
            onChange={onChange}
            editable={!isLoading}
            ref={editorRef}
          />
        </Col>
        <Col lg={4} md={4} sm={12}>
          <div style={{ marginRight: "10px" }}>
            <div className="d-flex my-3 align-items-center justify-content-between text-warning">
              <h3>Output</h3>
              <Button
                variant="success"
                onClick={executeCode}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />{" "}
                    Loading...
                  </>
                ) : (
                  "Execute(ctrl+enter)"
                )}
              </Button>
            </div>
            {error && <Alert variant="danger">{error}</Alert>}
            <pre
              style={{
                backgroundColor: "#1e1e1e",
                color: "yellow",
                padding: "1em",
                borderRadius: "4px",
                minHeight: "500px",
                overflow: "auto",
              }}
            >
              {output || "No output"}
            </pre>
          </div>
        </Col>
      </Row>
      <Modal
        show={showSettingsModal}
        onHide={() => setShowSettingsModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Editor Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Font Size</Form.Label>
              <Form.Control
                as="select"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
              >
                {[12, 14, 16, 18, 20, 22, 24].map((size) => (
                  <option key={size} value={size}>
                    {size}px
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Theme</Form.Label>
              <Form.Control
                as="select"
                value={theme.name}
                onChange={(e) => handleThemeChange(e.target.value)}
              >
                <option value="vscodeDark">VS Code Dark</option>
                <option value="githubDark">GitHub Dark</option>
                <option value="githubLight">GitHub Light</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowSettingsModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CodeEditor;
