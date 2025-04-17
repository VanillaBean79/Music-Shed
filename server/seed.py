#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker
from models import Student, Teacher, TeacherStudent
# Local imports
from app import app
from models import db

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        
        db.drop_all()
        db.create_all()

        t1 = Teacher(name="Ms. Taylor", age=35)
        t2 = Teacher(name="Mr. Jenkins", age=42)

        # Create students
        s1 = Student(name="Jordan", age=12, instrument="Guitar")
        s2 = Student(name="Avery", age=14, instrument="Piano")
        s3 = Student(name="Kai", age=11, instrument="Violin")

        # Create teacher-student associations (lessons)
        ts1 = TeacherStudent(teacher=t1, student=s1, cost=30, duration=30)
        ts2 = TeacherStudent(teacher=t1, student=s2, cost=40, duration=45)
        ts3 = TeacherStudent(teacher=t2, student=s3, cost=50, duration=60)
        ts4 = TeacherStudent(teacher=t2, student=s1, cost=30, duration=30)

        # Add everything to the session
        db.session.add_all([t1, t2, s1, s2, s3, ts1, ts2, ts3, ts4])
        db.session.commit()

        print("🌱 Database seeded successfully!")


