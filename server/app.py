#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request
from flask_restful import Resource
from datetime import datetime
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
    
    
class StudentByID(Resource):
    def get(self, id):
        student = Student.query.filter(id==id).first()
        
        if student:
            return student.to_dict(rules=('-appointments', '-teachers')), 200
        else:
            return {'error': 'Student not found'}, 404
        
        
    def patch(self, id):
        student = Student.query.filter(id==id).first()
        data = request.get_json()
        for attr in ['name', 'age', 'instrument']:
            if attr in data:
                setattr(student, attr, data[attr])
        db.session.commit()
        return student.to_dict(), 200




class TeacherList(Resource):
    def get(self):
        teachers = Teacher.query.all()
        return [teacher.to_dict(rules=('-appointments', '-students')) for teacher in teachers], 200
    
    
    def post(self):
        data = request.get_json()
        new_teacher = Teacher(
            name = data.get('name'),
            age = data.get('age')
        )
        
        db.session.add(new_teacher)
        db.session.commit()
        
        return new_teacher.to_dict(), 201


class AppointmentList(Resource):
    def get(self):
        appointments = Appointment.query.limit(1).all()
        return [a.to_dict(rules=('-student.appointments', '-teacher.appointments', 'student.teachers', 'teacher.students'))for a in appointments], 200
    
    
    def post(self):
        data = request.get_json()
        new_appointment = Appointment(
            teacher_id=data.get('teacher_id'),
            student_id=data.get('student_id'),
            cost=data.get('cost'),
            duration=data.get('duration'),
            lesson_datetime=datetime.fromisoformat(data.get('lesson_datetime'))
        )
        db.sessio.add(new_appointment)
        db.session.commit()
        
        return new_appointment.to_dict(), 201
        
    
    
api.add_resource(AppointmentList, '/appointments')
api.add_resource(StudentList, '/students')    
api.add_resource(TeacherList, '/teachers')   
    
    
@app.route('/')
def index():
    return '<h1>Music Shed</h1>'
    
if __name__ == '__main__':
    app.run(port=5555, debug=True)

