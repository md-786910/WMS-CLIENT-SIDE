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
        setSearch(e.target.value)
    }

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === " " || e.key.toLowerCase() === "k")) {
                e.preventDefault();
                handleOpen()
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    return (
        <>
            <button
                type="button"
                onClick={handleOpen}
                title="Search (Ctrl+K)"
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "rgba(255,255,255,.08)",
                    border: "1px solid rgba(255,255,255,.14)",
                    color: "rgba(255,255,255,.85)",
                    borderRadius: 10,
                    padding: "6px 12px",
                    fontSize: 13,
                }}
            >
                <ImSearch size={14} />
                <span className="d-none d-md-inline">Search…</span>
                <kbd style={{ background: "rgba(255,255,255,.12)", borderRadius: 6, padding: "0 6px", fontSize: 11 }}>Ctrl K</kbd>
            </button>
            {
                show && <SearchModel show={show} handleClose={handleClose} handleChnage={handleSearchChange} search={search} />
            }
        </>
    )
}

export default Searchbar
