'use strict';

const express = require('express');
const axios = require('axios');
const firebase = require("firebase");
const functions = require('./functions');

const firebaseConfig = {
    apiKey: "AIzaSyByz5ZEn0HriM7ICNRE41jttr-XiqIMtns",
    authDomain: "webcalc-db.firebaseapp.com",
    projectId: "webcalc-db",
    storageBucket: "webcalc-db.appspot.com",
    messagingSenderId: "56647902383",
    appId: "1:56647902383:web:c54decdb1bb7a1241e205a",
    measurementId: "G-K3RD4K74HY",
    databaseURL: "https://webcalc-db-default-rtdb.europe-west1.firebasedatabase.app/"
};

firebase.initializeApp(firebaseConfig)
let database = firebase.database();

const resultsRef = database.ref("results");

const PORT = 5000;
const HOST = '0.0.0.0';


var urls = [];
var operatorUrls = {};

const app = express();
app.use(express.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*')

    var x = req.query.x;
    var y = req.query.y;
    var operator = req.query.operator;

    // If not do something
    var isOperatorValid = functions.checkOperatorIsValid(operator);

    if (!isOperatorValid) {
        res.end(JSON.stringify(
            {
                error: true,
                string: "No or invalid operator provided",
                answer: 0,
            }));
    } else {
        var url = functions.buildUrl(x, y, operator, operatorUrls);

        //Get Operation Answer
        axios.get(url)
            .then(response => {
                res.statusCode = response.status;

                res.end(JSON.stringify(response.data));
            })
            .catch(error => {
                if (error.response) {
                    res.statusCode = error.response.status;
                    res.end(JSON.stringify(error.response.data));
                } else {
                    res.end(JSON.stringify({
                        error: true,
                        string: "An unexpected error occurred",
                        answer: 0,
                    }));
                }

            });
    }
});

app.post('/write', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*')

    var data = {
        result: req.body.result,
    }

    var createdId = resultsRef.push(data, function (error) {
        if (error) {
            res.end(JSON.stringify({ result: "fail" }));

        } else {
            data = {
                result: "success",
            };
        }
    }).getKey();

    data.key = createdId;

    res.end(JSON.stringify(data));
});


app.get('/read', (req, res) => {
    var id = req.query.id;
    console.log('In read');

    resultsRef.on("value", function (snapshot) {
        console.log('In snapshot');
        console.log(snapshot);
        
        var value = snapshot.val()[id];

        console.log(value);

        if(value){
            res.end(JSON.stringify({
                error: false,
                string: "Success",
                result: value.result,
            }));
        }else{
            res.end(JSON.stringify({
                error: true,
                string: "No such record exists with that ID",
                result: 0,
            }));
        }
    }, function (_) {
        res.end(JSON.stringify({
            error: true,
            string: "An error occurred",
            result: 0,
        }));
    });

});

app.get('/online', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*')

    var jsonResponse = {
        'string': 'online',
    };

    res.end(JSON.stringify(jsonResponse));
});


app.get('/update', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*')

    var url = req.query.url;

    if (url != null) {
        sendDiscoveryRequest(url).then(_ => {
            res.end('Operator URLs: \n\n' + JSON.stringify(operatorUrls));
        }).catch(_ =>{
            res.end('Operator URLs: \n\n' + JSON.stringify(operatorUrls));
        });
    }
    else {
        res.end('Operator URLs: \n\n' + JSON.stringify(operatorUrls));
    }
});

app.get('/remove', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*')

    var operator = req.query.operator;

    if (operator != null) {
        delete operatorUrls[`${operator}`];
    }

    res.end('Updated URLs: \n' + JSON.stringify(operatorUrls));

});

if (!module.main) {
    app.listen(PORT, HOST, () => {
        console.log('Listening');
        setUpUrls();

    });
}

//Functions
async function setUpUrls() {
    urls = require('./url-config.json');

    for (var i = 0; i < urls.length; i++) {
        var url = urls[i];
        await sendDiscoveryRequest(url);
    }
}

async function sendDiscoveryRequest(url) {
    await axios.get(`${url}discovery`)
        .then(response => {
            var operator = response.data.operator;
            operatorUrls[`${operator}`] = url;

        })
        .catch(error => {
            if (error.response.status) {
                console.log(`URL ${url} return ${error.response.status}`);
            }
        });
}

module.exports = app;
