"""
This contains the application factory for creating flask application instances.
Using the application factory allows for the creation of flask applications configured 
for different environments based on the value of the CONFIG_TYPE environment variable
"""

import os
from flask import Flask, render_template
from flask_cors import CORS

from app.models import db  
from celery import Celery  
from config import Config  
import logging
from flask.logging import default_handler
from logging.handlers import RotatingFileHandler

### Instantiate Celery ###
celery = Celery(__name__, broker=Config.CELERY_BROKER_URL, result_backend=Config.RESULT_BACKEND)  

### Application Factory ###
def create_app():

    app = Flask(__name__, static_folder="static")
    # Ensure that the static folders exist
    ensure_static_folders()

    # Configure the flask app instance
    CONFIG_TYPE = os.getenv('CONFIG_TYPE', default='config.DevelopmentConfig')
    app.config.from_object(CONFIG_TYPE)

    # Enable CORS
    CORS(app)

    # Configure celery
    celery.conf.update(app.config)

    # Register blueprints
    register_blueprints(app)

    # Initialize db
    initialize_database(app)

    configure_logging(app)

    # Register error handlers
    register_error_handlers(app)

    return app


### Helper Functions ###
def ensure_static_folders():
    base_dir = os.getcwd()

    log_dir = os.path.join(base_dir, "logs")
    static_streams_path = os.path.join(base_dir, "app/static", "streams")
    static_upload_path = os.path.join(base_dir, "app/static", "uploads")

    # Create "static/streams" if it doesn't exist
    os.makedirs(log_dir, exist_ok=True)
    os.makedirs(static_streams_path, exist_ok=True)
    os.makedirs(static_upload_path, exist_ok=True)

def register_blueprints(app):
    from app.auth import auth_blueprint
    from app.main import main_blueprint

    # app.register_blueprint(auth_blueprint, url_prefix='/auth')
    app.register_blueprint(main_blueprint)

def initialize_database(app):
    db.init_app(app)
    with app.app_context():
        db.create_all()

def register_error_handlers(app):

    # 400 - Bad Request
    @app.errorhandler(400)
    def bad_request(e):
        return render_template('400.html'), 400

    # 403 - Forbidden
    @app.errorhandler(403)
    def forbidden(e):
        return render_template('403.html'), 403

    # 404 - Page Not Found
    @app.errorhandler(404)
    def page_not_found(e):
        return render_template('404.html'), 404

    # 405 - Method Not Allowed
    @app.errorhandler(405)
    def method_not_allowed(e):
        return render_template('405.html'), 405

    # 500 - Internal Server Error
    @app.errorhandler(500)
    def server_error(e):
        return render_template('500.html'), 500
    
   
def configure_logging(app):

    # Deactivate the default flask logger so that log messages don't get duplicated 
    app.logger.removeHandler(default_handler)

    # Create a file handler object
    file_handler = RotatingFileHandler('logs/flaskapp.log', maxBytes=16384, backupCount=20)

    # Set the logging level of the file handler object so that it logs INFO and up
    file_handler.setLevel(logging.INFO)

    # Create a file formatter object
    file_formatter = logging.Formatter('%(asctime)s %(levelname)s: %(message)s [in %(filename)s: %(lineno)d]')

    # Apply the file formatter object to the file handler object
    file_handler.setFormatter(file_formatter)

    # Add file handler object to the logger
    app.logger.addHandler(file_handler)

