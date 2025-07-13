import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

export function generateHealthRecordsHtmlFromJson(record) {
  console.log(record);
  const rowsHtml = Object.entries(record).map(([key, value]) => `
    <tr>
      <th>${key}</th>
      <td>${value ?? ''}</td>
    </tr>
  `).join('');

  const recordId = record["Mã hồ sơ"] || record["Mã khám"] || Object.values(record)[0] || "Không rõ";

  return `
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
          }
          h2 {
            text-align: center;
            margin-bottom: 12px;
          }
          h3 {
            text-align: center;
            margin-bottom: 24px;
            font-weight: normal;
            color: #555;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
            vertical-align: top;
          }
          th {
            width: 30%;
            background-color: #f9f9f9;
          }
        </style>
      </head>
      <body>
        <h2>Phiếu Kết Quả Khám Sức Khỏe</h2>
        <h3>Mã hồ sơ: ${recordId}</h3>
        <table>
          ${rowsHtml}
        </table>
      </body>
    </html>
  `;
}


export async function generateFinalHealthReportHTML(campaign_info, student_profile, general_health, specialist_exam_records) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const templatePath = path.resolve(__dirname, "final-report-template.html");
  let template = fs.readFileSync(templatePath, 'utf8');

  let finalSpecialistExamRecords = "";
  for (let i = 0; i < specialist_exam_records.length; i++) {
    finalSpecialistExamRecords += generateSpecialListPart(i, specialist_exam_records[i]);
  }
  if (!finalSpecialistExamRecords) finalSpecialistExamRecords = "<span>Học sinh không đăng ký khám chuyên khoa!</span>";

  template = template
    .replaceAll("{{ camp_start_date }}", formatDate(campaign_info.start_date))
    .replaceAll("{{ camp_end_date }}", formatDate(campaign_info.end_date))
    .replaceAll("{{ camp_location }}", campaign_info.location)
    .replaceAll("{{ camp_name }}", campaign_info.name)
    .replaceAll("{{ register_id }}", general_health.register_id)
    .replaceAll("{{ stu_id }}", student_profile.id)
    .replaceAll("{{ stu_name }}", student_profile.name)
    .replaceAll("{{ stu_dob }}", formatDate(student_profile.dob))
    .replaceAll("{{ stu_sex }}", student_profile.ismale ? "Nam" : "Nữ")
    .replaceAll("{{ stu_address }}", student_profile.address)
    .replaceAll("{{ stu_phone_number }}", student_profile.phone_number || "--")
    .replaceAll("{{ stu_profile_img_url }}", student_profile.profile_img_url)
    .replaceAll("{{ stu_year_of_enrollment }}", student_profile.year_of_enrollment)
    .replaceAll("{{ stu_email }}", student_profile.email || "--")
    .replaceAll("{{ stu_class_name }}", student_profile.class_name || "--")

    .replaceAll("{{ dad_name }}", student_profile.dad_profile?.name || "--")
    .replaceAll("{{ dad_dob }}", formatDate(student_profile.dad_profile?.dob) || "--")
    .replaceAll("{{ dad_ocupation }}", student_profile.dad_profile?.occupation || "--")
    .replaceAll("{{ dad_email }}", student_profile.dad_profile?.email || "--")
    .replaceAll("{{ dad_phone_number }}", student_profile.dad_profile?.phone_number || "--")
    .replaceAll("{{ dad_address }}", student_profile.dad_profile?.address || "--")

    .replaceAll("{{ mom_name }}", student_profile.mom_profile?.name || "--")
    .replaceAll("{{ mom_dob }}", formatDate(student_profile.mom_profile?.dob) || "--")
    .replaceAll("{{ mom_ocupation }}", student_profile.mom_profile?.occupation || "--")
    .replaceAll("{{ mom_email }}", student_profile.mom_profile?.email || "--")
    .replaceAll("{{ mom_phone_number }}", student_profile.mom_profile?.phone_number || "--")
    .replaceAll("{{ mom_address }}", student_profile.mom_profile?.address || "--")

    .replaceAll("{{ height }}", general_health.height || "--")
    .replaceAll("{{ weight }}", general_health.weight || "--")
    .replaceAll("{{ blood_pressure }}", general_health.blood_pressure || "--")
    .replaceAll("{{ left_eye }}", general_health.left_eye || "--")
    .replaceAll("{{ right_eye }}", general_health.right_eye || "--")
    .replaceAll("{{ ear }}", general_health.ear || "--")
    .replaceAll("{{ nose }}", general_health.nose || "--")
    .replaceAll("{{ throat }}", general_health.throat || "--")
    .replaceAll("{{ teeth }}", general_health.teeth || "--")
    .replaceAll("{{ gums }}", general_health.gums || "--")
    .replaceAll("{{ skin_condition }}", general_health.skin_condition || "--")
    .replaceAll("{{ heart }}", general_health.heart || "--")
    .replaceAll("{{ lungs }}", general_health.lungs || "--")
    .replaceAll("{{ spine }}", general_health.spine || "--")
    .replaceAll("{{ posture }}", general_health.posture || "--")
    .replaceAll("{{ final_diagnosis }}", general_health.final_diagnosis || "--")
    .replaceAll("{{ general_health_record_date }}", formatDate(general_health.date_record, true) || "--")
    .replaceAll("{{ specialist_exam_records }}", finalSpecialistExamRecords);

  fs.writeFileSync('./test.html', template, 'utf8');

  return template;
}

export function generateSpecialListPart(index, record) {
  const { record_urls = [], specialist_name, doctor_name, result, diagnosis, date_record } = record;
  console.log(record_urls);

  let images_text = '';
  for (const url of record_urls) {
    images_text += `<img
              src="${url}"
              alt="Tài liệu khám chuyên khoa"
            />`;
  }

  if (!images_text) images_text = "<span>Không có tài liệu liên quan!</span>";

  return `<div class="specialty-section">
          <div class="field">
            <label style="font-weight: bold">${index + 1}. Chuyên khoa:</label>
            <span>${specialist_name}</span>
          </div>
          <div class="field">
            <label style="font-weight: bold">Bác sĩ:</label>
            <span>${doctor_name}</span>
          </div>
          <div class="field">
            <label style="font-weight: bold">Kết quả:</label>
            <span>${result}</span>
          </div>
          <div class="field">
            <label style="font-weight: bold">Chẩn đoán:</label>
            <span>${diagnosis}</span>
          </div>
          <div class="field">
            <label style="font-weight: bold">Ngày ghi nhận:</label>
            <span>${formatDate(date_record, true)}</span>
          </div>
          <div class="field">
            <label style="font-weight: bold">Tài liệu:</label>
          </div>
          <div class="images">
            ${images_text}
          </div>
        </div>`;
}

function formatDate(dateInput, withTime = false) {
  if (!dateInput) return "--";

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "--"; // Invalid date

  const pad = (n) => n.toString().padStart(2, '0');

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return withTime
    ? `${hours}:${minutes} ${day}/${month}/${year}`
    : `${day}/${month}/${year}`;
}
