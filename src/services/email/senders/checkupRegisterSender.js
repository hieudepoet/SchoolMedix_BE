import { transporter } from "../../../config/mailer.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Tạo __dirname vì đang dùng ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function sendCheckupRegister(parent_name ,student_name ,campaign_name ,description ,location ,start_date ,end_date,email ) {
    const templatePath = path.resolve(__dirname, '../templates', 'registterCheckup.html');
     console.log("Using template path:", templatePath);
    
          const template = fs.readFileSync(templatePath, 'utf8');
          const html = template
                .replace('{{ parent_name }}', parent_name)
                .replace('{{ student_name }}', student_name)
                .replace('{{ campaign_name }}', campaign_name)
                .replace('{{ location }}', location)
                .replace('{{ start_date }}', start_date)
                .replace('{{ end_date }}', end_date)
                .replace('{{ description }}', description);
          console.log(html);
    
          await transporter.sendMail({
                from: 'schoolmedix.official@gmail.com',
                to: email,
                subject: 'Khảo sát chiến dịch khám định kỳ!',
                html,
          });
    
          console.log("Email sent to", email);
}