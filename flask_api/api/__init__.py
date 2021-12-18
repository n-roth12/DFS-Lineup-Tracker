from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
import os
import config

app = Flask(__name__, static_folder=os.path.abspath(config.static_folder_path))

app.debug = True
app.config['BASE_base'] = config.base_url
app.config['SECRET_KEY'] = config.app_secret_key
app.config['SQLALCHEMY_DATABASE_URI'] = config.dev_database_uri
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
ma = Marshmallow(app)
from api import routes

