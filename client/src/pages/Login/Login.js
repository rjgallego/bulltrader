import React, {useState} from 'react';
import {Container, Row, Col, Form, Button} from 'react-bootstrap';
import ImgCarousel from './ImgCarousel';
import NavBar from '../../components/NavBar/NavBar';
import './Login.css';

const Login = () => {
    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();

            setValidated(true);
            return
        }
    }
    return (
        <div>
            <NavBar/>
            <div id="login-container">
                <Container>
                    <Row lg={2}>
                        <Col>
                            <ImgCarousel />
                        </Col>
                        <Col>
                            <Form noValidate validated={validated} onSubmit={handleSubmit}
                                className='bg-light h-100 d-flex flex-column justify-content-center'>
                                <h2 className='text-center mb-5'>Welcome to Stock Trader</h2>
                                <h5 className='text-center mb-4'>Please Sign In</h5>
                                <Form.Control required className="w-75 mx-auto mb-3" type="email" placeholder="Enter Email" />
                                <Form.Control required className="w-75 mx-auto mb-4" type="password" placeholder=" Enter Password" />
                                <Form.Group as={Row} className="d-flex flex-column">
                                    <Button className="w-50 mx-auto mb-2" variant="success" type="submit">Login</Button>
                                    <Button href="/register" className="w-50 mx-auto" variant="success">Register</Button>
                                </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    )

}

export default Login;