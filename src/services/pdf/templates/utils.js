import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

export function generateHealthRecordsHtmlFromJson(record) {
  const rowsHtml = Object.entries(record).map(
    ([key, value]) => `
    <tr>
      <th>${key}</th>
      <td>${value ?? ''}</td>
    </tr>
  `
  ).join('');

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

export function generateFinalHealthReportHTML(campaign_info, student_profile, general_health, specialist_exam_records) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const templatePath = path.resolve(__dirname, "final-report-template.html");
  let template = fs.readFileSync(templatePath, 'utf8'); // ✅ FIXED

  const specialistContent = (specialist_exam_records?.length)
    ? specialist_exam_records.map(generateSpecialListPart).join("")
    : "<span>Học sinh không đăng ký khám chuyên khoa!</span>";

  const replaceMap = {
    "{{ camp_start_date }}": formatDate(campaign_info.start_date),
    "{{ camp_end_date }}": formatDate(campaign_info.end_date),
    "{{ camp_location }}": campaign_info.location,
    "{{ camp_name }}": campaign_info.name,
    "{{ register_id }}": general_health.register_id,
    "{{ stu_id }}": student_profile.id,
    "{{ stu_name }}": student_profile.name,
    "{{ stu_dob }}": formatDate(student_profile.dob),
    "{{ stu_sex }}": student_profile.ismale ? "Nam" : "Nữ",
    "{{ stu_address }}": student_profile.address,
    "{{ stu_phone_number }}": student_profile.phone_number || "--",
    "{{ stu_profile_img_url }}": student_profile.profile_img_url,
    "{{ stu_year_of_enrollment }}": student_profile.year_of_enrollment,
    "{{ stu_email }}": student_profile.email || "--",
    "{{ stu_class_name }}": student_profile.class_name || "--",
    "{{ dad_name }}": student_profile.dad_profile?.name || "--",
    "{{ dad_dob }}": formatDate(student_profile.dad_profile?.dob) || "--",
    "{{ dad_ocupation }}": student_profile.dad_profile?.occupation || "--",
    "{{ dad_email }}": student_profile.dad_profile?.email || "--",
    "{{ dad_phone_number }}": student_profile.dad_profile?.phone_number || "--",
    "{{ dad_address }}": student_profile.dad_profile?.address || "--",
    "{{ mom_name }}": student_profile.mom_profile?.name || "--",
    "{{ mom_dob }}": formatDate(student_profile.mom_profile?.dob) || "--",
    "{{ mom_ocupation }}": student_profile.mom_profile?.occupation || "--",
    "{{ mom_email }}": student_profile.mom_profile?.email || "--",
    "{{ mom_phone_number }}": student_profile.mom_profile?.phone_number || "--",
    "{{ mom_address }}": student_profile.mom_profile?.address || "--",
    "{{ height }}": general_health.height || "--",
    "{{ weight }}": general_health.weight || "--",
    "{{ blood_pressure }}": general_health.blood_pressure || "--",
    "{{ left_eye }}": general_health.left_eye || "--",
    "{{ right_eye }}": general_health.right_eye || "--",
    "{{ ear }}": general_health.ear || "--",
    "{{ nose }}": general_health.nose || "--",
    "{{ throat }}": general_health.throat || "--",
    "{{ teeth }}": general_health.teeth || "--",
    "{{ gums }}": general_health.gums || "--",
    "{{ skin_condition }}": general_health.skin_condition || "--",
    "{{ heart }}": general_health.heart || "--",
    "{{ lungs }}": general_health.lungs || "--",
    "{{ spine }}": general_health.spine || "--",
    "{{ posture }}": general_health.posture || "--",
    "{{ final_diagnosis }}": general_health.final_diagnosis || "--",
    "{{ general_health_record_date }}": formatDate(general_health.date_record, true) || "--",
    "{{ specialist_exam_records }}": specialistContent,
  };

  for (const [key, value] of Object.entries(replaceMap)) {
    template = template.split(key).join(value);
  }

  return template;
}

function generateSpecialListPart(record, index) {
  const {
    record_urls = [],
    specialist_name,
    doctor_name,
    result,
    diagnosis,
    date_record
  } = record;

  const imagesHTML = record_urls.length > 0
    ? record_urls.map(url => `<img src="${url}" alt="Tài liệu khám chuyên khoa"/>`).join("")
    : "<span>Không có tài liệu liên quan!</span>";

  return `
    <div class="specialty-section">
      <div class="field"><label><b>${index + 1}. Chuyên khoa:</b></label><span>${specialist_name}</span></div>
      <div class="field"><label><b>Bác sĩ:</b></label><span>${doctor_name}</span></div>
      <div class="field"><label><b>Kết quả:</b></label><span>${result}</span></div>
      <div class="field"><label><b>Chẩn đoán:</b></label><span>${diagnosis}</span></div>
      <div class="field"><label><b>Ngày ghi nhận:</b></label><span>${formatDate(date_record, true)}</span></div>
      <div class="field"><label><b>Tài liệu:</b></label></div>
      <div class="images">${imagesHTML}</div>
    </div>
  `;
}

function formatDate(dateInput, withTime = false) {
  if (!dateInput) return "--";
  const date = new Date(dateInput);
  if (isNaN(date)) return "--";

  const pad = n => String(n).padStart(2, '0');
  const d = pad(date.getDate());
  const m = pad(date.getMonth() + 1);
  const y = date.getFullYear();
  const h = pad(date.getHours());
  const min = pad(date.getMinutes());

  return withTime ? `${h}:${min} ${d}/${m}/${y}` : `${d}/${m}/${y}`;
}
