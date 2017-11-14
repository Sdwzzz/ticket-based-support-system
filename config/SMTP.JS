// SMTP server configuration file
// dependencies
const nodemailer = require("nodemailer");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// smtp configuration
const SMTP = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: "coolnuke477@gmail.com",
        pass: "badboy333"
    }
});

module.exports = SMTP;