from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from ..models import User
from .. import db

auth_bp = Blueprint("auth", __name__)

@auth_bp.post("/register")
def register():
    data = request.json

    if User.query.filter_by(email=data["email"]).first():
        return {"message": "Email already registered"}, 400

    user = User(
        name=data["name"],
        email=data["email"]
    )
    user.set_password(data["password"])

    db.session.add(user)
    db.session.commit()

    return {"message": "User registered"}

@auth_bp.post("/login")
def login():
    data = request.json
    user = User.query.filter_by(email=data["email"]).first()

    if not user or not user.check_password(data["password"]):
        return {"message": "Invalid credentials"}, 401

    token = create_access_token(identity=str(user.id))
    return {"access_token": token}
