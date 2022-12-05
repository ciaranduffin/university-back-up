import 'package:webcalc_square/square_controller.dart';

import 'functions.dart';
import 'webcalc_square.dart';

class WebcalcSquareChannel extends ApplicationChannel {
  @override
  Future prepare() async {
    logger.onRecord.listen(
        (rec) => print("$rec ${rec.error ?? ""} ${rec.stackTrace ?? ""}"));
  }

  Controller get entryPoint {
    final router = Router();
    
    router
      .route("/")
      .link(() => SquareController());

    router
    .route("/discovery")
    .linkFunction((request) async {
        final headers = {
          'Access-Control_Allow_Origin': '*',
          'Content-Type': 'application/json',
        };

      var response = {
        "operator": "sqr",
      }; 
    
      return Response(200, headers, response);
    });

    return router;
  }
}
