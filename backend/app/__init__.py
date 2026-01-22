from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
import os

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
        "DATABASE_URL",
        "postgresql://finance_user:password123@db:5432/finance_db"
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret-dev-key')

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    from .routes.auth import auth_bp
    from .routes.transactions import tx_bp
    from .routes.categories import cat_bp

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(tx_bp, url_prefix="/transactions")
    app.register_blueprint(cat_bp, url_prefix="/categories")

    return app
