from flask import Blueprint, request, jsonify
import random

restaurant_bp = Blueprint('restaurant', __name__)

# 임시 데이터베이스
restaurant_db = [
    {"name":"칸다소바 경복궁점","tags":["일식","혼밥","면"]},
    {"name":"진심","tags":["일식","분위기좋은","밥"]},
    {"name":"체부동 수제비와 보리밥","tags":["한식","한국적"]},
    {"name":"도마 유즈라멘","tags":["일식","분위기좋은","면"]}]

@restaurant_bp.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    selected_tags = data.get('tags', [])

# 필터링 로직: 선택된 태그가 포함된 레스토랑 추천
    recommendations = [
        r for r in restaurant_db if any(tag in r['tags'] for tag in selected_tags)
    ]
    # 무작위로 하나의 추천 레스토랑 선택
    result = random.sample(recommendations, min(1, len(recommendations))) if recommendations else []

    return jsonify(result)