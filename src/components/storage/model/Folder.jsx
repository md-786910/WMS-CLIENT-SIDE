import { Button, Modal } from "react-bootstrap";
import React, { useEffect, useRef } from "react";

function FolderModel(props) {
  const {
    show,
    handleClose,
    handleChange,
    folderName,
    createFolderNameHandler,
  } = props;
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef?.current) {
      inputRef.current.focus();
    }
  }, [show]);
  return (
    <div>
      <Modal
        show={show}
        onHide={handleClose}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title>Create new folder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="search_content">
            <input
              class="form-control me-2"
              type="search"
              placeholder="create new folder"
              aria-label="folder name"
              name="folderName"
              value={folderName}
              onChange={handleChange}
              ref={inputRef}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={(e) => createFolderNameHandler(e)}>
            Create
          </Button>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default FolderModel;
