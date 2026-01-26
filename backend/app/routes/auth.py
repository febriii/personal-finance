from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
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

    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    return {
        "access_token": access_token,
        "refresh_token": refresh_token
    }

@auth_bp.post("/refresh")
@jwt_required(refresh=True)
def refresh():
    user_id = get_jwt_identity()
    new_access = create_access_token(identity=str(user_id))
    return { "access_token": new_access }
