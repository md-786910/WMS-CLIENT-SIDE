import React, { useEffect, useState } from 'react'
import SearchModel from '../model/SearchModel'
import { ImSearch } from 'react-icons/im'

function Searchbar() {
    const [search, setSearch] = useState("")
    const [show, setShow] = useState(false)

    const handleClose = () => {
        setShow(false)
        setSearch("")
    }
    const handleOpen = () => {
        setShow(true)
    }

    const handleSearchChange = (e) => {
        const text = e.target.value?.trim();
        setSearch(text)
    }

    useEffect(() => {

        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key === " ") {
                // open model
                handleOpen()
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)

    }, [])

    return (
        <>
            <div className='ptr'>
                <ImSearch color="white" size={25} onClick={handleOpen} />

            </div>
            {
                show && <SearchModel show={show} handleClose={handleClose} handleChnage={handleSearchChange} search={search} />
            }
        </>

    )
}

export default Searchbar
