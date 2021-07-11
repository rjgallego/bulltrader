from backend import db
from datetime import date

class UserModel(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    account = db.relationship("AccountModel", backref="user", uselist=False)
    firstname = db.Column(db.String(200))
    lastname = db.Column(db.String(200))
    email = db.Column(db.String(200), unique=True)
    hash = db.Column(db.String(200), unique=True)
    
    def __repr__(self):
        return '<id {}>'.format(self.id)

class AccountModel(db.Model):
    __tablename__ = 'accounts'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    balance = db.Column(db.Numeric)
    created_on = db.Column(db.Date, default=date.today())
    stocks = db.relationship('StockModel', backref='account')
    
    def __repr__(self):
        return '<account_id {}>'.format(self.id)

class StockModel(db.Model):
    __tablename__ = 'stocks'
    id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String(10))
    shares = db.Column(db.Integer)
    acct_id = db.Column(db.Integer, db.ForeignKey('accounts.id'))
    
    def __repr__(self):
        return '<stock_id {}>'.format(self.id)