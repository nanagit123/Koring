import pymysql
from flask import Blueprint, request, jsonify, session, current_app
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

login_bp = Blueprint('login', __name__, url_prefix='/api/login')
CORS(login_bp, supports_credentials=True)  # 세션 유지용 CORS

# DB 연결
def get_connection():
    return pymysql.connect(**current_app.config['DB_CONFIG'])

#회원가입
@login_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    userLoginID = data.get('userLoginID')
    password = data.get('userPW')
    userMail = data.get('userMail')
    userAgeGroup = data.get('userAgeGroup')
    userFoodPref = data.get('userFoodPref')
    userNationality = data.get('userNationality')

    if not (userLoginID and password and userMail):
        return jsonify({'success': False, 'message': '필수 정보를 모두 입력해주세요.'}), 400

    hashed_pw = generate_password_hash(password)

    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            sql = """
            INSERT INTO tuser(userLoginID, userPW, userMail, userAgeGroup, userFoodPref, userNationality)
            VALUES (%s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (userLoginID, hashed_pw, userMail, userAgeGroup, userFoodPref, userNationality))
        conn.commit()
        return jsonify({'success': True, 'message': '회원가입 성공'})
    except pymysql.err.IntegrityError:
        return jsonify({'success': False, 'message': '이미 존재하는 ID입니다.'}), 409
    finally:
        conn.close()

#로그인
@login_bp.route('', methods=['POST'])
@login_bp.route('/', methods=['POST'])
def login():
    data = request.json
    userLoginID = data.get('userLoginID')
    password = data.get('userPW')

    if not (userLoginID and password):
        return jsonify({'success': False, 'message': '아이디와 비밀번호를 모두 입력해주세요.'}), 400

    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM tuser WHERE userLoginID=%s", (userLoginID,))
            user = cursor.fetchone()

        if user and check_password_hash(user['userPW'], password):
            # 세션에 사용자 정보 저장
            session['userID'] = user['userID']
            session['userLoginID'] = user['userLoginID']
            return jsonify({'success': True, 'message': '로그인 성공'})
        else:
            return jsonify({'success': False, 'message': '아이디 또는 비밀번호가 올바르지 않습니다.'}), 401
    finally:
        conn.close()

#로그아웃
@login_bp.route('/logout', methods=['POST'])
def logout():
    session.pop('userID', None)
    session.pop('userLoginID', None)
    return jsonify({'success': True, 'message': '로그아웃 성공'})

#로그인 상태 확인
@login_bp.route('/check-auth', methods=['GET'])
def check_auth():
    if 'userID' in session:
        return jsonify({
            'authenticated': True,
            'userID': session['userID'],
            'userLoginID': session['userLoginID']
        })
    return jsonify({'authenticated': False})
