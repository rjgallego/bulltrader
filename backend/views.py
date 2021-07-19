from flask import Blueprint, request, jsonify
from backend import db
from flask_jwt_extended import jwt_required
from .models import StockModel, AccountModel, UserModel
import requests
import os
import decimal
import json

views = Blueprint('views', __name__)
url = os.environ.get('IEX_URL')
token =  os.environ.get('IEX_TOKEN')

@views.route('/stocks/<user_id>', methods=["GET"])
@jwt_required()
def get_stocks(user_id=0):
    if request.method == "GET":
        user = UserModel.query.filter_by(id=user_id).first()
        account = AccountModel.query.filter_by(user_id=user_id).first()
        if account == None:
            return jsonify(
                error="User account does not exist"
            )
        
        stocks = StockModel.query.filter_by(account=account).all()
        stock_list = []
        total = 0
        for stock in stocks:
            stock_info = get_stock_info(stock)
            stock_list.append(stock_info)
            total = total + stock_info['value']
        return jsonify({
            'id': user_id,
            'firstName': user.firstname,
            'balance': str(account.balance),
            'stocks': stocks,
            'value': total,
            'stocks': stock_list
        })

def get_stock_info(stock):
    r = requests.get(url + '/stock/' + stock.symbol + '/quote?token=' + token)
    increase = r.json()['latestPrice'] - r.json()['previousClose'] > 0
    return {
        'symbol': stock.symbol,
        'name': r.json()['companyName'],
        'price': r.json()['latestPrice'],
        'shares': stock.shares,
        'value': get_stock_value(stock.symbol, stock.shares),
        'increase': increase
    }

@views.route('/buy', methods=["POST"])
@jwt_required()
def buy():
    if request.method == "POST":
        symbol = request.json["symbol"]
        shares = request.json["shares"]
        user_id = request.json["user_id"]

        account = AccountModel.query.filter_by(user_id=user_id).first()
        if account == None:
            return jsonify(
                error="Account does not exist"
            )
        
        account.balance = account.balance - decimal.Decimal(get_stock_value(symbol, shares))
        db.session.commit()

        exists = StockModel.query.join(StockModel.account).filter(AccountModel.id==account.id, StockModel.symbol==symbol).first()
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
        user_id = request.json["user_id"]

        account = AccountModel.query.filter_by(user_id=user_id).first()
        if account == None:
            return jsonify(
                error="Account does not exist"
            )

        account.balance = account.balance + decimal.Decimal(get_stock_value(symbol, shares))        
        exists = StockModel.query.join(StockModel.account).filter(AccountModel.id==account.id, StockModel.symbol==symbol).first()

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

@views.route('/search/<search>', methods=["GET"])
@jwt_required()
def search(search=""):
    if request.method == 'GET':
        r = requests.get(url + '/search/' + search + '?token=' + token)
        return jsonify(
            search_results=r.json()
        )

@views.route('/stock/<symbol>', methods=["GET"])
@jwt_required()
def get_stock(symbol=""):
    if request.method == 'GET':
        r = requests.get(url + '/stock/' + symbol + '/quote?token=' + token)
        return jsonify(
            stock_info=r.json()
        )


def get_stock_value(symbol, shares):
    r = requests.get(url + '/stock/' + symbol + '/quote?token=' + token)
    return r.json()['latestPrice'] * shares

@views.route('/stock/<symbol>/history', methods=['GET'])
@jwt_required()
def get_stock_history(symbol=""):
    if request.method == 'GET':
        r = requests.get(url + '/stock/' + symbol + '/chart/6m?token=' + token)
        result = json.loads(r.text)
        stock_history = []
        for stock in result:
            stock_history.append({
                'date': stock['date'],
                'price': stock['close']
            })
        return jsonify({
            'stock_history': stock_history
        })