const express = require('express');
const axios = require('axios');
const fs = require('fs');
const moment = require('moment');
var mailer = require('./mailer');

const PORT = 5000;
const HOST = '0.0.0.0';

const app = express();

const schedule = require('node-schedule');


const { response } = require('express');


const runTests = async function(){
    var testsToRun = require('./service-tests.json');
    
    var goneOffline = [];
    var now = moment().format('DD/MM/YYYY HH:mm');

    for (var i = 0; i < testsToRun.length; i++) {
        var url = `${testsToRun[i].url}?x=${testsToRun[i].x}&y=${testsToRun[i].y}`;

        var returnedResult;

        //start performance timer
        const NS_PER_SEC = 1e9;
        const MS_PER_NS = 1e-6
        const time = process.hrtime();

        await axios.get(url).then(response => {
            testsToRun[i].lastChecked = `${now}`;
            returnedResult = JSON.stringify(response.data);
            if (response.status == 200 && JSON.stringify(response.data) == testsToRun[i].expectedResponse) {
                testsToRun[i].status = 'Passed';
            } else {
                if (testsToRun[i].status == 'Passed') {
                    goneOffline.push(testsToRun[i]);
                }
                testsToRun[i].status = 'Failed';
            }
        }).catch(error => {
            //If service was Online and has gone off in the past half hour, notify by email
            returnedResult = JSON.stringify(error.message);
            if (testsToRun[i].status == 'Passed') {
                goneOffline.push(testsToRun[i]);
            }
            testsToRun[i].status = 'Failed';
            testsToRun[i].lastChecked = `${now}`;
        });

        //record time take for response
        const diff = process.hrtime(time);
        var timeInMs = `${ (diff[0] * NS_PER_SEC + diff[1])  * MS_PER_NS}`


        var data = fs.readFileSync(`./test_logs/${testsToRun[i].operation}-logs.txt`); //read existing contents into data
        var fd = fs.openSync(`./test_logs/${testsToRun[i].operation}-logs.txt`, 'w+');
        var buffer = Buffer.from(`[Test Completed] - [${testsToRun[i].lastChecked}] - [${testsToRun[i].status}] - [Expected: ${testsToRun[i].expectedResponse}, Actual: ${returnedResult}] - [Response Time: ${timeInMs} ms] \n`);

        fs.writeSync(fd, buffer, 0, buffer.length, 0); //write new data
        fs.writeSync(fd, data, 0, data.length, buffer.length); //a  
    }

    fs.writeFile('service-tests.json', JSON.stringify(testsToRun), (err) => {
        if (err) {
            throw err;
        }
    });

    if (goneOffline.length > 0) {
        var emailString = '';
        var lastChecked = goneOffline[0].lastChecked;

        goneOffline.forEach(element => {
            emailString += element.url +'\n';
        });

        try {
            mailer.sendServiceOfflineEmail(emailString, lastChecked);
        }catch(error){
            console.log('Email failed to send');
        }
    }
}


//Schedule tests to run every half hour on the 0th minute
const onlineCheck = schedule.scheduleJob('*/30 * * * *', async function () {
    runTests();
});

app.use(express.json());

app.get('/', (req, res) => {
    var currentUrlStatuses = require('./service-tests.json');

    html = '<h1>Monitoring and Metrics</h1>';

    html += '<h2>Service Statuses</h2>';
    html += '<table style="width:100%; border: 1px solid black;">';
    html += `<tr>
            <th style="border: 1px solid black;">URL</th>
            <th style="border: 1px solid black;">Status</th>
            <th style="border: 1px solid black;">Last Checked</th>
            </tr>`;

    for (var i = 0; i < currentUrlStatuses.length; i++) {
        var obj = currentUrlStatuses[i];
        html += `<tr>
                    <td style="border: 1px solid black;">${obj.url}    -   <a href=/logs/?operation=${obj.operation}>View Logs</a></td>
                    <td style="border: 1px solid black;">${obj.status}</td>
                    <td style="border: 1px solid black;">${obj.lastChecked}</td>
                </tr>`;
    }
    html += '</table>';

    html += '<br/>';
    html += '<a href="runtests"><b>Click to run tests</b><a/>';
    res.end(html);
});


app.get('/runtests', async (req, res) => {
    await runTests();
    res.redirect('/');
});


app.get('/logs', async (req, res) => {
    var operation = req.query.operation;
    fs.readFile(`./test_logs/${operation}-logs.txt`, 'utf8', function(err, data) {
        if (err) throw err;
        res.end(data);
      });
});


if (!module.parent) {
    app.listen(PORT, HOST, () =>
        console.log(`Example app listening on port ${process.env.PORT}!`),
    );
}
module.exports = app;