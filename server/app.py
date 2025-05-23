#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session
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
        student = Student.query.get(id)
        
        if not student:
            return {"error": "Student not found"}, 404

        return student.to_dict(), 200
        
        
    def patch(self, id):
        student = Student.query.get(id)
        data = request.get_json()
        for attr in ['name', 'age', 'instrument']:
            if attr in data:
                setattr(student, attr, data[attr])
        db.session.commit()
        return student.to_dict(), 200
    
    
    def delete(self, id):
        student = Student.query.get(id)
        
        if student:
            db.session.delete(student)
            db.session.commit()
            return {}, 204
        else:
            return {"error": "Student not found"}, 404




class TeacherList(Resource):
    def get(self):
        teachers = Teacher.query.all()
        return [teacher.to_dict(rules=('-appointments', 
                                       "appointments.student",
                                       "-appointments.teacher",
                                       '-students'
                                       )) for teacher in teachers], 200
    
    
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
            lesson_datetime = datetime.fromisoformat(data.get('lesson_datetime').replace('Z', ''))
        )
        db.session.add(new_appointment)
        db.session.commit()
        
        return new_appointment.to_dict(), 201
    
class AppointmentByID(Resource):
    def get(self, id):
            
        appointment = Appointment.query.get(id)
            
        if appointment:
            return appointment.to_dict(), 200
        else:
            return {"message":"No appointment found."}
        
        
    def patch(self, id):
        appointment = Appointment.query.get(id)
        student_id = session.get('student_id')

        if not appointment:
            return {"error": "Appointment not found"}, 404

        if appointment.student_id != student_id:
            return {"error": "Unauthorized"}, 403

        data = request.get_json()
        if 'lesson_datetime' in data:
            appointment.lesson_datetime = datetime.fromisoformat(data['lesson_datetime'])

        db.session.commit()
        return appointment.to_dict(), 200

    
    
    def delete(self, id):
        appointment = Appointment.query.get(id)
        student_id = session.get('student_id')

        if not appointment:
            return {"error": "Appointment not found"}, 404

        if appointment.student_id != student_id:
            return {"error": "Unauthorized"}, 403

        db.session.delete(appointment)
        db.session.commit()
        return {"message": f"Appointment {id} deleted."}, 200



class StudentAppointments(Resource):
    def get (self, student_id):
        student = Student.query.get(student_id)
        appointments = student.appointments
        
        if not appointments:
            return {"message": " No appointments found"}
        
        return [appointment.to_dict()for appointment in appointments], 200
           
    
class Signup(Resource):
    def post(self):
        data = request.get_json()
        
        if Student.query.filter_by(username=data['username']).first():
            return {'error': 'Username already taken'}, 409
        
        student = Student(
            username = data['username'],
            name=data.get('name'),
            age=data.get('age'),
            instrument=data.get('instrument')
        )
        student.set_password(data['password'])
        
        db.session.add(student)
        db.session.commit()
        
        session['student_id'] = student.id
        return student.to_dict(), 201
    
    
class Login(Resource):
    def post(self):
        data = request.get_json()
        student = Student.query.filter_by(username=data.get('username')).first()
        
        if student and student.check_password(data.get('password')):
            session['student_id'] = student.id
            return student.to_dict(), 200
        
        return {'error': 'Invalid username or password'}
    
    
    
class Logout(Resource):
    def delete(self):
        session.pop('student_id', None)
        return {}, 204
    
    
    
class CheckSession(Resource):
    def get(self):
        student_id = session.get('student_id')

        if not student_id:
            return {'error': "Not logged in"}, 401

        student = Student.query.get(student_id)
        if not student:
            session.pop('student_id', None)
            return {'error': "User not found"}, 404

        # Build teachers data with ordered keys and nested appointments
        teachers_data = []
        for teacher in student.teachers:
            appointments = Appointment.query.filter_by(student_id=student_id, teacher_id=teacher.id).all()

            appointments_data = []
            for appt in appointments:
                appointments_data.append({
                    "id": appt.id,
                    "lesson_datetime": appt.lesson_datetime.isoformat(sep=' '),
                    "student_id": appt.student_id,
                    "teacher_id": appt.teacher_id
                })


            teachers_data.append({
                "id": teacher.id,
                "name": teacher.name,
                "age": teacher.age,
                "appointments": appointments_data
            })

        # Return final student data
        return {
            "id": student.id,
            "name": student.name,
            "age": student.age,
            "instrument": student.instrument,
            "teachers": teachers_data
        }, 200





    
    
    
class TeacherAppointments(Resource):
    def get(self, teacher_id):
        teacher = Teacher.query.get(teacher_id)
        if not teacher:
            return {"error": "Teacher not found"}, 404

        appointments = teacher.appointments
        return [
            appointment.to_dict(
                rules=(
                    '-student.appointments',
                    '-teacher.appointments',
                    'student',
                )
            )
            for appointment in appointments
        ], 200

    
    
    


api.add_resource(TeacherAppointments, '/teachers/<int:teacher_id>/appointments')   
api.add_resource(StudentAppointments, '/students/<int:student_id>/appointments')
api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(CheckSession, '/check_session')        
api.add_resource(AppointmentByID, '/appointments/<int:id>')
api.add_resource(StudentByID, '/students/<int:id>')   
api.add_resource(AppointmentList, '/appointments')
api.add_resource(StudentList, '/students')    
api.add_resource(TeacherList, '/teachers')   
    
    
@app.route('/')
def index():
    return '<h1>Music Shed</h1>'
    
if __name__ == '__main__':
    app.run(port=5555, debug=True)

