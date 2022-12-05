'use strict';

const express = require('express');

const PORT = 80;
const HOST = '0.0.0.0';

var sub = require('./subtract');
var validation = require('./validate');


const app = express();
app.get('/', (req, res) => {

    var jsonResponse = {
        'error': false,
        'string': '',
        'answer': 0
    };

    var x = req.query.x;
    var y = req.query.y;

    var jsonResponse = validation.validate(x, y);

    if (jsonResponse.error) {
        res.statusCode = 400;
    }
    else {
        res.statusCode = 200;
        var answer = sub.subtract(x, y);

        jsonResponse.string = x + '-' + y + '=' + answer;
        jsonResponse.answer = answer;
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*')

    res.end(JSON.stringify(jsonResponse));
});

app.get('/online', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.statusCode = 200;

    res.end("Online");
});

app.get('/discovery', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.statusCode = 200;

    res.end(JSON.stringify({'operator':'sub'}));
});

if (!module.parent) {
    app.listen(PORT, HOST, () =>
        console.log(`Example app listening on port ${process.env.PORT}!`),
    );
}
module.exports = app;
