import React, {useState} from 'react'
import {Modal, Button, Form} from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import {Row} from 'react-bootstrap'
import jwt_decode from 'jwt-decode'

const url = 'http://localhost:5000'

const BuyModal = ({setUserInfo}) => {
    const dispatch = useDispatch();
    const availableCash = useSelector(state => state.userReducer.user.balance)
    const show = useSelector(state => state.buyReducer);

    const [selectedStock, setSelectedStock] = useState(null)
    const [searchResults, setSearchResults] = useState(null)
    const [sharesToBuy, setSharesToBuy] = useState(0)
    const [totalCost, setTotalCost] = useState(0.0)
    const [disabled, setDisabled] = useState(true)
    const [error, setError] = useState(null)
    // const [token, setToken] = useState(sessionStorage.getItem('token'))
    const token = sessionStorage.getItem('token')

    const options = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    const handleBuy = () => {
        const userId = jwt_decode(token).sub
        const data = {
            symbol: selectedStock.symbol,
            shares: sharesToBuy,
            user_id: userId
        }
        axios.post(url + '/api/buy', data, options)
            .then(response => {
                if(response.error){
                    setError(response.error)
                    return
                }
                setUserInfo()
                setError(null)
                setSelectedStock(null)
                setSearchResults(null)
                setTotalCost(0.0)
                setSharesToBuy(0)
                handleClose()
            }).catch(error => setError(error.response))
    }

    const handleSearch = (event) => {
        axios.get(`${url}/api/search/${event.target.value}`, options)
            .then(response => {
                setSearchResults(response.data.search_results)
            })
    }

    const handleShares = (event) => {
        setSharesToBuy(parseInt(event.target.value))
        if(event.target.value.length === 0){
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

    const handleClose = () => {
        dispatch({
            type: 'HIDE_BUY_MODAL'
        })
    }

    const selectStock = (event) => {
        axios.get(`${url}/api/stock/${event.target.id}`, options)
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
                        onClick={handleBuy}> Buy </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default BuyModal;