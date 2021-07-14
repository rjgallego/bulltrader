import React, {useState} from 'react';
import {Container, Row, Col, Form, Button} from 'react-bootstrap'
import ImgCarousel from './ImgCarousel'
import NavBar from '../../components/NavBar/NavBar'
import './Home.css'
import axios from 'axios'
import {Redirect} from 'react-router-dom'


const Home = () => {
    const [validated, setValidated] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage,setErrorMessage] = useState(null);
    const [reroute, setReroute] = useState(false)
    const handleEmail = (event) => setEmail(event.target.value)
    const handlePassword = (event) => setPassword(event.target.value)

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();

            setValidated(true);
            return
        }

        const data = {
            email: email,
            password: password
        }

        axios.post('/api/login', data)
            .then(response => {
                if(response.data.error){
                    setErrorMessage(response.data.error)
                    return
                } 

                sessionStorage.setItem("token", response.data.token)
                setReroute(true)

            })
    }

    if(reroute){
        return <Redirect to="/dashboard" />
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
                                <h2 className='text-center mb-5'>Welcome to Bull Trader</h2>
                                <h5 className='text-center mb-4'>Please Sign In</h5>
                                { errorMessage ? <p className="text-center text-danger">{errorMessage}</p> : ''}
                                <Form.Control required className="w-75 mx-auto mb-3" type="email" placeholder="Enter email" onChange={handleEmail}/>
                                <Form.Control required className="w-75 mx-auto mb-4" type="password" placeholder=" Enter password" onChange={handlePassword}/>
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

export default Home;