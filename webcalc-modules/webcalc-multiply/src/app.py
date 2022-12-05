from flask import Flask
from flask import request
from flask import Response
import multiply
import json
import helpers
import numbers

app = Flask(__name__)

@app.route('/')
def mult():
    statusCode = 200
    
    x = request.args.get('x')
    y = request.args.get('y')

    jsonResponse = validateInputs(x,y)

    if (jsonResponse.get("error") is True):
        statusCode = 400
    else:
        answer = multiply.multiply(int(x), int(y))
        jsonResponse = {
            "error": False,
            "string": f"{x}*{y}={answer}",
            "answer": answer,
        }
    
    reply = json.dumps(jsonResponse)
    r = Response(response=reply, status=statusCode)
    r.headers["Content-Type"]="application/json"
    r.headers["Access-Control-Allow-Origin"] = "*"
    return r

@app.route('/discovery')
def discovery():
    jsonResponse = {
        "operator": "mul",
    }

    reply = json.dumps(jsonResponse)
    r = Response(response=reply, status=200)
    r.headers["Content-Type"]="application/json"
    r.headers["Access-Control-Allow-Origin"] = "*"
    return r

def validateInputs(x,y):
    jsonResponse = {
        "error": False,
        "string": "",
        "answer":0,
    }
    
    #Check inputs not null
    if x is None or y is None:
        jsonResponse = {
        "error": True,
        "string": "One or both required parameters (x and y) are missing.",
        "answer":0,
        }

    #Check inputs are numeric
    elif not helpers.string_is_number(x) or not helpers.string_is_number(y):
        jsonResponse = {
        "error": True,
        "string": "One or both required parameters (x and y) are non numeric.",
        "answer":0,
        }

    #Check inputs are whole numbers
    elif not helpers.string_is_int(x) or not helpers.string_is_int(y):
        jsonResponse = {
        "error": True,
        "string": "One or both required parameters (x and y) are not whole numbers.",
        "answer":0,
        }
    
    return jsonResponse

if __name__ == '__main__':
    app.run(host="0.0.0.0",port=5000)