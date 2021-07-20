const chai = require('chai')
const chaiHttp = require('chai-http')
//import fs from 'fs'

chai.use(chaiHttp)
const url = 'http://localhost:5000'
const should = chai.should()

describe('Register a new user and login', () => {
    it('should return error message that email does not exist', (done) => {
        chai.request(url)
            .post('/api/login')
            .send({
                email: 'doesnotexist@email.com',
                password: 'testpassword'
            })
            .end((err, res) => {
                if(err) console.log(err)

                res.should.have.status('404')
                res.body.should.be.a('object')
                res.body.should.have.property('error')
                res.body.error.should.equal('Email does not exist')
                done()
            })
    })

    it('should take user info in an object and store in database', (done) => {
        chai.request(url)
            .post('/api/register')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'test@email.com',
                password: 'testpassword'
            })
            .end((err, res) => {
                if(err) console.log(err)

                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('success')
                res.body.success.should.equal('User added to database')
                done()
            })
    })

    it('should return error that email already exists in database', (done) => {
        chai.request(url)
            .post('/api/register')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'test@email.com',
                password: 'testpassword'
            })
            .end((err, res) => {
                if(err) console.log(err)

                res.should.have.status(400)
                res.body.should.be.a('object')
                res.body.should.have.property('error')
                res.body.error.should.equal('Account with that email already exists')
                done()
            })
    })

    it('should return an invalid password error', (done) => {
        chai.request(url)
            .post('/api/login')
            .send({
                email: 'test@email.com',
                password: 'invalidpassword'
            })
            .end((err, res) => {
                if(err) console.log(err)

                res.should.have.status(403)
                res.body.should.be.a('object')
                res.body.should.have.property('error')
                res.body.error.should.equal('Invalid password')
                done()
            })
    })

    it('should return object with users access token', (done) => {
        chai.request(url)
            .post('/api/login')
            .send({
                email: 'test@email.com',
                password: 'testpassword'
            })
            .end((err, res) => {
                if(err) console.log(err)
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('token');
                done()
            })
    })

    it('should delete the test user from the database', (done) => {
        chai.request(url)
            .post('/api/delete-user')
            .send({
                email: 'test@email.com'
            })
            .end((err, res) => {
                if(err) console.log(err)

                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('success')
                res.body.success.should.equal('User deleted from database')
                done()
            })
    })

    it('should confirm that users email does not exist in database', (done) => {
        chai.request(url)
        .post('/api/delete-user')
        .send({
            email: 'test@email.com'
        })
        .end((err, res) => {
            if(err) console.log(err)

            res.should.have.status(404)
            res.body.should.be.a('object')
            res.body.should.have.property('error')
            res.body.error.should.equal('Email does not exist')
            done()
        })
    })
})