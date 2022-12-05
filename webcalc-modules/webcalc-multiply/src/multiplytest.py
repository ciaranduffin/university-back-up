import multiply
import unittest
from app import app

class MultiplyTest(unittest.TestCase):
    
    #||--Unit Tests--||
    def test_multiply_bothPos(self):
        self.assertEqual(multiply.multiply(2,4),8)

    def test_multiply_onePosOneNeg(self):
        self.assertEqual(multiply.multiply(-3,7),-21)

    def test_multiply_bothNeg(self):
        self.assertEqual(multiply.multiply(-7,-8),56)
    
    #||--Integration Tests--||
    def setUp(self):
        self.tester = app.test_client()
    
    
    #<--Response Codes-->

    #Check response 400
    def test_noParams_returns400(self):
        response = self.tester.get("/")
        statuscode = response.status_code
        self.assertEqual(statuscode, 400)

    #Check response 400
    def test_nonNumericParams_returns400(self):
        response = self.tester.get("/?x=foo&y=bar")
        statuscode = response.status_code
        self.assertEqual(statuscode, 400)
    
    #Check response 400
    def test_nonIntegerParams_returns400(self):
        response = self.tester.get("/?x=4.2&y=3.4")
        statuscode = response.status_code
        self.assertEqual(statuscode, 400)

    #Check response 200
    def test_validParams_bothPos_returns200(self):
        response = self.tester.get("/?x=4&y=2")
        statuscode = response.status_code
        self.assertEqual(statuscode, 200)

    def test_validParams_onePosOneNeg_returns200(self):
        response = self.tester.get("/?x=6&y=-2")
        statuscode = response.status_code
        self.assertEqual(statuscode, 200)
    
    def test_validParams_bothNeg_returns200(self):
        response = self.tester.get("/?x=-4&y=-8")
        statuscode = response.status_code
        self.assertEqual(statuscode, 200)

    #<--Response Bodies-->
    def test_missingParams_returnsCorrectBody(self):
        response = self.tester.get("/")
        body = response.data.decode("utf-8")

        expectedBody = '{"error": true, "string": "One or both required parameters (x and y) are missing.", "answer": 0}'

        self.assertEqual(body, expectedBody)

    def test_nonNumericParams_returnsCorrectBody(self):
        response = self.tester.get("/?x=foo&y=bar")
        body = response.data.decode("utf-8")

        expectedBody = '{"error": true, "string": "One or both required parameters (x and y) are non numeric.", "answer": 0}'

        self.assertEqual(body, expectedBody)
    
    def test_nonIntegerParams_returnsCorrectBody(self):
        response = self.tester.get("/?x=2.4&y=3.2")
        body = response.data.decode("utf-8")

        expectedBody = '{"error": true, "string": "One or both required parameters (x and y) are not whole numbers.", "answer": 0}'

        self.assertEqual(body, expectedBody)

    def test_validParams_bothPos_returnsCorrectBody(self):
        response = self.tester.get("/?x=4&y=2")
        body = response.data.decode("utf-8")

        expectedBody = '{"error": false, "string": "4*2=8", "answer": 8}'

        self.assertEqual(body, expectedBody)

    def test_validParams_onePosOneNeg_returnsCorrectBody(self):
        response = self.tester.get("/?x=4&y=-2")
        body = response.data.decode("utf-8")

        expectedBody = '{"error": false, "string": "4*-2=-8", "answer": -8}'

        self.assertEqual(body, expectedBody)
    
    def test_validParams_bothNeg_returnsCorrectBody(self):
        response = self.tester.get("/?x=-4&y=-2")
        body = response.data.decode("utf-8")

        expectedBody = '{"error": false, "string": "-4*-2=8", "answer": 8}'

        self.assertEqual(body, expectedBody)

    #<--Content Type-->
    def test_validParams_bothPos_returnsCorrectContentType(self):
        response = self.tester.get("/?x=4&y=2")
        contentType = response.content_type

        expectedContentType = 'application/json'

        self.assertEqual(contentType, expectedContentType)

    def test_invalidParams_returnsCorrectContentType(self):
        response = self.tester.get("/?x=foo&y=bar")
        contentType = response.content_type

        expectedContentType = 'application/json'

        self.assertEqual(contentType, expectedContentType)

if __name__ == "__main__":
    unittest.main()