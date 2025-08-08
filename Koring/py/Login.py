import pymysql
from flask import Blueprint, render_template, request, redirect, url_for,session, jsonify
from werkzeug.security import generate_password_hash, check_password_hash

login_bp = Blueprint('login', __name__)

DB_CONFIG = {
    'host': '192.168.219.112',
    'port':3307,
    'user': 'apiuser',
    'password': 'B0Koring!',
    'database': 'Koring',
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
        print(f"DB Error: {e}")
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
    if 'username' in session:
        return f"Hello, {session['userName']}! <a href='/logout'>Logout</a> "
    return render_template('login.html')
    
@login_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        login_id = request.form.get('login_id')
        password = request.form.get('password')
        name = request.form.get('name','Unknown')
        email = request.form.get('email','')

        if create_user(login_id, password, name, email):
            return redirect(url_for('login.login'))
        else:
            return "이미 존재하는 로그인 ID입니다. 다른 ID를 사용해주세요."
        
    return render_template('signup.html')

@login_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        user = get_user(username)
        if user and check_password_hash(user['userPW'], password):
            session['username'] = user['userLoginID']
            session['userName'] = user['userName']
            return redirect(url_for('login.home'))
        else:
            return "아이디 또는 비밀번호가 잘못되었습니다."
        
    return render_template('login.html')
           
@login_bp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login.home'))

@login_bp.route('/api/login', methods=['POST'])
def api_login(): 
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({'success':False, 'message': '아이디와 비밀번호를 모두 입력해주세요.'})
        user = get_user(username)
        if user and check_password_hash(user['userPW'], password):
            session['username'] = user['userLoginID']
            session['userName'] = user['userName']
            return jsonify({
             'success':True, 'message': '로그인 성공',
             'user':{
                 'username': user['userLoginID'],
                    'name': user['userName'],
                    'email': user['userMail']
             }
        })
        else:
            return jsonify({'success':False, 'message': '아이디 또는 비밀번호가 잘못되었습니다.'})
    
    except Exception as e:
        print(f"로그인 오류: {e}")
        return jsonify({'success':False, 'message': '서버 오류가 발생했습니다.'})

@login_bp.route('/api/register', methods=['POST'])
def api_register():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        name = data.get('name', username)
        email = data.get('email', '')

        if not username or not password:
            return jsonify({'success':False, 'message': '이메일과 비밀번호를 모두 입력해주세요.'})
        
        if create_user(username, password, name, email):
            return jsonify({'success':True, 'message': '회원가입 성공'})
        else:
            return jsonify({'success':False, 'message': '이미 존재하는 로그인 ID입니다. 다른 ID를 사용해주세요.'})
    
    except Exception as e:
        print(f"회원가입 오류: {e}")
        return jsonify({'success':False, 'message': '서버 오류가 발생했습니다.'})


@login_bp.route('/api/logout', methods=['POST'])
def api_logout():
    session.clear()
    return jsonify({'success':True, 'message': '로그아웃 되었습니다.'})

@login_bp.route('/api/check-auth', methods=['GET'])
def api_check_auth():
    if 'username' in session:
        user = get_user(session['username'])
        if user:
            return jsonify({
                'authenticated': True, 
                'user': {
                    'username': user['userLoginID'],
                    'name': user['userName'],
                    'email': user['userMail']
                }
            })
    
    return jsonify({'authenticated': False})