import React, {useState} from 'react'
import {Modal, Button, Form} from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import {Row} from 'react-bootstrap'

const BuyModal = () => {
    const dispatch = useDispatch();
    const url = 'https://cloud.iexapis.com/stable/search'
    const token = 'pk_2c889b8c845e4ac9ab45405424391e5e'

    const availableCash = useSelector(state => state.userReducer.balance)
    const show = useSelector(state => state.buyReducer);

    const [selectedStock, setSelectedStock] = useState(null)
    const [searchResults, setSearchResults] = useState(null)
    const [totalCost, setTotalCost] = useState(0.0)
    const [disabled, setDisabled] = useState(true)
    const [error, setError] = useState(null)

    console.log(availableCash)

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    const handleClose = () => {
        dispatch({
            type: 'HIDE'
        })
    }


    const handleSearch = (event) => {
        axios.get(`${url}/${event.target.value}/?token=${token}`)
            .then(response => {
                setSearchResults(response.data)
            })
    }

    const handleShares = (event) => {
        const totalCost = parseFloat(event.target.value) * parseFloat(selectedStock.price)
        setTotalCost(totalCost)
        if(totalCost > availableCash){
            setDisabled(true)
            setError("Not enough cash to buy shares")
            return
        }
        setDisabled(false)
        setError(null)
    }

    const selectStock = (event) => {
        axios.get(`https://cloud.iexapis.com/stable/stock/${event.target.id}/quote?token=${token}`)
            .then(response => {
                setSelectedStock({
                    symbol: response.data.symbol,
                    name: response.data.companyName,
                    price: response.data.latestPrice
                })
            })
        
    }

    const createSearchDivs = () => {
        if(searchResults && searchResults.length === 0){
            return <div className="position-relative bg-light w-50 p-2">No results found</div>
        }
        return searchResults.map((stock,i) => {
            return <div id={stock.symbol} key={i}
                        className="position-relative bg-light w-100 p-2" 
                        style={{cursor: 'pointer'}}
                        onClick={selectStock}>{stock.symbol} : {stock.name}</div>
        })
    }

    const buyForm = () => {
        return (
            <Form>
                <Form.Group as={Row}>
                    <Form.Label>{selectedStock.symbol} : {selectedStock.name}</Form.Label>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label>Latest Price : {formatter.format(selectedStock.price)}</Form.Label>
                </Form.Group>
                {
                    error ? <p className="text-danger text-center">{error}</p> : ''
                }
                <Form.Control type="text" 
                              size='sm' 
                              placeholder="Number of Shares" 
                              className="mt-1"
                              onChange={handleShares}/>
                    <Form.Label>Total Cost: {totalCost}</Form.Label>
                </Form>
        )
    }

    const searchForm = () => {
        return (
            <Form>
                <Form.Control type="text" 
                    size='sm' 
                    placeholder="Search by stock symbol" 
                    onChange={handleSearch}/>
                    {searchResults ? createSearchDivs() : ''}
            </Form>
        )
    }
    
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Buy Stock</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    {
                        selectedStock ? buyForm() : searchForm()

                    }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" 
                        disabled={disabled} 
                        onClick={handleClose}> Buy </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default BuyModal;