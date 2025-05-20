

# 🎵 Music Shed

**Music Shed** is a full-stack web app that helps students schedule and manage music lessons with teachers. Built with **React** on the frontend and **Flask** on the backend, it offers simple login, teacher browsing, and appointment booking.

---

## 🧰 Tech Stack

- **Frontend:** React, React Router, Context API
- **Backend:** Flask, Flask-Restful, SQLAlchemy
- **Database:** SQLite
- **Authentication:** Session-based with Flask sessions
- **Extras:** Faker (for seeding), Werkzeug (password hashing)

---

## 🚀 Features

### Students Can:
- Sign up and log in securely
- View available teachers
- Book, view, and manage appointments
- Logout and maintain session state

### Admin Tools:
- Seed the database with fake students, teachers, and appointments using `seed.py`

---

## 📁 Project Structure

music-shed/
├── client/ # React frontend
│ └── src/
│ ├── components/ # UI components
│ ├── context/ # User context
│ └── App.js # Routes & layout
│
├── app.py # Main Flask app
├── models.py # SQLAlchemy models
├── config.py # App & DB config
├── seed.py # Database seeder
├── README.md # You're here

yaml
Copy code

---

## 🔧 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/music-shed.git
cd music-shed

Backend Setup
bash
Copy code
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
Run migrations and seed data:
bash
Copy code
flask db upgrade
python seed.py
Start the Flask backend:
bash
Copy code
python app.py
Runs on: http://localhost:5555

  Frontend Setup
bash
Copy code
cd client
npm install
npm start
Runs on: http://localhost:3000

📬 API Endpoints
Endpoint	Method	Description
/signup	POST	Register a new student
/login	POST	Log in a student
/logout	DELETE	Log out current user
/check_session	GET	Check logged-in user session
/teachers	GET	List all teachers
/appointments	GET	List all appointments
/appointments	POST	Create a new appointment
/appointments/<id>	PATCH	Update appointment datetime
/appointments/<id>	DELETE	Cancel an appointment
/students/<id>/appointments	GET	Get all appointments for a student
/teachers/<id>/appointments	GET	Get all appointments for a teacher


📄 License
MIT License