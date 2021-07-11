from flask import Flask, render_template, send_from_directory, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

from dotenv import load_dotenv
import os
from os.path import join, dirname

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

app = Flask(__name__, static_folder='../client/build', static_url_path='/')
app.config['IEX_TOKEN'] = os.environ.get('IEX_TOKEN')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_SECRET')    

db = SQLAlchemy(app)

from .auth import auth
from .views import views

jwt = JWTManager(app)

app.register_blueprint(auth, url_prefix='/api')
app.register_blueprint(views, url_prefix='/api')

@app.route('/')
def home_page():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/dashboard')
def dashboard_page():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/register')
def register_page():
    return send_from_directory(app.static_folder, 'index.html')