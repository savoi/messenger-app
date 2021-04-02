from flask import url_for
from mongoengine import connect, disconnect
from test.test_base import TestBase
import json

from db.db import User

class AuthTest(TestBase):

    @classmethod
    def setUpClass(cls):
        disconnect()
        connect('mongoenginetest', host='mongomock://localhost', alias='default')

    @classmethod
    def tearDownClass(cls):
       disconnect()

    def test_register_user_success(self):
        new_user = {
            'username': "Jennifer",
            'email': "jennifer@fakemail.com",
            'password': "passwordjennifer"
        }
        response = self.api.post('/register', data=json.dumps(new_user), mimetype='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(
            response.json['response'],
            "User successfully registered!")

    def test_register_user_already_exists(self):
        new_user = {
            'username': "John",
            'email': "john@fakemail.com",
            'password': "passwordjohn"
        }
        response1 = self.api.post('/register', data=json.dumps(new_user), mimetype='application/json')
        response2 = self.api.post('/register', data=json.dumps(new_user), mimetype='application/json')
        self.assertEqual(response2.status_code, 401)
        self.assertEqual(
            response2.json['error'],
            "That email/username already exists.")

    def test_register_missing_email(self):
        new_user = {
            'username': "Chris",
            'email': "",
            'password': "passwordchris"
        }
        response = self.api.post('/register', data=json.dumps(new_user), mimetype='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.json['error']['email'],
            "ValidationError (User:None) (Invalid email address: : ['email'])")

    def test_get_login_page(self):
        response = self.api.get('/login')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json['response'],
            "Welcome to the login page!")

    def test_login_success(self):
        non_existant_user = {
            'username': "testabc",
            'email': "testabc@fakemail.com",
            'password': "passwordtestabc"
        }
        response = self.api.post('/register', data=json.dumps(non_existant_user), mimetype='application/json')
        response = self.api.post('/login', data=json.dumps(non_existant_user), mimetype='application/json')
        self.assertEqual(response.status_code, 302)
        self.assertEqual(
            response.location,
            'http://localhost/welcome-protected'
        )

    def test_login_failure_no_user(self):
        non_existant_user = {
            'email': "nonexistant@fakemail.com",
            'password': "passwordnonexistant"
        }
        response = self.api.post('/login', data=json.dumps(non_existant_user), mimetype='application/json')
        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.json['error']['email'],
            "Make sure your email is correct."
        )

    def test_login_failure_bad_password(self):
        non_existant_user = {
            'username': "test123",
            'email': "test123@fakemail.com",
            'password': "passwordtest123"
        }
        response = self.api.post('/register', data=json.dumps(non_existant_user), mimetype='application/json')
        non_existant_user['password'] = "incorrectpassword"
        response = self.api.post('/login', data=json.dumps(non_existant_user), mimetype='application/json')
        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.json['error']['password'],
            "Make sure your password is correct."
        )
