📌 Personal Finance Tracker
A simple full-stack finance tracking application built with:
- Angular 20 (standalone components)
- Flask backend
- PostgreSQL database
- Docker & Docker Compose
- Nginx (production frontend)


🚀 Features
- Track expenses and categories
- Dashboard with charts (Chart.js)
- API endpoints with Flask
- Persistent PostgreSQL storage
- Fully containerized setup


📂 Project Structure
personal-finance/
│
├─ backend/          # Flask API
├─ frontend/         # Angular 20 app
├─ docker-compose.yml
└─ README.md


🛠️ Development Setup
1. Clone the repository
    git clone https://github.com/febrii/personal-finance.git
    cd personal-finance


🧪 Running Locally (Development Mode)
Backend
 - cd backend
 - python -m venv .venvs
 - source .venvs/Scripts/activate    # Windows: .venvs\Scripts\activate
 - pip install -r requirements.txt
 - flask run --port 5000

Frontend
 - cd frontend
 - npm install
 - ng serve --open


🐳 Running Production Build (Docker)
From the project root:
 - docker-compose up --build -d

This will start:
 - Angular (served via Nginx) → http://localhost:4200
 - Flask backend → http://localhost:5000/api
 - PostgreSQL database → port 5432

To see running containers:
 - docker ps


📦 Production Frontend Build
The Angular frontend is built using:
 - npm run build

Then served from Nginx inside finance_frontend.


🔧 Environment Variables
Backend uses:
 - DATABASE_URL=postgresql://finance_user:password123@db:5432/finance_db
 - FLASK_ENV=production

Set in docker-compose.yml.


🧹 Cleaning Containers
docker-compose down
docker system prune -a


📜 License
MIT — free to use and modify.