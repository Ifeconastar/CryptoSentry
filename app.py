from flask import Flask, render_template, request, redirect, url_for, flash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from pymongo.errors import DuplicateKeyError
from pymongo import MongoClient
from flask_user import UserMixin
import uuid
from decouple import config

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost:27017/cryptoSentry'
app.config['SECRET_KEY'] = config('SECRET_KEY')
mongo = PyMongo(app)
bcrypt = Bcrypt(app)


# Initialize Flask-Login
login_manager = LoginManager()
login_manager.login_view = 'login'  # Set the login view function
login_manager.init_app(app)

class User(UserMixin):
    # Add other fields as needed (e.g., username, email, password_hash)

    def generate_user_id(self):
        return str(uuid.uuid4())

    def create_user(self, username, password, email):
        # Hash the password before storing it in the database
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        # Generate a unique user_id using UUID
        user_id = self.generate_user_id()

        # Create a user document with user_id
        user_data = {
            'user_id': user_id,
            'username': username,
            'password': hashed_password,
            'email': email
        }


       # Insert the user document into the "users" collection
        try:
            self.objects.create(**user_data)
            return True
        except DuplicateKeyError:
            return False


@login_manager.user_loader
def load_user(user_id):
    return User.objects.get(user_id=user_id)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        user_data = User.objects(username=username).first()

        if user_data and bcrypt.check_password_hash(user_data['password'], password):
            user_id = user_data['user_id']
            user = User(user_id)
            login_user(user)
            flash('Login successful!', 'success')
            return redirect(url_for('portfolio'))
        else:
        flash('Login failed. Please check your credentials and try again.', 'danger')

    return render_template('login.html')

@app.route('/addAsset', methods=['POST'])
@login_required
def addAsset():
    if request.method == 'POST':
        serialNumber = request.form['serialNumber']  # Get the Serial Number from the form
        name = request.form['name']
        symbol = request.form['symbol']
        purchase_price = float(request.form['purchase_price'])
        total_value = float(request.form['total_value'])
        user_id = current_user.user_id
        net_worth = float(request.form['net-worth'])  # Get the net worth from the form

        # Create a portfolio document with the provided Serial Number
        portfolio_data = {
            'serialNumber': serialNumber,
            'name': name,
            'symbol': symbol,
            'purchase_price': purchase_price,
            'total_value': total_value,
            'user_id': user_id
        }

        # Insert the portfolio document into the "portfolios" collection
        mongo.db.portfolios.insert_one(portfolio_data)

        # Create a net worth document for the user
        net_worth_data = {
            'user_id': user_id,
            'net_worth': net_worth
        }

        # Insert the net worth document into the "net-worth" collection
        mongo.db.networth.insert_one(net_worth_data)

        flash('Asset added to your portfolio!', 'success')
    # Redirect back to the same page after adding the asset
    return redirect(url_for('portfolio'))

@app.route('/editAsset', methods=['POST'])
@login_required
def editAsset():
    if request.method == 'POST':
        serialNumber = request.form['serialNumber']  # Get the Serial Number from the form
        edit_name = request.form['edit-name']
        edit_symbol = request.form['edit-symbol']
        edit_purchase_price = float(request.form['edit-purchase-price'])
        edit_total_value = float(request.form['edit-total-value'])
        user_id = current_user.user_id
        net_worth = float(request.form['net-worth'])  # Get the net worth from the form

        # Update the portfolio data in the database with the matching serialNumber
        mongo.db.portfolios.update_one(
            {'serialNumber': serialNumber, 'user_id': user_id},
            {'$set': {
                'name': edit_name,
                'symbol': edit_symbol,
                'purchase_price': edit_purchase_price,
                'total_value': edit_total_value
            }}
        )

        # Update the net worth data in the database
        mongo.db.networth.update_one(
            {'user_id': user_id},
            {'$set': {
                'net_worth': net_worth
            }}
        )

        flash('Asset updated!', 'success')
    # Redirect back to the same page after editing the asset
    return redirect(url_for('portfolio'))

@app.route('/removeAsset/<int:serialNumber>', methods=['POST'])
@login_required
def removeAsset(serialNumber):
    user_id = current_user.user_id

    # Get the net worth from the form data
    net_worth = float(request.form['net-worth'])

    # Remove the portfolio data with the matching serialNumber and user_id
    result = mongo.db.portfolios.delete_one({'serialNumber': serialNumber, 'user_id': user_id})

    if result.deleted_count == 1:
        flash('Asset removed from your portfolio!', 'success')

        # Update the net worth data in the database
        mongo.db.networth.update_one(
            {'user_id': user_id},
            {'$set': {
                'net_worth': net_worth
            }}
        )
    else:
        flash('Asset not found or permission denied.', 'danger')

    # Redirect back to the same page after removing the asset
    return redirect(url_for('portfolio'))
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']

        # Check if the username already exists in the database
        if mongo.db.users.find_one({'username': username}):
            flash('Username already exists. Please choose a different username.', 'danger')
            return redirect(url_for('register'))

        # Check if the email already exists in the database
        if mongo.db.users.find_one({'email': email}):
            flash('Email already exists. Please choose a different email.', 'danger')
            return redirect(url_for('register'))

        user = User()

        if user.create_user(username, password, email):
            flash('Registration successful! You can now log in.', 'success')
            return redirect(url_for('login'))
        else:
            flash('Registration failed. Please try again.', 'danger')
            return redirect(url_for('register'))

    # Render the register.html template for GET requests
    return render_template('register.html')

# Define the route to render landing.html
@app.route('/')
def landing():
    return render_template('landing.html')

# Define the route to render 404.html
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

# Define the route to render about_us.html
@app.route('/about_us')
def about_us():
    return render_template('about_us.html')

# Define the route to render exchange.html (protected route)
@app.route('/exchange')
@login_required
def exchange():
    return render_template('exchange.html')

# Define the route to render learning_hub.html (protected route)
@app.route('/learning_hub')
@login_required
def learning_hub():
    return render_template('learning_hub.html')

# Define the route to render portfolio.html (protected route)
@app.route('/portfolio')
@login_required
def portfolio():
    return render_template('portfolio.html')


if __name__ == '__main__':
    app.run(debug=True)


