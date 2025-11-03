import pymysql
from flask import Blueprint, request, jsonify, session, current_app
from flask_cors import CORS

community_bp = Blueprint('community', __name__, url_prefix='/api/community')
CORS(community_bp, supports_credentials=True)  # 세션 유지용

# DB 연결
def get_connection():
    return pymysql.connect(**current_app.config['DB_CONFIG'])

# 권한 체크 함수
def check_ownership(cursor, table, id_col, id_val, userID):
    cursor.execute(f"SELECT userID FROM {table} WHERE {id_col}=%s", (id_val,))
    row = cursor.fetchone()
    return row and row['userID'] == userID

# 글 목록
@community_bp.route('/posts', methods=['GET'])
def get_posts():
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM tPost ORDER BY postCreatedAt DESC")
            posts = cursor.fetchall()
        return jsonify(posts)
    finally:
        conn.close()

# 글 작성
@community_bp.route('/posts', methods=['POST'])
def create_post():
    if 'userID' not in session:  # 로그인 체크
        return jsonify({'success': False, 'message': '로그인이 필요합니다.'}), 401

    data = request.json
    title = data.get('postTitle')
    content = data.get('postContent')
    imageURL = data.get('postImageURL', None)
    userID = session['userID']

    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            sql = "INSERT INTO tPost(postTitle, postContent, postImageURL, userID) VALUES (%s, %s, %s, %s)"
            cursor.execute(sql, (title, content, imageURL, userID))
        conn.commit()
        return jsonify({'success': True, 'message': '글 작성 완료'})
    finally:
        conn.close()

# 글 수정
@community_bp.route('/posts/<int:post_id>', methods=['PUT'])
def update_post(post_id):
    if 'userID' not in session:
        return jsonify({'success': False, 'message': '로그인이 필요합니다.'}), 401

    data = request.json
    title = data.get('postTitle')
    content = data.get('postContent')
    imageURL = data.get('postImageURL', None)
    userID = session['userID']

    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            if not check_ownership(cursor, 'tPost', 'postID', post_id, userID):
                return jsonify({'success': False, 'message': '권한이 없습니다.'}), 403

            cursor.execute(
                "UPDATE tPost SET postTitle=%s, postContent=%s, postImageURL=%s WHERE postID=%s",
                (title, content, imageURL, post_id)
            )
        conn.commit()
        return jsonify({'success': True, 'message': '글 수정 완료'})
    finally:
        conn.close()

# 글 삭제
@community_bp.route('/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    if 'userID' not in session:
        return jsonify({'success': False, 'message': '로그인이 필요합니다.'}), 401

    userID = session['userID']
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            if not check_ownership(cursor, 'tPost', 'postID', post_id, userID):
                return jsonify({'success': False, 'message': '권한이 없습니다.'}), 403

            cursor.execute("DELETE FROM tPost WHERE postID=%s", (post_id,))
        conn.commit()
        return jsonify({'success': True, 'message': '글 삭제 완료'})
    finally:
        conn.close()

# 댓글 목록
@community_bp.route('/posts/<int:post_id>/comments', methods=['GET'])
def get_comments(post_id):
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM tComment WHERE postID=%s ORDER BY commentDate ASC", (post_id,))
            comments = cursor.fetchall()
        return jsonify(comments)
    finally:
        conn.close()

# 댓글 작성
@community_bp.route('/posts/<int:post_id>/comments', methods=['POST'])
def create_comment(post_id):
    if 'userID' not in session:
        return jsonify({'success': False, 'message': '로그인이 필요합니다.'}), 401

    data = request.json
    content = data.get('commentContent')
    userID = session['userID']

    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            sql = "INSERT INTO tComment(commentContent, postID, userID) VALUES (%s, %s, %s)"
            cursor.execute(sql, (content, post_id, userID))
        conn.commit()
        return jsonify({'success': True, 'message': '댓글 작성 완료'})
    finally:
        conn.close()

# 댓글 수정
@community_bp.route('/comments/<int:comment_id>', methods=['PUT'])
def update_comment(comment_id):
    if 'userID' not in session:
        return jsonify({'success': False, 'message': '로그인이 필요합니다.'}), 401

    data = request.json
    content = data.get('commentContent')
    userID = session['userID']

    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            if not check_ownership(cursor, 'tComment', 'commentID', comment_id, userID):
                return jsonify({'success': False, 'message': '권한이 없습니다.'}), 403

            cursor.execute("UPDATE tComment SET commentContent=%s WHERE commentID=%s", (content, comment_id))
        conn.commit()
        return jsonify({'success': True, 'message': '댓글 수정 완료'})
    finally:
        conn.close()

# 댓글 삭제
@community_bp.route('/comments/<int:comment_id>', methods=['DELETE'])
def delete_comment(comment_id):
    if 'userID' not in session:
        return jsonify({'success': False, 'message': '로그인이 필요합니다.'}), 401

    userID = session['userID']
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            if not check_ownership(cursor, 'tComment', 'commentID', comment_id, userID):
                return jsonify({'success': False, 'message': '권한이 없습니다.'}), 403

            cursor.execute("DELETE FROM tComment WHERE commentID=%s", (comment_id,))
        conn.commit()
        return jsonify({'success': True, 'message': '댓글 삭제 완료'})
    finally:
        conn.close()
