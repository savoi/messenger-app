from test.test_base import TestBase

from mongoengine import connect, disconnect


class HomeHandlerTest(TestBase):

    @classmethod
    def setUpClass(cls):
        disconnect()
        connect('mongoenginetest', host='mongomock://localhost', alias='default')

    @classmethod
    def tearDownClass(cls):
       disconnect()

    def test_welcome(self):
        response = self.api.get('/welcome')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json['welcomeMessage'],
            'Welcome!')

    def test_welcome_protected_unauthorized(self):
        response = self.api.get('/welcome-protected')
        self.assertEqual(response.status_code, 302)
