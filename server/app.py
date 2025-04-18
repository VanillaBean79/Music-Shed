#!/usr/bin/env python3

# Standard library imports
from models import Student, Teacher, Appointment
# Remote library imports
from flask import request
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports


# Views go here!

@app.route('/')
def index():
    return '<h1>Music Shed</h1>'


@app.route('/students', methods=['GET'])
def get_students():
    students = Student.query.all()
#   return [object.to_dict() for object in query_result], status_code
    return [student.to_dict() for student in students], 200

@app.route('/students', methods=['POST'])
def add_new_student():
    data = request.get_json()
    
    new_student = Student(
        name = data.get('name'),
        age = data.get('age'),
        instrument = data.get('instrument')
    )
    
    db.session.add(new_student)
    db.session.commit()
    
    return new_student.to_dict(), 201
    
if __name__ == '__main__':
    app.run(port=5555, debug=True)

