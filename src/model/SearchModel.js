import { Button, Modal, Spinner } from 'react-bootstrap'
import React, { useEffect, useRef, useState } from 'react'
import { showToastError } from '../utils/action';
import Axios from '../utils/axios';
import { Link } from 'react-router-dom';

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
function SearchModel(props) {
  const { show, handleClose, handleChnage, search } = props;
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const inputRef = useRef(null)


  const fetchData = async () => {
    try {
      setLoader(true)
      const response = await Axios.get("/search", {
        params: {
          query: search,
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
    fetchData();
  }, 500);

  useEffect(() => {
    if (search.length >= 3) {
      debouncedFetchData(search);

    }


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {

    if (inputRef?.current) {
      inputRef.current.focus()
    }

  }, [])


  return (
    <div>
      <Modal show={show} onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header style={{ borderBottom: "1px solid var(--border)" }}>
          <Modal.Title style={{ width: "100%" }}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search issues, companies, notes… (min 3 chars)"
              aria-label="Search"
              name="search"
              value={search}
              onChange={handleChnage}
              ref={inputRef}
              style={{
                width: '100%',
                height: '48px',
                padding: '10px 14px',
                borderRadius: '10px',
                backgroundColor: '#fff',
                border: '1px solid var(--border-strong)',
                outline: 'none',
                boxShadow: 'var(--shadow-sm)',
                fontSize: '15px',
                fontWeight: '500',
              }}
            />
            {
              loader && <Spinner size='sm' />
            }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='search_content'>

            {
              data?.map((elem, index) => {
                return (
                  <div className='card p-2 px-3 searchTag mb-2' style={{ border: "1px solid var(--border)", borderRadius: 10 }} key={index}>
                    <Link to={`/${elem?.redirectTo}`} onClick={() => handleClose()}>
                      <div className="clamp-2" dangerouslySetInnerHTML={{ __html: elem?.title || elem?.name || elem?.fileName || elem?.content?.slice(0, 100) }} />
                    </Link>


                  </div>
                )
              })
            }


          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>

        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default SearchModel
