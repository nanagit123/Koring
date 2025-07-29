from flask import Blueprint, render_template, request

community_bp = Blueprint('community', __name__)

posts = []  # 임시저장소
commensts = {}  # 댓글 저장소

@community_bp.route('/community')
def community():
    sorted_posts = sorted(posts, key=lambda x: x['id'], reverse=True)
    return render_template('community.html')

@community_bp.route('/community/<int:post_id>')
def community_detail(post_id):
    post = next((p for p in posts if p['id'] == post_id), None)
    post_comments = commensts.get(post_id, [])
    return render_template('community_detail.html', post=post, comments=post_comments)

@community_bp.route('/community/new', methods=['GET', 'POST'])
def community_create():
    if request.method == 'POST':
        new_post = {
            'id': len(posts) + 1,
            'author': session.get('email', 'Anonymous'),
            'title': request.form['title'],
            'content': request.form['content'],
        }
        posts.append(new_post)
        return redirect(url_for('community.community_list'))
    return render_template('community_create.html')

@community_bp.route('/community/<int:post_id>/comment', methods=['POST'])
def add_comment(post_id):
    comment = {
        'author': session.get('email', 'Anonymous'),
        'content': request.form['content']
    }
    commensts.setdefault(post_id, []).append(comment)
    return redirect(url_for('community.community_detail', post_id=post_id))

@community_bp.route('/community/<int:post_id>/delete', methods=['POST'])
def delete_post(post_id):
    global posts
    posts = [p for p in posts if p['id'] != post_id]
    commensts.pop(post_id, None)
    return redirect(url_for('community.community_list'))

@community_bp.route('/community/<int:post_id>/comment/<int:comment_index>/delete', methods=['POST'])
def delete_comment(post_id, comment_index):
    if post_id in commensts and 0 <= comment_index < len(commensts[post_id]):
        del commensts[post_id][comment_index]
    return redirect(url_for('community.community_detail', post_id=post_id))