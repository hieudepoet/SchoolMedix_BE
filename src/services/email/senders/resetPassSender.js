import { transporter } from '../../../config/mailer.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Tạo __dirname vì đang dùng ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export async function sendResetPassMail(emailTo, link) {
      const templatePath = path.resolve(__dirname, '../templates', 'resetPassEmail.html');
      console.log("Using template path:", templatePath);

      const template = fs.readFileSync(templatePath, 'utf8');
      const html = template
            .replace('{{ email }}', emailTo)
            .replace('{{ link }}', link);
      console.log(html);

      await transporter.sendMail({
            from: 'schoolmedix.official@gmail.com',
            to: emailTo,
            subject: 'Đổi mật khẩu truy cập cho hệ thống!',
            html,
      });

      console.log("Email sent to", emailTo);
}






