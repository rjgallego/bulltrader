import React, { useState, useEffect } from 'react'
import {useParams} from 'react-router-dom'
import Chart from 'react-google-charts'
import {Container, Row, Col, Spinner, Form} from 'react-bootstrap'
import NavBar from '../../components/NavBar/NavBar'
import SideBar from '../../components/SideBar/SideBar'
import {Redirect} from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import axios from 'axios'
import {useDispatch} from 'react-redux'

import './StockSummary.css'

const StockSummary = () => {
    const { symbol } = useParams()
    const token = sessionStorage.getItem('token')
    const dispatch = useDispatch()

    const [stockHistory, setStockHistory] = useState(null)
    const [stockInfo, setStockInfo] = useState(null)
    const [reroute, setReroute] = useState(false)
    
    const options = {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
    }

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    useEffect(() => {
        setUserInfo()
        getStockHistory()
        getStockData()
    },[])

    const setUserInfo = () => {
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
                if(error.response && error.response.status === 401) setReroute(true)
            })
    }

    const getStockHistory = () => {
        axios.get(`/api/stock/${symbol}/history`, options)
            .then(response => {
                const historyList = []
                historyList.push(['x', 'Price'])
                const history = response.data.stock_history
                history.forEach(stock => {
                    historyList.push([new Date(stock.date), parseFloat(stock.price)])
                })
                setStockHistory(historyList)
            }).catch(error => {
                if(error.response && error.response.status === 401) setReroute(true)
            })
    }

    const getStockData = () => {
        axios.get(`/api/stock/${symbol}`, options)
            .then(response => setStockInfo(response.data.stock_info))
            .catch(error => {
                if(error.response.status === 401) setReroute(true)
            })
    }
    
    if(!sessionStorage.getItem('token')  || reroute){
        return <Redirect to='/' /> 
    }

    if(!stockHistory || !stockInfo){
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
        <>
            <NavBar />
            <SideBar />
            <Container id="summary-container" className="text-light">
                <Row lg={2} sm={2} className="w-100 mx-auto pt-5 pb-0 text-light">
                    <Col>
                        <h2>{stockInfo.symbol}</h2>
                        <p>{stockInfo.companyName}</p>
                    </Col>
                    <Col>
                        <h2 className="text-light">{formatter.format(stockInfo.latestPrice)}</h2>
                        <p className="text-light">Latest Price</p>
                    </Col>
                </Row>
                <Row lg={2} className="mx-auto w-100 mt-0 mx-auto">
                    <Col lg='8'>
                        <Chart
                            width={'100%'}
                            height={'30vh'}
                            chartType="LineChart"
                            loader={<div>Loading Chart</div>}
                            data={stockHistory}
                            options={{
                                hAxis: {
                                    title: 'Time',
                                    textStyle:{color: '#FFF'},
                                    format: 'MMM YY'
                                },
                                vAxis: {
                                    title: 'Price',
                                    color: '#FFFFFF',
                                    textStyle:{color: '#FFF'},
                                    format: 'currency'
                                },
                                legend: {
                                    textStyle: '#FFF'
                                },
                                lineColor: '#FFFFFF',
                                colors: ['#28a745'],
                                backgroundColor: '#000000',
                                baselineColor: 'FFFFFF',
                            }}
                            rootProps={{ 'data-testid': '1' }}
                        />
                    </Col>
                    <Col lg='4'>
                        <Form>
                            <h3>Stats</h3>
                            <Form.Group as={Row} className="text-light">
                                <Col>
                                    <h6>Open</h6>
                                    <p>{formatter.format(stockInfo.open || stockInfo.latestPrice)}</p>
                                    <h6>High</h6>
                                    <p>{formatter.format(stockInfo.high)}</p>
                                    <h6>Prior Close</h6>
                                    <p>{formatter.format(stockInfo.previousClose)}</p>
                                    <h6>52 Week High</h6>
                                    <p>{formatter.format(stockInfo.week52High)}</p>
                                    <h6>YTD Change</h6>
                                    <p>{formatter.format(stockInfo.ytdChange)}</p>
                                </Col>
                                <Col>
                                    <h6>Close</h6>
                                    <p>{formatter.format(stockInfo.close || stockInfo.previousClose)}</p>
                                    <h6>Low</h6>
                                    <p>{formatter.format(stockInfo.low)}</p>
                                    <h6>Market Cap</h6>
                                    <p>{formatter.format(stockInfo.marketCap)}</p>
                                    <h6>52 Week Low</h6>
                                    <p>{formatter.format(stockInfo.week52Low)}</p>
                                    <h6>Primary Exchange</h6>
                                    <p>{stockInfo.primaryExchange}</p>
                                </Col>
        
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default StockSummary; 