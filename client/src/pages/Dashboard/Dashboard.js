import React, {useState, useEffect} from 'react'
import NavBar from '../../components/NavBar/NavBar'
import SideBar from '../../components/SideBar/SideBar'
import StockTable from './StockTable'
import StockChart from './StockChart'
import BuyModal from '../../components/BuyModal/BuyModal'
import { Container, Row, Col, Button, Spinner} from 'react-bootstrap'
import jwt_decode from 'jwt-decode'
import axios from 'axios'
import {useDispatch, useSelector} from 'react-redux';
import { Redirect } from 'react-router-dom';

import './Dashboard.css'

const Dashboard = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.userReducer)
    const [reroute, setReroute] = useState(false)
    //const [token, setToken] = useState(token)

    useEffect(() => {
        setUserInfo()
    },[])

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    const setUserInfo = () => {
        const token = sessionStorage.getItem('token')
        const userId = jwt_decode(token).sub

        const options = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        axios.get(`/api/stocks/${userId}`, options)
            .then(response => {
                dispatch({
                    type: 'SET_USER',
                    payload: response.data
                })
            }).catch(error => {
                if(error.response.status == 401) setReroute(true)
            })
    }

    const handleClick = () => {
        dispatch({
            type: 'SHOW'
        })
        // dispatch({
        //     type: 'UPDATE_USER_STOCKS',
        //     payload: data.stocks
        // })
    }

    if(!sessionStorage.getItem('token')  || reroute){
        return <Redirect to='/' /> 
    }

    if(!user){
        return (
            <>
                <NavBar />
                <div className="h-100 w-100 d-flex justify-content-center align-items-center">
                    <Spinner animation="border" 
                            role="status" 
                            variant="light"/>
                </div>
            </>
        )
    }

    return (
        <div id="dashboard-div">
            <NavBar />
            <SideBar />
            <Container id="dashboard-container" className="position-fixed overflow-hidden pt-5 text-light ml-5">
                <Row className="d-flex flex-column ml-3">
                    <h1 className="mb-0">{formatter.format(user.user.value)}</h1>
                    <p className="mt-0">Portfolio Value</p>
                </Row>
                <Row lg={2} className="w-100">
                    <Col>
                        <div id="table-div">
                            <StockTable />
                        </div>
                        <Row lg={2}>
                            <Col className="text-center">
                                <p className="mb-0 mt-3">Available Cash</p>
                                <h2 className="mt-0">{formatter.format(user.user.balance)}</h2>
                            </Col>
                            <Col className="text-center d-flex align-items-center">
                                <Button variant="success" className="w-75 h-75" onClick={handleClick}>Buy</Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <StockChart />
                    </Col>
                </Row>
            </Container>
            <BuyModal />
        </div>
    )
}

export default Dashboard;
