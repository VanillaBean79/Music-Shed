
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates, relationship
from config import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash


class Student(db.Model, SerializerMixin):
    __tablename__ = "students"
    #label columns
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    name = db.Column(db.String)
    age = db.Column(db.Integer)
    instrument = db.Column(db.String)
    
    # add relationships
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    teachers = db.relationship(
        'Teacher',
        secondary='appointments',
        back_populates='students',
        overlaps='appointments'
    )

    appointments = db.relationship(
        'Appointment',
        back_populates='student',
        cascade='all, delete-orphan',
        overlaps="teachers"
    )

    serialize_rules = (
        '-appointments.student',
        '-teachers.students'
    )
    
    
    @validates('name')
    def validate_name(self, key, value):
        if not value or not value.strip():
            raise ValueError("Student name cannot be blank.")
        return value
    
    
    @validates('age')
    def validate_age(self, key, value):
        if not isinstance(value, int) or value < 5:
            raise ValueError("Student age must be a number greater than 5.")
        return value
    
    
    @validates('instrument')
    def validate_instrument(self, key, value):
        if not value or not value.strip():
            raise ValueError("Instrument name cannot be blank.")
        return value
        
    



class Teacher(db.Model, SerializerMixin):
    __tablename__ = "teachers"
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    age = db.Column(db.Integer)


    students = db.relationship(
        'Student',
        secondary='appointments',
        back_populates='teachers',
        overlaps="appointments"
    )

    appointments = db.relationship(
        'Appointment',
        back_populates='teacher',
        cascade='all, delete-orphan',
        overlaps="students"
    )

    serialize_rules = (
        '-appointments.teacher',
        '-students.teachers'
    )



class Appointment(db.Model, SerializerMixin):
    __tablename__ = "appointments"
    
    id = db.Column(db.Integer, primary_key=True)
    lesson_datetime = db.Column(db.DateTime, nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teachers.id', name='fk_appointments_teacher_id'),
                           nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id', name='fk_appointments_student_id'),
                           nullable=False)

    student = db.relationship('Student',
                              back_populates='appointments',
                              overlaps="teachers, students"
                              )
    
    teacher = db.relationship('Teacher',
                              back_populates='appointments',
                              overlaps='teachers, students'
                              )
    
    serialize_rules = (
        '-student.appointments',
        '-teacher.appointments',
        '-student.teachers',
        '-teacher.students'
    )


    @validates('cost')
    def validate_cost(self, key, value):
        if value not in [30, 40, 50]:
            raise ValueError('Cost must be either $30, $40, or $50.')
        return value 
    

    @validates('duration')
    def validate_duration(self, key, value):
        if value not in [30, 45, 60]:
            raise ValueError('Lesson duration must be 30, 45, or 60 minutes.')
        return value


    @validates('lesson_datetime')
    def validate_datetime(self, key, value):
        if not isinstance(value, datetime):
            raise ValueError("Must be a valid datetime.")
        return value
    
    

