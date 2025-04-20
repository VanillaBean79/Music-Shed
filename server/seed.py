# Standard library imports
from datetime import datetime, timedelta, time
from random import randint, choice

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Student, Teacher, Appointment

fake = Faker()

if __name__ == '__main__':
    with app.app_context():
        print("🌱 Starting seed...")

        db.drop_all()
        db.create_all()

        instruments = [
            "Bass Guitar", "Acoustic Guitar", "Piano", "Drums",
            "Voice", "Cello", "Brass", "Woodwind"
        ]

        # Create teachers
        teachers = [
            Teacher(name=fake.name(), age=randint(25, 60)) for _ in range(3)
        ]

        students = []
        for _ in range(5):
            name = fake.name()
            username = fake.user_name()
            password = "test123"
            
            student = Student(
                name=name,
                age=randint(12, 65),
                instrument=choice(instruments),
                username=username
            )
            student.set_password(password)
            
            students.append(student)

        db.session.add_all(teachers + students)
        db.session.commit()

        # Create appointments
        appointments = []

        for _ in range(8):
            teacher = choice(teachers)
            student = choice(students)

            days_ahead = randint(1, 7)
            hour = randint(9, 19)  # Between 9 AM and 7 PM

            future_date = datetime.now() + timedelta(days=days_ahead)
            lesson_datetime = future_date.replace(hour=hour, minute=0, second=0, microsecond=0)


            cost = choice([30, 40, 50])
            duration = choice([30, 45, 60])

            print(f"[DEBUG] Appointment datetime: {lesson_datetime} | Teacher: {teacher.name} | Student: {student.name}")

            appointments.append(
                Appointment(
                    teacher=teacher,
                    student=student,
                    cost=cost,
                    duration=duration,
                    lesson_datetime=lesson_datetime
                )
            )

        db.session.add_all(appointments)
        db.session.commit()

        print("✅ Database seeded successfully!")
