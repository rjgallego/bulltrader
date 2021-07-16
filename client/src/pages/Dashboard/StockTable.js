import React, {useState} from 'react';
import {Table, Button} from 'react-bootstrap'
import {useSelector, useDispatch} from 'react-redux'

const StockTable = ({setStockToSell}) => {
    const dispatch = useDispatch()
    const stocks = useSelector(state => state.userReducer.user.stocks)
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    const handleClick = (event) => {
        setStockToSell(stocks[event.target.id])
        dispatch({
            type: 'SHOW_SELL_MODAL'
        })
    }

    const createRows = () => {
        return stocks.map((stock, i) => {
            return <tr key={i}>
                    <td className="overflow-hidden" 
                        style={{whiteSpace: 'nowrap'}}>{stock.name}</td>
                    <td>{stock.symbol}</td>
                    <td>{stock.shares}</td>
                    <td>{formatter.format(stock.price)}</td>
                    <td>{formatter.format(stock.value)}</td>
                    <td>
                        <Button id={i} variant="light" 
                                size='sm' 
                                className="px-3"
                                onClick={handleClick}>Sell</Button>
                    </td>
                </tr>
        })
    }

    return (
            <Table variant="dark" size={'sm'} style={{tableLayout : 'fixed'}}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Symbol</th>
                        <th>Shares</th>
                        <th>Price</th>
                        <th>Total Value</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        createRows()
                    }
                </tbody>
            </Table>

    )
}

export default StockTable;