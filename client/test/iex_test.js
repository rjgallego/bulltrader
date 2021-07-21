const axios = require('axios')
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const url = 'http://localhost:5000'
const should = chai.should()

describe('get information on stocks from IEX', () => {
    let token;
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
            .then(response => token = response.data.token)
    })

    after(async () => {
        await axios.post(`${url}/api/delete-user`, {email: testUser.email})
    })

    it('should return list of stocks based on search string', (done) => {
        chai.request(url)
            .get('/api/search/tw')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                if(err) console.log(err)
                
                res.should.have.status('200')
                res.body.should.be.a('object')
                res.body.should.have.property('search_results')
                res.body.search_results.should.be.a('array')
                res.body.search_results.should.have.length(10)
                done()
            })
    }) 

    it('should return info on a specific stock by symbol', (done) => {
        chai.request(url)
            .get('/api/stock/twtr')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                if(err) console.log(err)
                
                res.should.have.status('200')
                res.body.should.be.a('object')
                res.body.should.have.property('stock_info')
                res.body.stock_info.should.be.a('object')
                res.body.stock_info.should.have.property('symbol')
                res.body.stock_info.symbol.should.equal('TWTR')
                
                done()
            })
    }) 

    it('should return the 6 month history of a stock price by date', (done) => {
        chai.request(url)
            .get('/api/stock/twtr/history')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                if(err) console.log(err)
                
                res.should.have.status('200')
                res.body.should.be.a('object')
                res.body.should.have.property('stock_history')
                res.body.stock_history.should.be.a('array')
                res.body.stock_history.should.have.length(125)  
                
                res.body.stock_history[0].should.have.property('date')
                res.body.stock_history[0].should.have.property('price')
                done()
            })
    }) 
})