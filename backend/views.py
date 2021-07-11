from flask import Blueprint, request, jsonify
from backend import db
from flask_jwt_extended import jwt_required
from .models import StockModel, AccountModel
import requests
import os
import decimal

views = Blueprint('views', __name__)
url = 'https://cloud.iexapis.com/stable/stock/'
token =  os.environ.get('IEX_TOKEN')

@views.route('/stocks/<user_id>', methods=["GET"])
@jwt_required()
def get_stocks(user_id=0):
    if request.method == "GET":
        account = AccountModel.query.filter_by(user_id=user_id).first()
        if account == None:
            return jsonify(
                error="User account does not exist"
            )
        
        stocks = StockModel.query.filter_by(account=account).all()
        stock_list = []
        for stock in stocks:
            stock_list.append(get_stock_info(stock))
        return jsonify({
            'success': "Stocks retrieved",
            'stocks': stock_list
        })

@views.route('/buy', methods=["POST"])
@jwt_required()
def buy():
    if request.method == "POST":
        symbol = request.json["symbol"]
        shares = request.json["shares"]
        acct_id = request.json["acct_id"]

        account = AccountModel.query.filter_by(id=acct_id).first()
        if account == None:
            return jsonify(
                error="Account does not exist"
            )
        
        account.balance = account.balance - decimal.Decimal(get_stock_value(symbol, shares))
        db.session.commit()

        exists = StockModel.query.join(StockModel.account).filter(AccountModel.id==acct_id, StockModel.symbol==symbol).first()
        if exists != None:
            exists.shares = exists.shares + shares
            db.session.commit()
            return jsonify(
                success="Stock shares increased and saved"
            )
        stock = StockModel(symbol=symbol, shares=shares, account=account)
        db.session.add(stock)
        db.session.commit()

        return jsonify(
            success="Added stock to database"
        )

@views.route('/sell', methods=["POST"])
@jwt_required()
def sell():
    if request.method == "POST":
        symbol = request.json["symbol"]
        shares = request.json["shares"]
        acct_id = request.json["acct_id"]

        account = AccountModel.query.filter_by(id=acct_id).first()
        if account == None:
            return jsonify(
                error="Account does not exist"
            )

        account.balance = account.balance + decimal.Decimal(get_stock_value(symbol, shares))        
        exists = StockModel.query.join(StockModel.account).filter(AccountModel.id==acct_id, StockModel.symbol==symbol).first()

        if exists == None:
            return jsonify(
                error="User does not own any stock with symbol: " + symbol
            )
        
        if exists.shares > shares:
            exists.shares = exists.shares - shares
            db.session.commit()
            return jsonify(
                success="Stock shares sold"
            )
        db.session.delete(exists)
        db.session.commit()
        return jsonify(
            success="All shares sold"
        )

def get_stock_value(symbol, shares):
    r = requests.get(url + symbol + '/quote?token=' + token)
    return r.json()['latestPrice'] * shares

def get_stock_info(stock):
    r = requests.get(url + stock.symbol + '/quote?token=' + token)
    increase = r.json()['latestPrice'] - r.json()['previousClose'] > 0
    return {
        'symbol': stock.symbol,
        'name': r.json()['companyName'],
        'price': r.json()['latestPrice'],
        'shares': stock.shares,
        'value': get_stock_value(stock.symbol, stock.shares),
        'increase': increase
    }

