import React from 'react';
import './StockBar.css'

const data = [ {
        symbol: "AAPL",
        name: "Apple Inc.",
        shares: 73,
        value: 10553.61,
        increase: true
    }, {
        symbol: "TEST",
        name: "Test Inc.",
        shares: 15,
        value: 296.32,
        increase: false
    }
]

const StockBar = () => {
    const createStockDivs = () => {
        return data.map(stock => {
            return (
                <div className="stock-div bg-light py-2">
                    <div className="stock-name">
                        <p className="m-0">{stock.symbol}</p>
                        <p className="name-text">{stock.name}</p>
                    </div>
                    <div className="shares-text">
                        <p className="shares-number">{stock.shares}</p>
                        <p className="shares">Shares</p>
                    </div>
                    <div className={`value-div text-light p-2 ${stock.increase ? 'bg-success' : 'bg-danger'}`}>
                        ${stock.value}
                    </div>
                </div>
            )
        })
    }
    return (
        <div id="stockbar-div" className="position-absolute pl-2 h-100 bg-light">
            {
                createStockDivs()
            }
        </div>
    )
}

export default StockBar;