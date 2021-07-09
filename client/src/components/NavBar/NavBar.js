import React from 'react';
import logo from './logo.jpg';
import './NavBar.css'

const NavBar = () => {
    return (
        <div id="nav" className="bg-light">
            <img id="logo" src={logo}/>
            <h3 id="title">Stock Trader</h3>
        </div>
    )
}

export default NavBar;