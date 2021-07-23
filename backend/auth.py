from flask import Blueprint, request, jsonify, make_response
from werkzeug.security import generate_password_hash, check_password_hash
from .models import UserModel, AccountModel
from backend import db
from flask_jwt_extended import create_access_token, jwt_required

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        email = request.json['email']
        password = request.json['password']
        user = UserModel.query.filter_by(email=email).first()
        if user:
            return login(user, password)
        return make_response(jsonify({
            "error": "Email does not exist"
        }), 404)

@auth.route('/register', methods=['POST'])
def register():
    if request.method == 'POST':
        firstname = request.json['firstName']
        lastname = request.json['lastName']
        email = request.json['email']
        password = request.json['password']

        if UserModel.query.filter_by(email=email).first() != None:
            return make_response(jsonify({
                'error': 'Account with that email already exists'
            }), 400)

        hash = generate_password_hash(password, method='sha256')
        user = UserModel(firstname=firstname, lastname=lastname, email=email, hash=hash)
        account = AccountModel(user=user, balance=100000.00)
        
        db.session.add(user)
        db.session.add(account)
        db.session.commit()

        return jsonify(
            success="User added to database"
        )

@auth.route('/delete-user', methods=['POST'])
def delete_user():
    if request.method == 'POST':
        email = request.json['email']
        user = UserModel.query.filter_by(email=email).first()
        if user == None:
            return make_response(jsonify({
                "error": "Email does not exist"
            }), 404)
        
        db.session.delete(user)
        db.session.commit()
        return jsonify(
            success="User deleted from database"
        )

def login(user, password):
    if check_password_hash(user.hash, password):
        account = AccountModel.query.filter_by(user_id=user.id).first()
        stocks=[]
        return jsonify(
            token=create_access_token(identity=user.id)
        )
    return make_response(jsonify({
        "error": "Invalid password"
    }), 403)