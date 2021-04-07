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
            response.json['success'],
            "User successfully registered!")

    def test_register_user_already_exists(self):
        new_user = {
            'username': "John",
            'email': "john@fakemail.com",
            'password': "passwordjohn"
        }
        response1 = self.api.post('/register', data=json.dumps(new_user), mimetype='application/json')
        response2 = self.api.post('/register', data=json.dumps(new_user), mimetype='application/json')
        self.assertEqual(response2.status_code, 422)
        self.assertEqual(
            response2.json['error']['not_unique'],
            "That email/username already exists.")

    def test_register_username_already_exists(self):
        new_user = {
            'username': "jupiter",
            'email': "jupiter@hellomail.com",
            'password': "passwordjupiter"
        }
        new_user_2 = {
            'username': "jupiter",
            'email': "jupiter@fakemail.com",
            'password': "passwordjupiter"
        }
        response1 = self.api.post('/register', data=json.dumps(new_user), mimetype='application/json')
        response2 = self.api.post('/register', data=json.dumps(new_user_2), mimetype='application/json')
        self.assertEqual(response2.status_code, 422)
        self.assertEqual(
            response2.json['error']['not_unique'],
            "That email/username already exists.")

    def test_register_missing_email(self):
        new_user = {
            'username': "Chris",
            'email': "",
            'password': "passwordchris"
        }
        response = self.api.post('/register', data=json.dumps(new_user), mimetype='application/json')
        self.assertEqual(response.status_code, 422)
        self.assertEqual(
            response.json['error']['validation_error'],
            "ValidationError (User:None) (Invalid email address: : ['email'])")

    def test_register_username_too_short(self):
        new_user = {
            'username': "A",
            'email': "abcdefg@fakemail.com",
            'password': "passworda"
        }
        response = self.api.post('/register', data=json.dumps(new_user), mimetype='application/json')
        self.assertEqual(response.status_code, 422)
        self.assertEqual(
            response.json['error']['username'],
            "Your username must be at least 2 characters."
        )

    def test_login_success(self):
        non_existant_user = {
            'username': "testabc",
            'email': "testabc@fakemail.com",
            'password': "passwordtestabc"
        }
        response = self.api.post('/register', data=json.dumps(non_existant_user), mimetype='application/json')
        response = self.api.post('/login', data=json.dumps(non_existant_user), mimetype='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(
            response.json['success'],
            "User login successful!"
        )

    def test_login_failure_no_user(self):
        non_existant_user = {
            'email': "nonexistant@fakemail.com",
            'password': "passwordnonexistant"
        }
        response = self.api.post('/login', data=json.dumps(non_existant_user), mimetype='application/json')
        self.assertEqual(response.status_code, 422)
        self.assertEqual(
            response.json['error']['auth'],
            "The email/password is incorrect."
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
        self.assertEqual(response.status_code, 422)
        self.assertEqual(
            response.json['error']['auth'],
            "The email/password is incorrect."
        )
