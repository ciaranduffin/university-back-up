var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587,
    auth: {
        user: 'webcalc.40204578@outlook.com',
        pass: 'Webcalc.01'
    },
    tls: {
        ciphers: 'SSLv3'
    }
});


module.exports = {
    sendEmail: function (mailOptions) {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    },

    sendServiceOfflineEmail: function (serviceUrl, lastChecked) {
        var mailOptions = {
            from: 'webcalc.40204578@outlook.com',
            to: 'cduffin12@qub.ac.uk',
            subject: 'Service Tast Failed',
            text: `The following services test have failed since last checked at ${lastChecked}:\n${serviceUrl}`
        };

        this.sendEmail(mailOptions);
    }
}