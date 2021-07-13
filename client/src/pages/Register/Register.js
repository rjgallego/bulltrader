import React, {useState} from 'react'
import {Form, Row, Col, Button} from 'react-bootstrap'
import NavBar from '../../components/NavBar/NavBar'
import {Redirect} from 'react-router-dom'
import axios from 'axios'

const Register = () => {
    const [validated, setValidated] = useState(false);
    const [isMatch, setIsMatch] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null)
    const [redirect, setRedirect] = useState(false)

    const handleFirstName = (event) => setFirstName(event.target.value)
    const handleLastName = (event) => setLastName(event.target.value)
    const handleEmail = (event) => setEmail(event.target.value)
    const handlePassword = (event) => setPassword(event.target.value)
    const handleConfPassword = (event) =>{ 
        setConfPassword(event.target.value)
        setIsMatch(event.target.value === password)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();

            setValidated(true);
            return
        }

        if(password !== confPassword){
            event.stopPropagation();
            setIsMatch(false)
            return
        }

        const data = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        }

        axios.post('/api/register', data)
            .then(response => {
                if(response.data.error){
                    event.stopPropagation();
                    setErrorMessage(response.data.error)
                } else {
                    setRedirect(true)
                }
            })

    }

    if(redirect){
        return <Redirect to="/" />
    }

    return (
        <div id="register-content" className="d-flex flex-column align-items-center">
            <NavBar />
            <div id="register-form-div" className="w-50 pt-5 mt-3 mx-auto">
                <Form className="bg-light p-5" noValidate validated={validated} onSubmit={handleSubmit}>
                    <h2 className="mb-4 text-center">Sign Up</h2>
                    {
                        errorMessage ? <p className="text-center text-danger">{errorMessage}</p> : ''
                    }
                    <Form.Group as={Row} controlId="formGroupFirstName">
                        <Form.Label column>First Name:</Form.Label>
                        <Col>
                            <Form.Control required type="text" onChange={handleFirstName}/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formGroupLastName">
                        <Form.Label column>Last Name:</Form.Label>
                        <Col>
                            <Form.Control required type="text" onChange={handleLastName}/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formGroupEmail">
                        <Form.Label column>Email Address:</Form.Label>
                        <Col>
                            <Form.Control required type="email" onChange={handleEmail}/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formGroupPassword">
                        <Form.Label column>Password: </Form.Label>
                        <Col>
                            <Form.Control required type="password" onChange={handlePassword}/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formGroupPassword">
                        <Form.Label column> ConfirmPassword</Form.Label>
                        <Col>
                            <Form.Control required type="password" className={isMatch ? '' : 'is-invalid'} onChange={handleConfPassword}/>
                            <Form.Control.Feedback type="invalid">
                                Passwords do not match
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Button className="w-50 mx-auto mt-2" variant="success" type="submit">Create Account</Button>
                    </Form.Group>
                </Form>
            </div>
        </div>
    )
}

export default Register;