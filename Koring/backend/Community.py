from flask import Blueprint, render_template, request, redirect, url_for,session

community_bp = Blueprint('community', __name__)

posts = []  # 임시저장소
comments = {}  # 댓글 저장소

# 커뮤니티 메인 페이지
@community_bp.route('/community')
def community_list():
    sorted_posts = sorted(posts, key=lambda x: x['id'], reverse=True)
    return render_template('community.html', posts=sorted_posts)

# 커뮤니티 상세 페이지, 댓글 기능 포함
@community_bp.route('/community/<int:post_id>')
def community_detail(post_id):
    post = next((p for p in posts if p['id']==post_id), None)
    post_comments = comments.get(post_id, [])
    return render_template('community_detail.html', post=post, comments=post_comments)

# 커뮤니티 글 작성 페이지
@community_bp.route('/community/new', methods=['GET', 'POST'])
def community_create():
    if request.method == 'POST':
        new_post = {
            'id': len(posts) + 1,
            'author': session.get('userName', 'Anonymous'),
            'title': request.form['title'],
            'content': request.form['content'],
        }
        posts.append(new_post)
        return redirect(url_for('community.community_list'))
    return render_template('community_create.html')

# 커뮤니티 댓글
@community_bp.route('/community/<int:post_id>/comment', methods=['POST'])
def add_comment(post_id):
   comment = {
        'author': session.get('userName', 'Anonymous'),
        'content': request.form['content']
   }
   comments.setdefault(post_id, []).append(comment)
   return redirect(url_for('community.community_detail', post_id=post_id))

# 커뮤니티 글 삭제
@community_bp.route('/community/<int:post_id>/delete', methods=['POST'])
def delete_post(post_id):
    global posts
    posts = [p for p in posts if p['id'] != post_id]
    comments.pop(post_id, None)
    return redirect(url_for('community.community_list'))

# 커뮤니티 댓글 삭제
@community_bp.route('/community/<int:post_id>/comment/<int:comment_index>/delete',methods=['POST'])
def delete_comment(post_id, comment_index):
   if post_id in comments and 0 <= comment_index < len(comments[post_id]):
       del comments[post_id][comment_index]
   return redirect(url_for('community.community_detail', post_id=post_id))
