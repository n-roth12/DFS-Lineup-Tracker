from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_login import LoginManager
import os
import config

app = Flask(__name__, static_folder=os.path.abspath(config.static_folder_path))

app.debug = True
app.config['BASE_base'] = config.base_url
app.config['SECRET_KEY'] = config.app_secret_key
app.config['SQLALCHEMY_DATABASE_URI'] = config.dev_database_uri
app.config['FFB_API_URL'] = config.ffb_api_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['MONGODB_URI'] = config.dev_mongodb_uri

db = SQLAlchemy(app)
ma = Marshmallow(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
migrate = Migrate(app, db)
from .blueprints.LineupsBlueprint import lineups_blueprint
from .blueprints.UsersBlueprint import users_blueprint
from .blueprints.HistoryBlueprint import history_blueprint
from .blueprints.UpcomingBlueprint import upcoming_blueprint
from api import routes
app.register_blueprint(lineups_blueprint)
app.register_blueprint(users_blueprint)
app.register_blueprint(history_blueprint)
app.register_blueprint(upcoming_blueprint)