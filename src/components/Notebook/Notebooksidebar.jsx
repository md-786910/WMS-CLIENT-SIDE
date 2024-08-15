import React, { useEffect, useState } from 'react'
import NotebookModel from '../../model/NotebookModel'
import { showToastError, showToastSuccess } from '../../utils/action'
import { createFile, deleteFilesNameWithContent, getAllFile, orderNotebookFiles } from '../../api'
import { RiDeleteBin3Fill } from "react-icons/ri";
import { GoGrabber } from "react-icons/go";


function Notebooksidebar(props) {
  const [show, setShow] = useState(false)
  const [fileName, setFileName] = useState("")
  const [files, setFiles] = useState([])
  const [draggedItem, setDraggedItem] = useState(null);

  const handleClose = () => {
    setShow(false)
  }
  const handleOpen = () => {
    setShow(true)
  }
  const handleChnage = (e) => {
    setFileName(e.target.value)
  }

  // drag
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, target) => {
    const updatedItems = [...files];
    const draggedIndex = updatedItems.findIndex((item) => item.order === draggedItem.order);
    const targetIndex = updatedItems.findIndex((item) => item.order === target.order);

    if (draggedIndex !== targetIndex) {
      updatedItems.splice(targetIndex, 0, updatedItems.splice(draggedIndex, 1)[0]);
      setFiles(updatedItems);
      console.log({ files })
      // Send PATCH request with all files and their new order
      const dataOrder = updatedItems.map((item) => ({ fileName: item.fileName, order: item.order, _id: item?._id }));
      try {
        const resp = await orderNotebookFiles(dataOrder);
        if (resp?.status === 200) {
          getFiles();
        }
      } catch (error) {
        showToastError(error)

      }

    }
  };



  // create file name
  const createFileNameHandler = async () => {
    try {
      if (fileName) {
        // call axios
        const resp = await createFile(fileName)
        if (resp?.status === 201) {
          showToastSuccess("File created successfully")
          setFileName("")
          setShow(false)
          getFiles();
        }

      } else {
        alert("Please enter a file name")
        return;
      }
    } catch (error) {
      showToastError(error)
    }
  }

  const deleteFile = async (fileId) => {
    try {
      if (fileId) {
        // call axios
        const resp = await deleteFilesNameWithContent(fileId)
        if (resp?.status === 200) {
          showToastSuccess("File deleted successfully")
          getFiles();
        }
      }
    } catch (error) {
      showToastError(error)
    }
  }

  async function getFiles() {
    try {
      const response = await getAllFile()
      if (response.status === 200) {
        setFiles(response.data?.files)
        props.handleFileLength(response.data?.files?.length)
      }
    } catch (error) {
      showToastError(error)

    }
  }

  useEffect(() => {
    getFiles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <>
      <div style={{
        backgroundColor: "whitesmoke",
        width: '16%',
        height: '100vh',
        position: "fixed",
        overflow: "auto",
        paddingBottom: "5rem"

      }}>
        <div className='p-2'>
          <button className='w-100 btn btn-primary' onClick={() => handleOpen()}>
            Create New file
          </button>
        </div>
        {
          files?.map((file, index) => {
            return (
              <div className='d-flex justify-content-between align-items-center cursor' style={{
                padding: '10px',
                borderBottom: '1px solid #ddd',
              }}
                key={file._id}
                draggable="true"
                onDragStart={(e) => handleDragStart(e, file)}
                onDragOver={(e) => handleDragOver(e)}
                onDrop={(e) => handleDrop(e, file)}
              >
                <span>
                  <GoGrabber />
                </span>
                <a href={`/notebook/${file?._id}-${file?.fileName}`} style={{ color: 'blue', fontWeight: "500", fontSize: "17px", textDecoration: "none", textAlign: "start" }}> {file?.fileName?.slice(0, 20)}. </a>
                <span>
                  <button
                    style={{
                      border: "none",
                    }}
                    onClick={(e) => {
                      const confirmation = window.confirm("Are you sure to delete this file?");
                      if (confirmation) {
                        deleteFile(file?._id)
                      }
                    }}
                  >
                    &nbsp;
                    <RiDeleteBin3Fill color={"red"} size={15} />
                  </button>
                </span>
              </div>
            )
          })
        }
      </div>
      {
        show && <NotebookModel show={show} handleClose={handleClose} fileName={fileName} handleChnage={handleChnage} createFileNameHandler={createFileNameHandler} />
      }
    </>
  )
}

export default Notebooksidebar
