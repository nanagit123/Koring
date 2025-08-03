import os
import requests
from flask import Blueprint, render_template, request, jsonify
from Config import Config

map_bp = Blueprint('map', __name__)

#카카오 맵 API 키 설정
KAKAO_REST_API_KEY =Config.KAKAO_REST_API_KEY

@map_bp.route('/map')
def map_page():
    #프론트 연동
    return render_template('map.html')

@map_bp.route('/api/search', methods=['POST'])
def search_places():
    try:
        data = request.get_json()
        query = data.get('query', '')

        if not query:
            return jsonify({'success': False, 'message': '검색어를 입력해주세요.'})

        url = f'https://dapi.kakao.com/v2/local/search/keyword.json'
        headers = {
            'Authorization': f'KakaoAK {KAKAO_REST_API_KEY}'
        }
        params = {
            'query': query,
            'size': 10  # 검색 결과 개수 제한
        }

        response = requests.get(url, headers=headers, params=params)

        if response.status_code == 200:
            places = response.json()
            places = places.get('documents', [])
            return jsonify({
                'success': True,
                  'places': places,
                  'total_count': result.get('meta', {}).get('total_count', 0)})
        else:
            return jsonify({'success': False,
                'message': f'검색에 실패했습니다. (상태코드: {response.status_code})'})
        
    except Exception as e:
        print(f"검색 오류: {e}") 
        return jsonify({'success': False, 'message': '서버 오류가 발생했습니다.'}) 
    
@map_bp.route('/api/search-address', methods=['POST'])
def search_address():
    try:
        data = request.get_json()
        query = data.get('query', '')

        if not query:
            return jsonify({'success': False, 'message': '주소를 입력해주세요.'})

        url = f'https://dapi.kakao.com/v2/local/search/address.json?query={query}'
        headers = {
            'Authorization': f'KakaoAK {KAKAO_REST_API_KEY}'
        }

        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            addresses = response.json().get('documents', [])
            return jsonify({'success': True, 'addresses': addresses})
        else:
            return jsonify({'success': False, 'message': '주소 검색에 실패했습니다.'})
        
    except Exception as e:
        return jsonify({'success': False, 'message': '서버 오류가 발생했습니다.'})
    
@map_bp.route('/api/get-map', methods=['POST'])
def get_map():
    try:
        data = request.get_json()
        latitude = data.get('latitude')
        longitude = data.get('longitude')

        if not latitude or not longitude:
            return jsonify({'success': False, 'message': '위도와 경도를 입력해주세요.'})

        try:
            lat = float(latitude)
            lng = float(longitude)

            if not (33<=lat<=38 and 124<= lng <=132):
                return jsonify({'success': False, 'message': '위도와 경도가 유효하지 않습니다.'})
        except ValueError:
            return jsonify({'success': False, 'message': '위도와 경도는 숫자여야 합니다.'})
        
        map_url = f'https://map.kakao.com/link/map/{latitude},{longitude}'
        return jsonify({'success': True, 'map_url': map_url})
    
    except Exception as e:
        print(f"맵 URL 생성 오류: {e}")
        return jsonify({'success': False, 'message': '서버 오류가 발생했습니다.'})
    
@map_bp.errorhandler(404)
def not_found_error(error):
    return jsonify({'success': False, 'message': '페이지를 찾을 수 없습니다.'}), 404

@map_bp.errorhandler(500)
def internal_error(error):
    return jsonify({'success': False, 'message': '서버 오류가 발생했습니다.'}), 500