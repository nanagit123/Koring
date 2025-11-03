from flask import Blueprint, request, jsonify, render_template
import mysql.connector
from mysql.connector import Error

restaurant_bp = Blueprint('restaurant', __name__)

DB_CONFIG = {
    'host': '192.168.219.112',
    'port': 3307,
    'user': 'apiuser',
    'password': 'B0Koring!',
    'database': 'KoringDB',
    'charset': 'utf8'
}

USER_INPUT_TAGS = {
    'age': ['10대', '20대', '30대', '40대이상'],
    'cuisine': ['한식', '일식', '중식', '양식', '카페', '술집'],
    'nationality': ['한국', '일본', '중국', '미국'],
}

def get_db_connection():
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

def generate_matching_tags(user_input):
    matching_tags = {
        'cuisine_type': user_input.get('cuisine', []),
        'target_age': user_input.get('age', []),
        'nationality': user_input.get('nationality', [])
    }

    age_mood_mapping = {
        '10대': ['활기찬', '트렌디한'],
        '20대': ['트렌디한', '활기찬', '로맨틱'],
        '30대': ['고급스러운', '로맨틱', '조용한'],
        '40대이상': ['조용한', '고급스러운', '전통적인']
    }

    cuisine_mood_mapping = {
        '한식': ['전통적인', '캐주얼'],
        '일식': ['조용한', '깔끔한'],
        '중식': ['활기찬', '캐주얼'],
        '양식': ['고급스러운', '로맨틱'],
        '카페': ['트렌디한', '조용한'],
        '술집': ['활기찬', '캐주얼']
    }

    mood_tags = set()
    for age in matching_tags['target_age']:
        mood_tags.update(age_mood_mapping.get(age, []))
    for cuisine in matching_tags['cuisine_type']:
        mood_tags.update(cuisine_mood_mapping.get(cuisine, []))

    matching_tags['mood'] = list(mood_tags)
    return matching_tags

def search_restaurants_by_tags(matching_tags):
    connection = get_db_connection()
    if not connection:
        return []

    try:
        cursor = connection.cursor(dictionary=True)

        conditions = []
        params = []

        # 음식 종류 필터
        if matching_tags.get('cuisine_type'):
            cuisine_conditions = []
            for cuisine in matching_tags['cuisine_type']:
                cuisine_conditions.append("FIND_IN_SET(%s, restaurantTags)")
                params.append(cuisine)
            conditions.append(f"({' OR '.join(cuisine_conditions)})")

        # 연령대 필터
        if matching_tags.get('target_age'):
            age_conditions = []
            for age in matching_tags['target_age']:
                age_conditions.append("FIND_IN_SET(%s, restaurantTags)")
                params.append(age)
            conditions.append(f"({' OR '.join(age_conditions)})")

        # 국적 필터
        if matching_tags.get('nationality'):
            nationality_conditions = []
            for nat in matching_tags['nationality']:
                nationality_conditions.append("FIND_IN_SET(%s, restaurantTags)")
                params.append(nat)
            conditions.append(f"({' OR '.join(nationality_conditions)})")

        where_clause = ""
        if conditions:
            where_clause = "WHERE " + " AND ".join(conditions)

        # mood_score 계산: restaurantTags 안에 mood 태그 포함 여부로 점수 부여
        mood_score_expr = " + ".join([f"(FIND_IN_SET('{m}', restaurantTags) > 0)" for m in matching_tags.get('mood', [])])
        if mood_score_expr:
            mood_score_sql = f"({mood_score_expr})"
        else:
            mood_score_sql = "0"

        query = f"""
        SELECT *,
            {mood_score_sql} AS mood_score
        FROM tRestaurant
        {where_clause}
        ORDER BY mood_score DESC
        LIMIT 10
        """

        cursor.execute(query, params)
        restaurants = cursor.fetchall()
        return restaurants

    except Error as e:
        print(f"Error executing query: {e}")
        return []
    finally:
        cursor.close()
        connection.close()

@restaurant_bp.route('/recommend')
def recommend_page():
    return render_template('final_recommend.html', tags=USER_INPUT_TAGS)

@restaurant_bp.route('/api/recommend', methods=['POST'])
def api_recommend():
    try:
        user_input = request.get_json()
        print(f"사용자 입력: {user_input}")

        matching_tags = generate_matching_tags(user_input)
        print(f"생성된 매칭 태그: {matching_tags}")

        restaurants = search_restaurants_by_tags(matching_tags)
        print(f"검색된 식당 수: {len(restaurants)}")

        return jsonify({
            'success': True,
            'user_input': user_input,
            'matching_tags': matching_tags,
            'restaurants': restaurants,
            'count': len(restaurants)
        })

    except Exception as e:
        print(f"추천 오류: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@restaurant_bp.route('/api/restaurant/<int:restaurant_id>')
def get_restaurant_details(restaurant_id):
    connection = get_db_connection()
    if not connection:
        return jsonify({'success': False, 'error': 'DB 연결 실패'}), 500

    try:
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM tRestaurant WHERE restaurantID = %s"
        cursor.execute(query, (restaurant_id,))
        restaurant = cursor.fetchone()

        if restaurant:
            return jsonify({'success': True, 'restaurant': restaurant})
        else:
            return jsonify({'success': False, 'error': '식당을 찾을 수 없습니다.'}), 404

    except Error as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        cursor.close()
        connection.close()
