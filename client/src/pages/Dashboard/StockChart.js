import React from 'react'
import Chart from 'react-google-charts'
import {useSelector} from 'react-redux'


const StockChart = () => {
    const stocks = useSelector(state => state.userReducer.user.stocks)

    const createChartData = () => {
        const chartData = []
        chartData[0] = ['Stocks', 'Percent of Total']
        stocks.forEach(stock => chartData.push([stock.name, stock.shares]))
        return chartData
    }

    return (
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
    )
}

export default StockChart;