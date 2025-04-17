
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates, relationship
from config import db



class Student(db.Model, SerializerMixin):
    __tablename__ = "students"
    #label columns
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    age = db.Column(db.Integer)
    instrument = db.Column(db.String)
    # add relationships

    teachers = db.relationship(
        'Teacher',
        secondary='teacher_student',
        back_populates='students'
    )

    teacher_students = db.relationship(
        'TeacherStudent',
        back_populates='student',
        cascade='all, delete-orphan'
    )

    serialize_rules = (
        '-teacher_students.student',
        '-teachers.students'
    )



class Teacher(db.Model, SerializerMixin):
    __tablename__ = "teachers"
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    age = db.Column(db.Integer)


    students = db.relationship(
        'Student',
        secondary='teacher_student',
        back_populates='teachers'
    )

    teacher_students = db.relationship(
        'TeacherStudent',
        back_populates='teacher',
        cascade='all, delete-orphan'
    )

    serialize_rules = (
        '-teacher_students.teacher',
        '-students.teachers'
    )



class TeacherStudent(db.Model, SerializerMixin):
    __tablename__ = "teacher_student"
    
    id = db.Column(db.Integer, primary_key=True)
    cost = db.Column(db.Integer, nullable=False)
    duration = db.Column(db.Integer, nullabel=False)

    teacher_id = db.Column(db.Integer, db.ForeignKey('teachers.id'))
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'))

    student = db.relationship('Student',
                              back_populates='teacher_students',
                              )
    
    teacher = db.relationship('Teacher',
                              back_populates='teacher_students')
    
    serialize_rules = (
        '-student.teacher_students',
        '-teacher.teacher_students'
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

