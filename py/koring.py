from flask import Flask
from Login import login_bp
from Mainpage import main_bp
from Community import comunity_bp
from restaurant import restaurant_bp

app = Flask(__name__)
app.secret_key = 'your_secret_key'

app.register_blueprint(login_bp)
app.register_blueprint(main_bp)
app.register_blueprint(comunity_bp)
app.register_blueprint(restaurant_bp, url_prefix='/restaurant')

if __name__ == '__main__':
    app.run(debug=True)
