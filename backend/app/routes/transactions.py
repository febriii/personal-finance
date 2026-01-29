from flask import Blueprint, request
from flask.json import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Transaction, Category
from .. import db
from datetime import datetime
from sqlalchemy import func, case

tx_bp = Blueprint("transactions", __name__)

@tx_bp.get("/")
@jwt_required()
def list_transactions():
    user_id = int(get_jwt_identity())
    transactions = Transaction.query.filter_by(user_id=user_id).all()

    return [{"id": t.id, "amount": t.amount, "type": t.type,
             "date": t.date.isoformat(), "description": t.description,
             "category_id": t.category_id} for t in transactions]

@tx_bp.post("/")
@jwt_required()
def create_transaction():
    user_id = int(get_jwt_identity())
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

@tx_bp.get("/public")
def list_transactions_public():
    transactions = Transaction.query.all()

    return [
        {
            "id": t.id,
            "amount": t.amount,
            "description": t.description,
            "date": t.date.isoformat() if t.date else None
        }
        for t in transactions
    ]

@tx_bp.route("/summary", methods=["GET"])
@jwt_required()
def summary():
    user_id = get_jwt_identity()

    income = (
        db.session.query(func.coalesce(func.sum(Transaction.amount), 0))
        .filter_by(user_id=user_id, type="income")
        .scalar()
    )

    expense = (
        db.session.query(func.coalesce(func.sum(Transaction.amount), 0))
        .filter_by(user_id=user_id, type="expense")
        .scalar()
    )

    return {
        "total_income": float(income),
        "total_expense": float(expense),
        "balance": float(income - expense)
    }

@tx_bp.route("/summary/monthly", methods=["GET"])
@jwt_required()
def monthly_summary():
    user_id = get_jwt_identity()

    results = (
        db.session.query(
            func.date_trunc('month', Transaction.date).label("month"),
            func.sum(
                case(
                    (Transaction.type == "income", Transaction.amount),
                    else_=0
                )
            ).label("income"),
            func.sum(
                case(
                    (Transaction.type == "expense", Transaction.amount),
                    else_=0
                )
            ).label("expense"),
        )
        .filter(Transaction.user_id == user_id)
        .group_by(func.date_trunc('month', Transaction.date))
        .order_by(func.date_trunc('month', Transaction.date))
        .all()
    )
    data = []
    for row in results:
        data.append({
            "month": row.month.strftime("%Y-%m"),
            "income": float(row.income),
            "expense": float(row.expense)
        })

    return jsonify(data)

@tx_bp.route("/summary/category", methods=["GET"])
@jwt_required()
def category_summary():
    user_id = get_jwt_identity()

    results = (
        db.session.query(
            Category.name.label("category"),
            func.sum(Transaction.amount).label("total")
        )
        .join(Category, Transaction.category_id == Category.id)
        .filter(Transaction.user_id == user_id)
        .filter(Transaction.type == "expense") # only expenses
        .group_by(Category.name)
        .order_by(func.sum(Transaction.amount).desc())
        .all()
    )

    data = []
    for row in results:
        data.append({
            "category": row.category,
            "total": float(row.total)
        })

    return jsonify(data)

@tx_bp.get("/summary/categories")
@jwt_required()
def category_summary_pie():
    user_id = get_jwt_identity()

    results = (
        db.session.query(
            Category.name.label("category"),
            func.sum(Transaction.amount).label("total")
        )
        .join(Category, Transaction.category_id == Category.id)
        .filter(Transaction.user_id == user_id)
        .filter(Transaction.type == "expense")
        .group_by(Category.name)
        .all()
    )

    data = [
        { "category": row.category, "total": float(row.total) }
        for row in results
    ]

    return jsonify(data)