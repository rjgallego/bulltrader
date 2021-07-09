import React from 'react';
import NavBar from '../../components/NavBar/NavBar';
import SideBar from '../../components/SideBar/SideBar';
import StockTable from './StockTable';
import { Container, Row, Col, Button} from 'react-bootstrap';
import Chart from 'react-google-charts'

import './Dashboard.css'

const data = {
    firstName: "Joe",
    lastName: "Smith",
    value: 123384.96,
    cash: 890000.00,
    stocks: [ {
            symbol: "AAPL",
            name: "Apple Inc.",
            shares: 73,
            price: 143.24,
            value: 10553.61,
            increase: true
        }, {
            symbol: "TEST",
            name: "Test Inc.",
            shares: 15,
            price: 25.24,
            value: 378.6,
            increase: false
        }, {
            symbol: "TEST",
            name: "Test Inc.",
            shares: 15,
            price: 25.24,
            value: 378.6,
            increase: false
        }, {
            symbol: "TEST",
            name: "Test Inc.",
            shares: 15,
            price: 25.24,
            value: 378.6,
            increase: false
        }
    ]
}

const Dashboard = () => {

    const createChartData = () => {
        const chartData = []
        chartData[0] = ['Stocks', 'Percent of Total']
        data.stocks.forEach(stock => chartData.push([stock.name, stock.shares]))
        return chartData
    }

    return (
        <div id="dashboard-div">
            <NavBar />
            <SideBar />
            <Container id="dashboard-container" className="position-fixed overflow-hidden pt-5 text-light ml-5">
                <Row className="d-flex flex-column ml-3">
                    <h1 className="mb-0">{data.value}</h1>
                    <p className="mt-0">Portfolio Value</p>
                </Row>
                <Row lg={2} className="w-100">
                    <Col>
                        <div id="table-div">
                            <StockTable stocks={data.stocks} />
                        </div>
                        <Row lg={2}>
                            <Col className="text-center">
                                <p className="mb-0 mt-3">Available Cash</p>
                                <h2 className="mt-0">{data.cash}</h2>
                            </Col>
                            <Col className="text-center d-flex align-items-center">
                                <Button variant="success" className="w-75 h-75">Buy</Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <Chart 
                            className="bg-dark"
                            width={'100%'}
                            height={'70vh'}
                            chartType='PieChart'
                            loader={<div>Loading Chart</div>}
                            data={
                                createChartData()
                            }
                            options={{
                                title: 'Portfolio Summary',
                                pieHole: 0.3,
                                animation: {
                                    startup: true,
                                    easing: 'linear',
                                    duration: 1500,
                                  },
                                  colors: ['#e0440e', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'],
                                  backgroundColor: '000000',
                                  titleTextStyle: {italic: false, bold: true, color: 'FFFFFF', fontSize:'30px'},
                                  legend: {position: 'none'},
                                  baselineColor: 'FFFFFF',
                            }}
                        />
                    </Col>
                </Row>
            </Container>
            
        </div>
    )
}

export default Dashboard;
