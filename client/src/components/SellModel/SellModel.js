import React from 'react';
import {Modal, Button, Form} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

const SellModel = () => {
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch({
            type: 'HIDE'
        })
    }
    const show = useSelector(state => state.buyReducer);
    
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Buy Stock</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control type="text" size='sm' placeholder="Search by name or symbol" />
                    <Form.Control type="text" size='sm' placeholder="Number of Shares" />
                </Form>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={handleClose}>
                    Buy
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default SellModel;