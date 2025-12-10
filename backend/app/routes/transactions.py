from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Transaction
from .. import db
from datetime import datetime

tx_bp = Blueprint("transactions", __name__)

@tx_bp.get("/")
@jwt_required()
def list_transactions():
    user_id = get_jwt_identity()
    transactions = Transaction.query.filter_by(user_id=user_id).all()

    return [{"id": t.id, "amount": t.amount, "type": t.type,
             "date": t.date.isoformat(), "description": t.description,
             "category_id": t.category_id} for t in transactions]

@tx_bp.post("/")
@jwt_required()
def create_transaction():
    user_id = get_jwt_identity()
    data = request.json

    tx = Transaction(
        user_id=user_id,
        category_id=data["category_id"],
        amount=data["amount"],
        type=data["type"],
        date=datetime.fromisoformat(data["date"]).date(),
        description=data.get("description")
    )

    db.session.add(tx)
    db.session.commit()

    return {"message": "Transaction added"}
