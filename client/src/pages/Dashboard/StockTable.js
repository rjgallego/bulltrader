import React from 'react';
import {Table, Button} from 'react-bootstrap'
import {useSelector} from 'react-redux'

const StockTable = () => {
    const stocks = useSelector(state => state.userReducer.user.stocks)

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    const createRows = () => {
        return stocks.map(stock => {
            return <tr>
                    <td>{stock.name}</td>
                    <td>{stock.symbol}</td>
                    <td>{stock.shares}</td>
                    <td>{formatter.format(stock.price)}</td>
                    <td>{formatter.format(stock.value)}</td>
                    <td>
                        <Button variant="light" size='sm' className="px-3">Sell</Button>
                    </td>
                </tr>
        })
    }

    return (
        <Table variant="dark" size={'sm'}>
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