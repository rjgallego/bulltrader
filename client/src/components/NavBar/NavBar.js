import React from 'react';
import logo from './logo.jpg';
import './NavBar.css'

const NavBar = () => {
    return (
        <div id="nav" className="bg-light">
            <img id="logo" className="mr-3" src={logo}/>
            <h3 id="title" className="mr-4">Bull Trader</h3>
        </div>
    )
}

export default NavBar;