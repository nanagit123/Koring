import os
from flask import Flask
from flask_cors import CORS
from config import Config

from login import login_bp
from Mainpage import main_bp
from community import community_bp
from restaurant import restaurant_bp

# Flask 앱 초기화
app = Flask(__name__)
app.secret_key = Config.SECRET_KEY
app.config['DB_CONFIG'] = Config.DB_CONFIG

# CORS 설정
CORS(app, supports_credentials=True, origins=Config.CORS_ORIGINS)

# Blueprint 등록
app.register_blueprint(login_bp)
app.register_blueprint(main_bp)
app.register_blueprint(community_bp)
app.register_blueprint(restaurant_bp, url_prefix='/restaurant')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
