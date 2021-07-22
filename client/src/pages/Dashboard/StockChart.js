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
                colors: ['#B1F2B3', '#7AE18d', '#5ad06a', '#00A100', '#00B100', '#009200', '#007900', '#005B00'],
                backgroundColor: '000000',
                titleTextStyle: {italic: false, bold: true, color: 'FFFFFF', fontSize:'30px'},
                legend: {position: 'none'},
                baselineColor: 'FFFFFF',
            }}
        />
    )
}

export default StockChart;