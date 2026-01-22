from flask import Blueprint, request, jsonify
from .models import db, Transaction

api_bp = Blueprint("api", __name__, url_prefix="/api")

@api_bp.route("/transactions", methods=["POST"])
def create_transaction():
    data = request.get_json()

    description = data.get("description")
    amount = data.get("amount")
    category = data.get("category")

    if not description or not amount:
        return jsonify({"error": "description and amount required"}), 400

    tx = Transaction(
        description=description,
        amount=amount,
        category=category
    )

    db.session.add(tx)
    db.session.commit()

    return jsonify({
        "id": tx.id,
        "description": tx.description,
        "amount": float(tx.amount),
        "category": tx.category,
        "created_at": tx.created_at.isoformat()
    }), 201


@api_bp.route("/transactions", methods=["GET"])
def list_transactions():
    transactions = Transaction.query.order_by(Transaction.created_at.desc()).all()

    return jsonify([
        {
            "id": tx.id,
            "description": tx.description,
            "amount": float(tx.amount),
            "category": tx.category,
            "created_at": tx.created_at.isoformat()
        }
        for tx in transactions
    ])
