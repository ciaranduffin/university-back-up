import 'package:webcalc_square/functions.dart';

import 'harness/app.dart';

Future main() async {
  final harness = Harness()..install();

  group("Unit Tests", () {
    test("square a positive number works", () {
      expect(square(2), 4);
    });
    test("square a negative number works", () {
      expect(square(-2), 4);
    });
  });

  group("Integration Tests - Response Codes", () {
    test("GET /?x=6 returns 200", () async {
      final response = await harness.agent.get("/?x=6");

      expectResponse(response, 200);
    });

    test("GET /?x=-6 returns 200", () async {
      final response = await harness.agent.get("/?x=-6");

      expectResponse(response, 200);
    });

    test("GET / returns 400", () async {
      final response = await harness.agent.get("/");

      expectResponse(response, 400);
    });

    test("GET /?=foo returns 400", () async {
      final response = await harness.agent.get("/?=foo");

      expectResponse(response, 400);
    });

    test("GET /?x=4.2 returns 400", () async {
      final response = await harness.agent.get("/?x=4.2");

      expectResponse(response, 400);
    });
  });

  group("Integration Tests - Response Bodies", () {
    test("GET /?x=6 returns Correct body", () async {
      final response = await harness.agent.get("/?x=6");

      final expectedBody = {'error': false, 'string': '6^2=36', 'answer': 36};

      expectResponse(response, 200, body: expectedBody);
    });

    test("GET /?x=-6 returns correct body", () async {
      final response = await harness.agent.get("/?x=-6");

      final expectedBody = {'error': false, 'string': '-6^2=36', 'answer': 36};

      expectResponse(response, 200, body: expectedBody);
    });

    test("GET / returns correct body", () async {
      final response = await harness.agent.get("/");

      final expectedBody = {
        'error': true,
        'string': 'Parameter x is missing.',
        'answer': 0
      };

      expectResponse(response, 400, body: expectedBody);
    });

    test("GET /?=foo returns correct body", () async {
      final response = await harness.agent.get("/?x=foo");

      final expectedBody = {
        'error': true,
        'string': 'Parameter x is non numeric.',
        'answer': 0
      };

      expectResponse(response, 400, body: expectedBody);
    });

    test("GET /?x=4.2 returns correct body", () async {
      final response = await harness.agent.get("/?x=4.2");

      final expectedBody = {
        'error': true,
        'string': 'Parameter x is not a whole number.',
        'answer': 0
      };

      expectResponse(response, 400, body: expectedBody);
    });
  });

  group("Integration Tests - Content Type", () {
    test("GET /?x=4 returns correct content type", () async {
      final response = await harness.agent.get("/?x=4");

      final exceptedHeaders = {
        'Access-Control_Allow_Origin': '*',
        'Content-Type': 'application/json; charset=utf-8',
      };

      expectResponse(response, 200, headers: exceptedHeaders);
    });
    test("GET /?x=4.2 returns correct content type", () async {
      final response = await harness.agent.get("/?x=4.2");

      final exceptedHeaders = {
        'Access-Control_Allow_Origin': '*',
        'Content-Type': 'application/json; charset=utf-8',
      };

      expectResponse(response, 400, headers: exceptedHeaders);
    });
  });
}
