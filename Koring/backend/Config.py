import os

#API키를 환경변수로 관리
class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'your_secret4')
    KAKAO_REST_API_KEY = os.environ.get('KAKAO_REST_API_KEY', 'your_kakao_api_key')
    KAKAO_JAVASCRIPT_KEY = os.environ.get('KAKAO_JAVASCRIPT_KEY', 'your_kakao_javascript_key')