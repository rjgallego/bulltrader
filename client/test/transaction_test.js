const axios = require('axios')
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const url = 'http://localhost:5000'
const should = chai.should()
const jwt_decode = require('jwt-decode')

describe('test user buy/sell transations and retrieving user information', () => {
    let token, userId;
    const testUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@email.com',
        password: 'testpassword'
    }

    before(async () => {
        await axios.post(`${url}/api/register`, testUser)
    })

    beforeEach(async () => {
        await axios.post(`${url}/api/login`, {email: testUser.email, password: testUser.password})
            .then(response => {
                token = response.data.token
                userId = jwt_decode(token).sub
            })
    })

    after(async () => {
        await axios.post(`${url}/api/delete-user`, {email: testUser.email})
    })

    it('should return error for invalid user id', (done) => {
        chai.request(url)
            .post('/api/buy')
            .set('Authorization', `Bearer ${token}`)
            .send({
                symbol: 'MSFT',
                shares: 75,
                user_id: 100
            })
            .end((err, res) => {
                if(err) console.log(err)

                res.status.should.equal(404)
                res.body.should.be.a('object')
                res.body.should.have.property('error')
                res.body.error.should.equal('Account does not exist')

                done()
            })
    })

    it('should store stock name and shares in database', (done) => {
        chai.request(url)
            .post('/api/buy')
            .set('Authorization', `Bearer ${token}`)
            .send({
                symbol: 'MSFT',
                shares: 75,
                user_id: userId
            })
            .end((err, res) => {
                if(err) console.log(err)

                res.status.should.equal(200)
                res.body.should.be.a('object')
                res.body.should.have.property('success')
                res.body.success.should.equal('Added stock to database')

                done()
            })
    })

    it('should increase the shares to the existing stock in the database', (done) => {
        chai.request(url)
            .post('/api/buy')
            .set('Authorization', `Bearer ${token}`)
            .send({
                symbol: 'MSFT',
                shares: 25,
                user_id: userId
            })
            .end((err, res) => {
                if(err) console.log(err)

                res.status.should.equal(200)
                res.body.should.be.a('object')
                res.body.should.have.property('success')
                res.body.success.should.equal('Stock shares increased and saved')

                done()
            })
    })

    it('should return error for invalid user id', (done) => {
        chai.request(url)
            .post('/api/sell')
            .set('Authorization', `Bearer ${token}`)
            .send({
                symbol: 'MSFT',
                shares: 50,
                user_id: 100
            })
            .end((err, res) => {
                if(err) console.log(err)

                res.status.should.equal(404)
                res.body.should.be.a('object')
                res.body.should.have.property('error')
                res.body.error.should.equal('Account does not exist')

                done()
            })
    })

    it('should return error for stock user does not own', (done) => {
        chai.request(url)
            .post('/api/sell')
            .set('Authorization', `Bearer ${token}`)
            .send({
                symbol: 'TWTR',
                shares: 50,
                user_id: userId
            })
            .end((err, res) => {
                if(err) console.log(err)

                res.status.should.equal(404)
                res.body.should.be.a('object')
                res.body.should.have.property('error')
                res.body.error.should.equal('User does not own any stock with symbol: TWTR')

                done()
            })
    })

    it('should update users shares and remaining balance in the database', (done) => {
        chai.request(url)
            .post('/api/sell')
            .set('Authorization', `Bearer ${token}`)
            .send({
                symbol: 'MSFT',
                shares: 50,
                user_id: userId
            })
            .end((err, res) => {
                if(err) console.log(err)

                res.status.should.equal(200)
                res.body.should.be.a('object')
                res.body.should.have.property('success')
                res.body.success.should.equal('Stock shares sold')

                done()
            })
    })

    it('should return users balance stock information', (done) => {
        chai.request(url)
            .get('/api/stocks/' + userId)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                if(err) console.log(err)

                const price = res.body.stocks[0].price
                const value = price * 50
                const balance = 100000 - value

                res.status.should.equal(200)
                res.body.should.be.a('object')

                res.body.should.have.property('id')
                res.body.id.should.equal(String(userId))

                res.body.should.have.property('firstName')
                res.body.firstName.should.equal(testUser.firstName)

                res.body.should.have.property('balance')
                res.body.balance.should.equal(balance.toFixed(2))
                res.body.should.have.property('value')
                res.body.value.should.equal(parseFloat(value.toFixed(1)))

                res.body.should.have.property('stocks')
                res.body.stocks.should.be.a('array')
                res.body.stocks.should.have.length(1)
                res.body.stocks[0].should.have.property('symbol')
                res.body.stocks[0].symbol.should.equal('MSFT')
                res.body.stocks[0].value.should.equal(parseFloat(value.toFixed(1)))

                done()
            })
    })

    it('should sell all shares and remove stock from database', (done) => {
        chai.request(url)
            .post('/api/sell')
            .set('Authorization', `Bearer ${token}`)
            .send({
                symbol: 'MSFT',
                shares: 50,
                user_id: userId
            })
            .end((err, res) => {
                if(err) console.log(err)

                res.status.should.equal(200)
                res.body.should.be.a('object')
                res.body.should.have.property('success')
                res.body.success.should.equal('All shares sold')

                done()
            })
    })

})