# Bull Trader - A React + Flask Stock Trading Application
Bull Trader is a web application build with a React front-end and Flask back-end. The back-end is connected to a Postgres database that will store user information and send or retrieve a user's stock portfolio.

Try out the live version here: [Bull Trader Site](https://bulltrader-app.herokuapp.com/)

## About Bull Trader
Bull Trader is a stock trading application that supplies the user with an initial $100,000 balance that they can use to 'buy' and 'sell' any stocks within that budget. The application will track the user's portfolio balance throughout time, track the six month history of each stock the user owns, and manages the remaining balance based on the account's transactions.

This site has four pages: Login, Register, Dashboard, and Stock Summary

### Login Page
The Login page is the first page shown if the user is not currently logged in. It contains the login form where users can enter their existing email and password if they currently have an account, or a Register button where they can create a new account.

![](./screenshots/login.gif)

### Register Page
If a user doesn't already have an account, they can navigate to the registration page and sign up. Their personal information and encrypted password will be stored in a table, and a new account record associated with the user ID will automatically be created with the initial $100,000 balance. Any stocks that are bought by the user will be associated with this new user account. 

Once the registration form is submitted, the user will automatically be redirected back to the Login page so they can use their newly created account to log in.

![](./screenshots/register.gif)

### Dashboard Page
 The Dashboard is the home page for the currently signed-in user. It will display the list of stocks and their detailed currently owned by the user, the total value of the portfolio, remaining cash balance, and a summary chart outlining the percentage each stock takes up in the portfolio. The user has the option to sell each stock currently in their portfolio, or they can buy any new stock with their remaining balance.

![](./screenshots/dashboard.gif)

### Stock Summary Page
Each of the stock within the user's portfolio has it's own summary page, which displays more details about that specific stock, such as the current price, market cap, latest closing price, current exchange, etc. There is also a graph outlining the progression of the stock's price over the past six months. This page is meant to give the user more insight on the stocks they own, and may provide some insight to better manage the portfolio.

![](./screenshots/summary.gif)

## Tools + Technologies
### Front-End
The front-end of this project is built in React using create-react-app. Most of the components are created using the react-bootstrap package, and styling is also done using responsive Bootstrap classes as well as CSS. Bootstrap also provides the validation for the Login and Sign-up forms to confirm valid values have been entered before submitting.

The charts on the Dashboard and Stock Summary pages are created using Google Charts for react (react-google-charts), and available to provide a visual display of the data from the back-end.

Additional Resources:
- React-bootstrap: https://react-bootstrap.github.io/
- Bootstrap: https://getbootstrap.com/
- React Google Charts: https://react-google-charts.com/

### Back-End
#### Flask
The back-end for this site is created using Flask, a Python based framework for creating lightweight web servers. Flask is used to configure the server, which defines the route endpoints for handling the HTTP requests, establishes connection and communication with the Postgres database, and serves the React index.html file for the user interface. 

There are two main types of routes in this application: authentication and views. 

The authentication routes handle user login/logout, storing new account information, and password security. Password encryption is handled using Flask's built-in werkzeug.security class, which provides methods for hashing passwords and comparing password hashes for logging in. The login route also utilizes a Flask extension called flask_jwt_extended, which provides methods for creating JWT tokens that are returned to the front-end on successful login. 

The view endpoints handles interaction with the dashboard and menus, including buying or selling stock, opening a stock summary page, or logging out. These routes are protected as only a valid user should be able to buy and sell stocks with the cash allocated to their account. The previously mentioned flask_jwt_extended provides a jwt_required tag that is added to the routes to ensure that any HTTP requests coming from the front-end include that token in the request header for authentication.

Additional Resources: 
- Flask: https://flask.palletsprojects.com/en/2.0.x/
- Werkzeug: https://www.palletsprojects.com/p/werkzeug/
- Flask-JWT-Extended: https://flask-jwt-extended.readthedocs.io/en/stable/index.html

#### IEX Cloud
The Flask server also handles communication with IEX, an open source API available for building financial applications. All of the stock information (prices, stock symbols, etc) are pulled directly from IEX instead of storing locally in the database. IEX provides a /quote for pulling information based on the stock symbol, or you can use their /search endpoint to search for different stocks that match a search string, which is implemented to allow the user to search when buying a stock.

Additional Resources: 
- IEX Cloud: https://www.iexcloud.io/

#### Postgres
The database for this project is created using Postgres, and communicates with the back-end routes using the Flask extension flask_sqlalchemy. In the server configuration the database URI is defined as an environment variable which allows the server to connect. Once this is done, communication can be established with the database by using the SQLAlchemy models defined in the backend/models.py file, which defines the number and type of each column in the associated table (users, accounts, or stocks). From there the SQLAlchemy models contain a query function that are used to pull data from the specified table, including filters if needed. 

For development, a local database is used by installing Postgres locally and using the SQLAlchemy function create_all(), which will create the database tables and columns and their relationships based on the definitions in the backend/models.py file. From there the local URI is added to the .env file for the server to use. 

For production deployment, Heroku includes a Postgres add-on which will provide the associated application with a database and automatically create an environment variable with the database's URI information.

Additional Resources:
- Flask-SQLAlchemy: https://flask-sqlalchemy.palletsprojects.com/en/2.x/
- Postgres: https://www.postgresql.org/
- Heroku Postgres: https://devcenter.heroku.com/articles/heroku-postgresql

## Running Locally
To run this project locally, you need the following tools installed on your local machine: 
- Node: https://nodejs.org/en/download/
- Python: https://www.python.org/downloads/
- Pipenv: https://pipenv.pypa.io/en/latest/
- Postgres: https://www.postgresql.org/download/

The below instructions can be followed if you want to run this project locally for custom development or enhancements:

Setup locally
- Fork this repository to your Github account
- On your local computer, navigate to the folder you want to store the project: `cd PROJECT-FOLDER-NAME`
- Clone the forked repository locally: `git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY`

Start back-end
- Navigate to project client folder: `cd PROJECT-FOLDER-NAME/chat-app/client`
- Install React dependencies: `npm install`
- Navigate back to project root folder `cd ..`
- Open a pipenv shell: `pipenv shell`
- Install Flask dependencies: `pipenv install`
- Add .env file to the project's root folder
- Add variable DATABASE_URL and set it to the URI of your local database
    - The URI should have the following structure: `postgresql://[USERNAME]:[PASSWORD]@localhost/[DATABASE_NAME]
    - If you don't have a local database set up, here are some instructions to create one: https://phoenixnap.com/kb/postgres-create-database
- Add variable SECRET_KEY and set it to any random string
- Add variable JWT_SECRET and set it to any random string
- Add variable ENV and set it to 'dev' (without quotation marks)
- Create the required tables in the database
    - In a command line terminal, open a pipenv shell with the following command: pipenv shell
    - Open a Python terminal by entering the following command: 'python'
    - Add the following commands separately, hitting Enter between each command:
        >>> from backend import db
        >>> db.create_all()
    - Open PGAdmin tool and validate that tables have been created in your database
- From the root folder, start the application server: `python app.py`
- View* the local web application at http://localhost:5000/

* Note: the React front-end is served by the Flask server from the client/build folder, so in the case of any front-end updates React must be re-built in order to view the changes in the browser. This can be done from the client folder by running the following command: npm run build.

## Testing
There several unit tests written for testing the functionality of each of the routes defined in this project. These tests will validate that a user can be registered and login, can buy and sell stocks, can retrieve the stocks in their portfolio, and the backend connection to the IEX API can be established for pulling stock information. There are also tests for invalid requests, such as an incorrect password or trying to create a new account for an existing email. These unit tests can be very helpful during the development process to ensure existing functionality is not affected by recent changes.

Each of the test are written using Mocha / Chai and are stored in separate files under the client/test folder. Note that the development server must be started Chai will try to call each of the endpoints to ensure correct response. The server can be started with the below two commands run from the project's root folder:
    > pipenv shell
    > python app.py
In order to run the tests locally, open a separate terminal from the one running the server and enter the following commands:
    > cd client
    > npm run test
The output will be displayed in the terminal, and will display each test either with a 'Pass' status or will display an error if there is unexpected output.

![](./screenshots/tests.gif)

## Author
Rheanna Pena - [LinkedIn](https://www.linkedin.com/in/rheanna-pena-aa0007110/)
 