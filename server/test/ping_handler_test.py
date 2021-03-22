from test.test_base import TestBase
import json


class PingHandlerTest(TestBase):

    def test_ping(self):
        response = self.api.post('/ping', data=json.dumps({'message': 'hello'}))

        self.assertDictEqual(
            response.json, {
                'response': 'Server is running. Message received: hello'})
