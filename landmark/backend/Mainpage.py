from flask import Blueprint,render_template

main_bp = Blueprint('main', __name__)


@main_bp.route('/')
def home():
    return render_template('mainpage.html')

@main_bp.route('/main')
def main_page():
    return render_template('mainpage.html')

@main_bp.route('/integrated')
def integrated_page():
    return render_template('integrated.html')

@main_bp.route('/reservation')
def reservation_page():
    return render_template('reservation.html')

@main_bp.route('/restaurant')
def restaurant_page():
    return render_template('restaurant.html')

@main_bp.route('/album')
def album_page():
    return render_template('album.html')
