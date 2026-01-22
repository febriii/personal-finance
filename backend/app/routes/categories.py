from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Category
from .. import db

cat_bp = Blueprint("categories", __name__)

@cat_bp.get("/")
@jwt_required()
def list_categories():
    user_id = int(get_jwt_identity())
    cats = Category.query.filter((Category.user_id == None) | (Category.user_id == user_id)).all()

    return [{"id": c.id, "name": c.name, "type": c.type} for c in cats]

@cat_bp.post("/")
@jwt_required()
def create_category():
    user_id = int(get_jwt_identity())
    data = request.json

    cat = Category(
        name=data["name"],
        type=data["type"],
        user_id=user_id
    )

    db.session.add(cat)
    db.session.commit()
    return {"message": "Category created"}
