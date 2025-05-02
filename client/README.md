

# 🎵 Music Shed

Music Shed is a full-stack web application that allows students to sign up, view available music teachers, and book lessons with them. Once signed up or logged in, a student can schedule, view, and delete appointments. The app is built with **React** (frontend), **Flask** (backend), and **SQLAlchemy** (ORM for PostgreSQL or SQLite).

---

## ✨ Features

- Student signup & login system with password authentication.
- View available teachers.
- Book a lesson with a chosen teacher.
- View scheduled appointments.
- Delete an appointment.
- Delete a student account.

---

## 📂 Project Structure

### 📁 `client/` (React Frontend)

#### `App.js`
- **Root component** that manages routing and user session.
- `useEffect` checks for an active session via `/check_session`.
- Uses React Router to switch between pages (`Home`, `Signup`, `Login`, `MyAppointments`).

#### `Home.js`
- Landing page with buttons to sign up or log in.
- Navigation handled with `useNavigate`.

#### `Signup.js`
- Form for new student registration.
- Collects `username`, `password`, `name`, `age`, and `instrument`.
- Sends a `POST` request to `/signup`.

#### `Login.js`
- Handles logging in existing students by verifying credentials.
- Stores session on the backend via `/login`.

#### `TeachersList.js`
- Fetches available teachers from `/teachers`.
- Renders list of teachers and lets students book appointments via `/appointments`.
- `handleBookAppointment` sends `POST` with `student_id`, `teacher_id`, and `lesson_datetime`.

#### `MyAppointments.js`
- Fetches appointments for the logged-in student from `/students/:id/appointments`.
- Allows deletion of appointments via `DELETE /appointments/:id`.
- If no appointments exist, renders the `TeachersList` so the student can book one.

#### `index.css`
- Custom properties (`--bg`, `--text`, etc.) used for consistent theming.
- Shared layout styles to center content on all pages using `.page-container`.

---

### 📁 `server/` (Flask Backend)

#### `app.py`
- Initializes the Flask app, database (`db`), and RESTful API with Flask-RESTful.
- Adds routes and resource mappings.
- Defines the root route `/`.

#### `models.py`
Defines the database schema and logic:

- **Student**
  - Fields: `username`, `password_hash`, `name`, `age`, `instrument`.
  - Relationships: `appointments`, `teachers`.
  - Methods: `set_password()`, `check_password()`.
  - Validations ensure age > 5 and instrument name is not blank.
  
- **Teacher**
  - Fields: `name`, `age`.
  - Relationships: `students`, `appointments`.

- **Appointment**
  - Join table connecting `Student` and `Teacher`.
  - Field: `lesson_datetime`.

#### `resources.py` (your route handlers)

##### `/signup`
- Handles new student creation and sets session cookie.

##### `/login`
- Verifies login credentials and returns student data.

##### `/logout`
- Clears session on backend.

##### `/check_session`
- Returns current student if a session exists.

##### `/teachers`
- Returns a list of available teachers.

##### `/appointments`
- `GET`: Returns one or more appointments.
- `POST`: Creates new appointment.
- `DELETE`: Deletes appointment by ID.

##### `/students/:id/appointments`
- Returns a list of appointments for a specific student.

##### `/students/:id`
- `PATCH`: Updates a student’s info.
- `DELETE`: Deletes the student account.

---

## 📸 Screenshots (optional)

Add screenshots like this using Markdown:
```md
![Signup Page](./screenshots/signup.png)
```

---

## 🔗 Resources Used

- [React](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Flask](https://flask.palletsprojects.com/)
- [Flask-RESTful](https://flask-restful.readthedocs.io/)
- [SQLAlchemy](https://docs.sqlalchemy.org/)
- [Faker (for seeding)](https://faker.readthedocs.io/)
- [Werkzeug Security](https://werkzeug.palletsprojects.com/en/2.3.x/utils/#werkzeug.security.generate_password_hash)

---

## ✅ Future Improvements

- Students can select a specific date and time instead of defaulting to now.
- Add teacher bios or profile images.
- Authentication via JWTs.
- Deploy to Render or Netlify/Heroku.

---

Would you like this saved as a `.md` file or copied into your project directory?