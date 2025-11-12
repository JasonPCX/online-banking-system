import nodemailer from 'nodemailer';
import { ENV } from './env.js';

const config = {
    development: {
        host: ENV.MAIL_HOST,
        port: ENV.MAIL_PORT,
        secure: false,
    },
    test: {
        host: ENV.MAIL_HOST,
        port: ENV.MAIL_PORT,
        secure: false,
    },
    production: {
        host: ENV.MAIL_HOST,
        port: ENV.MAIL_PORT,
        secure: ENV.MAIL_SECURE,
        auth: {
            user: ENV.MAIL_USERNAME,
            pass: ENV.MAIL_PASSWORD,
        },
    }
}

const transporter = nodemailer.createTransport(config[ENV.NODE_ENV]);


export async function sendMail({ recipient, subject, text, html }) {
    // Message object
    const message = {
        from: ENV.MAIL_FROM,
        to: recipient,
        subject,
        text,
        html,
    };

    try {
        const info = await transporter.sendMail(message);
        console.log("Message sent: %s", info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
        console.log("Error occurred when a mail was tried to be sent. " + err.message);
        process.exit(1);
    }
}