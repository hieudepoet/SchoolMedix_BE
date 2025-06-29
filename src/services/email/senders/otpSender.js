import { transporter } from '../../../config/mailer.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Tạo __dirname vì đang dùng ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export async function sendOTPEmail(emailTo, otp) {
    const templatePath = path.resolve(__dirname, '../templates', 'sendOTPEmail.html');
    console.log("Using template path:", templatePath);

    const template = fs.readFileSync(templatePath, 'utf8');
    const html = template
        .replace('{{ otp }}', otp);

    await transporter.sendMail({
        from: 'schoolmedix.official@gmail.com',
        to: emailTo,
        subject: '[SchoolMedix] Mã xác minh',
        html,
    });

    console.log("Email sent to", emailTo);
}
