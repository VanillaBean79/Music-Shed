#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import Student, Teacher, Appointment

# Views go here!




class StudentList(Resource):
    def get(self):
        students = Student.query.all()
        return [student.to_dict(rules=('-appointments', '-teachers')) for student in students], 200

    def post(self):
        data = request.get_json()
        new_student = Student(
            name = data.get('name'),
            age = data.get('age'),
            instrument = data.get('instrument')
        )
    
        db.session.add(new_student)
        db.session.commit()
    
        return new_student.to_dict(), 201
    
    
api.add_resource(StudentList, '/students')



class TeacherList(Resource):
    def get(self):
        teachers = Teacher.query.all()
        return [teacher.to_dict(rules=('-appointmetns', '-students')) for teacher in teachers], 200
    
    
    # def post(self):
    #     data = request.get_json()
    #     new_teacher = Teacher(
            
    #     )
    
    
@app.route('/')
def index():
    return '<h1>Music Shed</h1>'
    
if __name__ == '__main__':
    app.run(port=5555, debug=True)

