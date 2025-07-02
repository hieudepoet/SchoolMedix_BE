import { transporter } from '../../../config/mailer.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Tạo __dirname vì đang dùng ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Gửi email mời tham gia hệ thống SchoolMedix
 */
export async function sendInviteEmail(emailTo, name, role, invite_link) {
      const templatePath = path.resolve(__dirname, '../templates', 'inviteEmail.html');
      const template = fs.readFileSync(templatePath, 'utf8');

      const html = template
            .replace('{{ name }}', name)
            .replace('{{ role }}', role)
            .replace('{{ email }}', emailTo)
            .replace('{{ link }}', invite_link);

      await transporter.sendMail({
            from: 'SchoolMedix <schoolmedix.official@gmail.com>',
            to: emailTo,
            subject: '[SchoolMedix] Bạn được mời vào hệ thống y tế học đường của trường!',
            html,
      });

      console.log('✅ Email sent to', emailTo);
}
