import React, {useState} from 'react';
import { useDispatch, useSelector } from "react-redux"
import jwt_decode from 'jwt-decode'
import { Modal, Button, Row, Form } from 'react-bootstrap'
import axios from 'axios'


const SellModal = ({stock, setUserInfo}) => {
    const dispatch = useDispatch()
    const show = useSelector(state => state.sellReducer);
    const [disabled, setDisabled] = useState(true)
    const [token, setToken] = useState(sessionStorage.getItem('token'))
    const [totalValue, setTotalValue] = useState(0.0)
    const [sharesToSell, setSharesToSell] = useState(0)
    const [error, setError] = useState(null)

    const options = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    const handleClose = () => {
        dispatch({
            type: 'HIDE_SELL'
        })
    }

    const handleShares = (event) => {
        if(event.target.value.length === 0) {
            setDisabled(true)
            setTotalValue(0.0)
            return
        }
        const shares = parseInt(event.target.value) 
        if(shares > stock.shares) {
            setDisabled(true)
            setError("Not enough shares to sell")
            return
        }
        setSharesToSell(shares)
        setError(null)
        setDisabled(false)
        setTotalValue(shares * stock.price)
    }

    const handleSell = () => {
        const userId = jwt_decode(token).sub
        const data = {
            symbol: stock.symbol,
            shares: sharesToSell,
            user_id: userId
        }
        axios.post('/api/sell', data, options)
            .then(response => {
                if(response.error){
                    setError(response.error)
                    return
                }
                setError(null)
                setUserInfo()
                handleClose()
            }).catch(error => setError(error.response))
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Sell Stock</Modal.Title>
            </Modal.Header>
            <Modal.Body className="mx-auto w-75">
                <Form>
                    <Form.Group as={Row}>
                        <Form.Label>{stock.symbol} : {stock.name}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label>Latest Price : {formatter.format(stock.price)}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label>Available Shares : {stock.shares}</Form.Label>
                    </Form.Group>
                    {
                        error ? <p className="text-danger text-center">{error}</p> : ''
                    }
                    <Form.Control type="text" 
                                size='sm' 
                                placeholder="Shares to sell" 
                                className="mt-1"
                                onChange={handleShares}/>
                    <Form.Label className="mt-3">Total Value: {formatter.format(totalValue)}</Form.Label>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" 
                        disabled={disabled} 
                        onClick={handleSell}> Sell </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default SellModal;