import React, {useState} from 'react'
import {Modal, Button, Form} from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import {Row} from 'react-bootstrap'

const BuyModal = () => {
    const dispatch = useDispatch();

    const options = {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
    }

    const availableCash = useSelector(state => state.userReducer.user.balance)
    const show = useSelector(state => state.buyReducer);

    const [selectedStock, setSelectedStock] = useState(null)
    const [searchResults, setSearchResults] = useState(null)
    const [totalCost, setTotalCost] = useState(0.0)
    const [disabled, setDisabled] = useState(true)
    const [error, setError] = useState(null)

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
        axios.get(`api/search/${event.target.value}`, options)
            .then(response => {
                setSearchResults(response.data.search_results)
            })
    }

    const handleShares = (event) => {
        if(event.target.value.length == 0){
            setTotalCost(0.0)
            return
        }

        const totalCost = parseFloat(event.target.value) * parseFloat(selectedStock.price)
        setTotalCost(totalCost)
        if(totalCost > parseFloat(availableCash)){
            setDisabled(true)
            setError("Not enough cash to buy shares")
            return
        }
        setDisabled(false)
        setError(null)
    }

    const selectStock = (event) => {
        axios.get(`/api/stock/${event.target.id}`, options)
            .then(response => {
                setSelectedStock({
                    symbol: response.data.stock_info.symbol,
                    name: response.data.stock_info.companyName,
                    price: response.data.stock_info.latestPrice
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
                    <Form.Label className="mt-3">Total Cost: {formatter.format(totalCost)}</Form.Label>
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
            <Modal.Body className="mx-auto w-75">
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