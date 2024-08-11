import { Button, Modal, Spinner } from 'react-bootstrap'
import React, { useEffect, useRef, useState } from 'react'
import { showToastError } from '../utils/action';
import Axios from '../utils/axios';

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        const context = this;
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}
function NotebookModel(props) {
    const { show, handleClose, handleChnage, fileName, createFileNameHandler } = props;
    const [data, setData] = useState([]);
    const [loader, setLoader] = useState(false);
    const inputRef = useRef(null)


    const fetchData = async () => {
        try {
            setLoader(true)
            const response = await Axios.get("/search", {
                params: {
                    query: fileName,
                }
            });
            if (response.status === 200) {
                setLoader(false)
                setData(response.data);
            }
        } catch (error) {
            console.log(error);
            setLoader(false)
            showToastError('Error fetching issues');
        }
    };


    const debouncedFetchData = debounce((searchQuery) => {
        // fetchData();
    }, 500);

    useEffect(() => {
        if (fileName) {
            //   debouncedFetchData(search);

        }


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fileName]);

    useEffect(() => {

        if (inputRef?.current) {
            inputRef.current.focus()
        }

    }, [])


    return (
        <div>
            <Modal show={show} onHide={handleClose}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header >
                    <Modal.Title >
                        Create new file
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='search_content'>

                        <input
                            class="form-control me-2"
                            type="search"
                            placeholder="create new file"
                            aria-label="Search"
                            name="fileName"
                            value={fileName}
                            onChange={handleChnage}
                            ref={inputRef}
                        />
                        {
                            loader && <Spinner size='sm' />
                        }


                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={createFileNameHandler}>
                        Create
                    </Button>
                    <Button variant="danger" onClick={handleClose}>
                        Close
                    </Button>

                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default NotebookModel
