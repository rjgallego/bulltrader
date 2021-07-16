import React, {useState} from 'react';
import {Nav} from 'react-bootstrap'
import {ImMenu3, ImMenu4, ImHome, ImStatsDots, ImExit} from 'react-icons/im';
import './SideBar.css';
import StockBar from '../StockBar/StockBar'
import {useSelector} from 'react-redux'

const SideBar = () => {
    const [visible, setVisible] = useState(false)
    const [sbVisible, setSbVisible] = useState(false)
    const name = useSelector(state => state.userReducer.user.firstName)

    const handleClick = () => {
        setVisible(!visible)
        hideStockBar()
    }
    const handleHover = () => setSbVisible(true)
    const hideStockBar = () => setSbVisible(false)

    return (
        <div id="sidebar-div" className="position-fixed">
            <div id="sidebar-icon">
                {
                    visible ? 
                        <ImMenu4 className="menu-icon" size={35} onClick={handleClick} />
                    :   <ImMenu3 className="menu-icon" size={35} onClick={handleClick}/>
                }
            </div>
            <div className={`sidebar-nav overflow-hidden ${visible ? 'visible' : ''}`}>
                <Nav id="sidebar-menu" variant="tabs" defaultActiveKey="/dashboard"
                    className="flex-column position-relative float-right pt-2 h-100 bg-light overflow-hidden">
                    <h5 className="ml-2">Hello, {name}!</h5>
                    <Nav.Link href="/dashboard" className="text-dark pr-5" onMouseOver={hideStockBar}>
                        <ImHome className="mr-3"/> Dashboard
                    </Nav.Link>
                    <Nav.Link eventKey="link-1" className="text-dark pr-5" onMouseOver={handleHover}>
                        <ImStatsDots className="mr-3"/> My Stocks
                    </Nav.Link>
                    <Nav.Link eventKey="link-2" className="text-dark pr-5" onMouseOver={hideStockBar}>
                        <ImExit className="mr-3"/> Logout
                    </Nav.Link>
                </Nav>
            </div>
            {
                sbVisible ? <StockBar /> : ""
            }
        </div>
    )
}

export default SideBar;