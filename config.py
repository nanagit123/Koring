import os
import pymysql

class Config:
    # API 키
    REST_API_KEY = os.environ.get('REST_API_KEY', 'your_kakao_api_key')
    JAVASCRIPT_KEY = os.environ.get('JAVASCRIPT_KEY', '나중추가')

    # 데이터베이스
    DB_CONFIG = {
        'host': os.environ.get('DB_HOST', '192.168.219.112'),
        'port': int(os.environ.get('DB_PORT', 3307)),
        'user': os.environ.get('DB_USER', 'apiuser'),
        'password': os.environ.get('DB_PASSWORD', 'B0Koring!'),
        'db': os.environ.get('DB_NAME', 'Koring'),
        'charset': 'utf8mb4',
        'cursorclass': pymysql.cursors.DictCursor
    }

    # CORS 허용 도메인
    CORS_ORIGINS = [
        os.environ.get('FRONTEND_ORIGIN', 'http://localhost:5000')
    ]

    # Flask 세션용 secret key
    SECRET_KEY = os.environ.get('SECRET_KEY', 'your_secret_key')
