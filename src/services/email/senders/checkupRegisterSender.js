import { transporter } from "../../../config/mailer.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Tạo __dirname vì đang dùng ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function sendCheckupRegister(parent_list, name, description, location, start_date, end_date) {
      const templatePath = path.resolve(__dirname, '../templates', 'registterCheckup.html');
      console.log("Using template path:", templatePath);
      const template = fs.readFileSync(templatePath, 'utf8');


      const sendEmailPromises = parent_list.map(
            (parent) => {


                  const html = template
                        .replace('{{ parent_name }}', parent.parent_name)
                        .replace('{{ student_name }}', parent.student_name)
                        .replace('{{ campaign_name }}', name)
                        .replace('{{ location }}', location)
                        .replace('{{ start_date }}', start_date)
                        .replace('{{ end_date }}', end_date)
                        .replace('{{ description }}', description)
                        .replace('{{ link }}', `${process.env.FIREBASE_FE_DEPLOYING_URL}/parent`);

                  return transporter.sendMail({
                        from: 'schoolmedix.official@gmail.com',
                        to: parent.email,
                        subject: 'Khảo sát chiến dịch khám định kỳ!',
                        html,
                  });
            });
      try {
            const results = await Promise.allSettled(sendEmailPromises);

            results.forEach((res, index) => {
                  const email = parent_list[index].email;
                  if (res.status === 'fulfilled') {
                        console.log(`✅ Email sent to ${email}`);
                  } else {
                        console.error(`❌ Failed to send to ${email}: ${res.reason.message}`);
                  }
            });
      } catch (error) {
            console.error("❌ Error while sending bulk emails:", error.message);
      }

}