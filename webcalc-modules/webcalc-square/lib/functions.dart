int square(int x) {
  return x * x;
}

Map<String, Object> validateInput(String x) {
  var jsonResponse = {
    "error": false,
    "string": "",
    "answer": 0,
  };

  //Check x is not null
  if (x == null) {
    jsonResponse = {
      "error": true,
      "string": "Parameter x is missing.",
      "answer": 0,
    };
  }
  //Check x is numeric
  else if (!isNumeric(x)){
    jsonResponse = {
      "error": true,
      "string": "Parameter x is non numeric.",
      "answer": 0,
    };
  }
  //Check x is a whole number
  else if (!isInteger(x)){
    jsonResponse = {
      "error": true,
      "string": "Parameter x is not a whole number.",
      "answer": 0,
    };
  }

  return jsonResponse;
}

bool isNumeric(String s) {
  if (s == null){
    return false;
  }
  return double.tryParse(s) != null;
}

bool isInteger(String s){
  if (s == null){
    return false;
  }
  return int.tryParse(s) != null;
}
