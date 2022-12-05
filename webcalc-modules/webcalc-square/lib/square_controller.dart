import 'package:webcalc_square/functions.dart';
import 'package:webcalc_square/webcalc_square.dart';

class SquareController extends ResourceController {
  @Operation.get()
  Future<Response> getSquare({@Bind.query('x') String x}) async {
    var statusCode = 200;

    var jsonResponse = validateInput(x);

    if (jsonResponse['error'] == true) {
      statusCode = 400;
    } else {
      final answer = square(int.parse(x));
      jsonResponse = {
        "error": false,
        "string": "$x^2=$answer",
        "answer": answer,
      };
    }

    final headers = {
      'Access-Control_Allow_Origin': '*',
      'Content-Type': 'application/json',
    };

    final response = Response(statusCode, headers, jsonResponse);

    return response;
  }
}
