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


if __name__ == '__main__':
    app.run(port=5555, debug=True)

