import os
from flask import Flask
from flask_cors import CORS
from Login import login_bp
from Mainpage import main_bp
from Community import community_bp
from restaurant import restaurant_bp
from map_service import map_bp

template_dir= r'C:\Users/82104\Koring_backend\Koring\pages'
static_dir= r'C:\Users\82104\Koring_backend\Koring'

app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)
app.secret_key = 'your_secret_key'

CORS(app) 

app.register_blueprint(login_bp)
app.register_blueprint(main_bp)
app.register_blueprint(community_bp)
app.register_blueprint(restaurant_bp, url_prefix='/restaurant')
app.register_blueprint(map_bp, url_prefix='/map')

if __name__ == '__main__':
   
   print(f"Template dirctory: {template_dir}")
   print(f"Template dirctory exists: {os.path.exists(template_dir)}")
   print(f"login.html exists:{os.path.exists(os.path.join(template_dir, 'login.html'))}")
   app.run(debug=True)
