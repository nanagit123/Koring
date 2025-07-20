from flask import Flask, render_template, request, redirect, url_for,session
koring = Flask(__name__)
koring.secret_key = 'your_secret_key'

users={}

@koring.route('/')
def home():
    if 'email' in session:
        return f"Hello, {session['email']}! <a href='/logout'>Logout</a> "
    return "Hello, Koring! <a href='/login'>Login</a> or <a href='/register'>Register</a>"\
    
@koring.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        if email in users:
            return "Email already registered. Please use another email."
        
        users[email] = password
        return redirect(url_for('login'))
    
    return render_template('register.html')
@koring.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        if email in users and users[email] == password:
            session['email'] = email
            return redirect(url_for('home'))
        return "Invalid credentials. Please try again."
    return render_template('login.html')

@koring.route('/logout')
def logout():
    session.pop('email', None)
    return redirect(url_for('home'))
      