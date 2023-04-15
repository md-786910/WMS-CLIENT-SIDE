import React from 'react'
import Header from './Header'
import Footer1 from './Footer'

function Layout({ Children }) {
    return (
        <>
            <Header />
            {Children}
            <Footer1 />
        </>
    )
}

export default Layout