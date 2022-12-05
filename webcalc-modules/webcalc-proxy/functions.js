const axios = require('axios');

module.exports = {
    buildUrl: function (x, y, operator, urlsConfig) {
        var url = urlsConfig[operator];

        url += `?x=${x}`;
        if (operator != '^2') {
            url += `&y=${y}`;
        }

        return url;
    },
    checkOperatorIsValid: function (operator) {
        // should check based on what is in json
        var acceptedOperators = ['add', 'sub', 'mul', 'div', 'mod', 'sqr',];

        return acceptedOperators.includes(operator);
    },
    getOperationResult: async function (url) {
        var resp = await axios.get(url)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error);
            });

        return resp;

        // https.get(url, (resp) => {
        //     let data = '';
        //     console.log('URL:'+url);
        //     // A chunk of data has been received.
        //     resp.on('data', (chunk) => {
        //         data += chunk;
        //     });

        //     // The whole response has been received. Print out the result.
        //     resp.on('end', () => {
        //         console.log(JSON.parse(data).explanation);
        //         return resp;
        //     });

        // }).on("error", (err) => {
        //     console.log("Error: " + err.message);
        // });
    }
}