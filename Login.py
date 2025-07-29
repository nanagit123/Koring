from flask import Blueprint, render_template, request, redirect, url_for,session
from werkzeug.security import generate_password_hash, check_password_hash

login_bp = Blueprint('login', __name__)

users={} #임시저장소, db 연결할 부분

@login_bp.route('/')
def home():
    if 'email' in session:
        return f"Hello, {session['email']}! <a href='/logout'>Logout</a> "
    return "Hello, Koring! <a href='/login'>Login</a> or <a href='/register'>Register</a>"
    
@login_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        if email in users:
            return "Email already registered. Please use another email."
        
        users[email] = generate_password_hash(password)
        return redirect(url_for('login.login'))
    return render_template('register.html')

@login_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        hashed_password = users.get(email)
        if hashed_password and check_password_hash(hashed_password, password):
            session['email'] = email
            return redirect(url_for('login.home'))
        return "Invalid credentials. Please try again."
    return render_template('login.html')

@login_bp.route('/logout')
def logout():
    session.pop('email', None)
    return redirect(url_for('login.home'))
      