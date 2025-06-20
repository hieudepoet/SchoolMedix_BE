import { transporter } from '../mailerConfig.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Tạo __dirname vì đang dùng ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export async function sendWelcomeEmail(emailTo, name, role, password) {
      const templatePath = path.resolve(__dirname, 'templates', 'welcomeEmail.html');
      console.log("Using template path:", templatePath);

      const template = fs.readFileSync(templatePath, 'utf8');
      const html = template
            .replace('{{ name }}', name)
            .replace('{{ role }}', role)
            .replace('{{ email }}', emailTo)
            .replace('{{ password }}', password);
      console.log(html);

      await transporter.sendMail({
            from: 'schoolmedix.official@gmail.com',
            to: emailTo,
            subject: 'Chào mừng tham gia Hệ thống SchoolMedix!',
            html,
      });

      console.log("Email sent to", emailTo);
}
