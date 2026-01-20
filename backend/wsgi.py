from app import create_app
from flask import jsonify
from flask_cors import CORS

app = create_app()
CORS(app)

if __name__ == "__main__":
    app.run(debug=True)

@app.route("/api/health")
def health():
    return jsonify({
        "status": "ok",
        "message": "Backend is working"
    })
