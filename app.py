from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import datetime
import os

app = Flask(__name__)
app.secret_key = 'your_secret_key'

# =========================
# Jinja 전역 헬퍼 주입 (가장 먼저)
# =========================
def has_endpoint(name: str) -> bool:
    # app.view_functions 에 등록된 엔드포인트 이름 존재 여부
    return name in app.view_functions

app.jinja_env.globals.update(has_endpoint=has_endpoint)

# =========================
# 업로드 폴더/허용 확장자
# =========================
UPLOAD_FOLDER = os.path.join('static', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# 임시 사용자 저장소 (메모리)
users = {}

def allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# =========================
# 홈/메인/커뮤니티
# =========================
@app.route('/')   # base.html에서 url_for('home')로 와도 OK
def home():
    # dev 파라미터 유지하며 mainpage로 리다이렉트
    return redirect(url_for('mainpage', dev=request.args.get('dev')))

@app.route('/mainpage')
def mainpage():
    notices = [
        {"title": "환영합니다! 코링 오픈", "url": url_for('index')},
        {"title": "8월 업데이트 안내", "url": url_for('index')},
    ]
    posts = [
        {"title": "처음 오신 분 환영해요", "url": url_for('index')},
        {"title": "서울명소 추천 부탁드려요", "url": url_for('index')},
        {"title": "사진 촬영 꿀팁 모음", "url": url_for('index')},
    ]
    return render_template('mainpage.html', notices=notices, posts=posts)

# 커뮤니티 목록
@app.route('/index')
def index():
    # 필요하면 posts 데이터 전달
    return render_template('index.html')

@app.route('/index/new', methods=['GET', 'POST'])
def post_new():
    if request.method == 'POST':
        title = request.form.get('title', '').strip()
        body  = request.form.get('body', '').strip()
        # images = request.files.getlist('images')  # 필요하면 저장 로직 추가
        # TODO: 저장 후 목록으로 이동
        return redirect(url_for('index'))
    return render_template('new.html')

# =========================
# 회원가입 / 로그인 / 로그아웃
# =========================
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    error = None
    if request.method == 'POST':
        email = request.form.get('email', '').strip()
        user_id = request.form.get('user_id', '').strip()
        password = request.form.get('password', '')

        if not email or not user_id or not password:
            error = "모든 필드를 입력해 주세요."
        elif email in users:
            error = "이미 등록된 이메일입니다."
        else:
            users[email] = {
                'user_id': user_id,
                'password_hash': generate_password_hash(password)
            }
            return redirect(url_for('login'))

    return render_template('signup.html', error=error)

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        email = request.form.get('email', '').strip()
        password = request.form.get('password', '')

        user = users.get(email)
        if user and check_password_hash(user['password_hash'], password):
            session['email'] = email
            # 로그인 후 메인페이지로
            return redirect(url_for('mainpage'))
        else:
            error = "입력 정보가 잘못되었습니다."

    return render_template('login.html', error=error)

@app.route('/logout')
def logout():
    session.pop('email', None)
    # 로그아웃 후 메인페이지로
    return redirect(url_for('mainpage'))

# =========================
# 관광지 페이지
# =========================
@app.route('/bukchon')
def bukchon():
    return render_template('landmarks/bukchon.html')

@app.route('/gyeongbokgung')
def gyeongbokgung():
    return render_template('landmarks/gyeongbokgung.html')

@app.route('/namsan')
def namsan():
    return render_template('landmarks/namsan.html')

@app.route('/yisunshin')
def yisunshin():
    return render_template('landmarks/yisunshin.html')

# =========================
# 카메라
# =========================
@app.route('/camera')
def camera():
    return render_template('camera.html')

# =========================
# 예약
# =========================
@app.route('/reservation')
def reservation():
    return render_template('reservation.html')

@app.route('/reserve/gyeongbok')
def reserve_gyeongbok():
    return "경복궁 해설 예약 페이지"

@app.route('/reserve/changdeok')
def reserve_changdeok():
    return "창덕궁 달빛기행 예약 페이지"

# =========================
# 앨범
# =========================
@app.route('/album')
def album():
    photos = []
    try:
        if os.path.exists(UPLOAD_FOLDER):
            for filename in os.listdir(UPLOAD_FOLDER):
                if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
                    photos.append({
                        "url": url_for('static', filename=f'uploads/{filename}'),
                        "date": datetime.now().strftime('%Y.%m.%d'),
                        "location": "seoul",
                    })
        # (선택) 최신순 정렬
        # photos.sort(key=lambda x: x["url"], reverse=True)
    except Exception as e:
        print("[album] error:", e)

    return render_template('album.html', photos=photos)

# =========================
# 선호도(Place) / 길찾기(Map)
# =========================
@app.route('/place', endpoint='place')
def place_page():
    return render_template('place.html')

@app.route('/map', endpoint='map')
def map_page():
    return render_template('map.html')

# =========================
# 이미지 업로드 API
# =========================
@app.route('/upload_image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400

    file = request.files['image']
    if not file or file.filename == '':
        return jsonify({"error": "Empty filename"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type"}), 400

    filename = secure_filename(file.filename)
    save_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(save_path)

    image_url = url_for('static', filename=f'uploads/{filename}')
    return jsonify({"url": image_url}), 200

# =========================
# 실행
# =========================
if __name__ == '__main__':
    # 등록된 라우트 확인용(원치 않으면 주석 처리)
    print("== Registered routes ==")
    for rule in app.url_map.iter_rules():
        print(f"{rule} -> {rule.endpoint}")
    app.run(debug=True)
