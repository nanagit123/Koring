import pymysql
from flask import Blueprint, render_template, request, redirect, url_for,session
from werkzeug.security import generate_password_hash, check_password_hash

login_bp = Blueprint('login', __name__)

DB_CONFIG = {
    'host': '3307',
    'user': 'test1234',
    'password': '1234',
    'database': 'KoringDB',
    'charset': 'utf8'
}

def get_db_connection():
    return pymysql.connect(**DB_CONFIG)

def create_user(login_id, password, name, email):
    conn = get_db_connection()
    cursor = conn.cursor()
    hashed_password = generate_password_hash(password)

    try:
        cursor.execute(
            "INSERT INTO tUser (userLoginID, userPW, userName, userMail) VALUES (%s, %s, %s, %s)",
            (login_id, hashed_password, name, email)
        )
        conn.commit()
        return True
    except pymysql.IntegrityError as e:
        return False #이미 존재하는 로그인 ID
    finally:
        cursor.close()
        conn.close()

def get_user(login_id):
    conn = get_db_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    try:
        cursor.execute("SELECT * FROM tUser WHERE userLoginID = %s", (login_id,))
        user = cursor.fetchone()
        return user
    finally:
        cursor.close()
        conn.close()

@login_bp.route('/')
def home():
    if 'email' in session:
        return f"Hello, {session['email']}! <a href='/logout'>Logout</a> "
    return render_template('login.html')
    
@login_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        if email in users:
            return "Email already registered. Please use another email."
        
        users[email] = generate_password_hash(password)
        return redirect(url_for('login.login'))
    return render_template('signup.html')

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

@login_bp.route('/api/register', methods=['POST'])
def api_register():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'success':False, 'message': '이메일과 비밀번호를 모두 입력해주세요.'})
        
        if email in users:
            return jsonify({'success':False, 'message': '이미 등록된 이메일입니다.'})

        users[email] = generate_password_hash(password)
        return jsonify({'success':True, 'message': '회원가입이 완료되었습니다.'})
 
    except Exception as e:
        return jsonify({'success':False, 'message': '서버 오류가 발생했습니다.'})

@login_bp.route('/api/login', methods=['POST'])
def api_login(): 
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({'success':False, 'message': '아이디와 비밀번호를 모두 입력해주세요.'})
        
        hashed_password = users.get(username)
        if hashed_password and check_password_hash(hashed_password, password):
            session['username'] = username
            return jsonify({'success':True, 'message': '로그인 성공'})
        else:
            return jsonify({'success':False, 'message': '아이디 또는 비밀번호가 잘못되었습니다.'})
    except Exception as e:
        return jsonify({'success':False, 'message': '서버 오류가 발생했습니다.'})
    
@login_bp.route('/api/logout', methods=['POST'])
def api_logout():
    session.pop('email', None)
    return jsonify({'success':True, 'message': '로그아웃 되었습니다.'})

@login_bp.route('/api/check-auth', methods=['GET'])
def api_check_auth():
    if 'email' in session:
        return jsonify({'success':True, 'email': session['email']})
    return jsonify({'authenticated':False})