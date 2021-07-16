import React from 'react'
import './StockBar.css'
import {useSelector} from 'react-redux'
import {Link} from 'react-router-dom'


const StockBar = () => {
    const stocks = useSelector(state => state.userReducer.user.stocks)

    const createStockDivs = () => {
        return stocks.map(stock => {
            return (
                <Link to={`/stock-summary/${stock.symbol}`} 
                      className="stock-div bg-light py-2 text-dark text-decoration-none">
                    <div className="stock-name">
                        <p className="m-0">{stock.symbol}</p>
                    </div>
                    <div className="shares-text">
                        <p className="shares-number">{stock.shares}</p>
                        <p className="shares">Shares</p>
                    </div>
                    <div className={`price-div text-light p-2 ${stock.increase ? 'bg-success' : 'bg-danger'}`}>
                        ${stock.price}
                    </div>
                </Link>
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