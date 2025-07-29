from flask import Blueprint, render_template, request

community_bp = Blueprint('community', __name__)

@community_bp.route('/community')
def community():
    return render_template('community.html')
