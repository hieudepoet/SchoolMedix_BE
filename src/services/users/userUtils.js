import { query } from "../../config/database.js";

export async function generateStudentCode(year) {
  const yy = String(year).slice(-2);

  const { rows } = await query(`
    INSERT INTO student_code_counter (year_of_enrollment, last_number)
    VALUES ($1, 1000)
    ON CONFLICT (year_of_enrollment)
    DO UPDATE SET last_number = student_code_counter.last_number + 1
    RETURNING last_number;
  `, [year]);

  const num = rows[0].last_number;
  const padded = String(num);
  return `${yy}${padded}`;
}

export function generateRandomPassword() {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!#$%';

  const allChars = uppercase + lowercase + numbers + special;
  const getRandom = (chars) => chars[Math.floor(Math.random() * chars.length)];

  let password = [
    getRandom(uppercase),
    getRandom(lowercase),
    getRandom(numbers),
    getRandom(special),
  ];

  for (let i = 0; i < 4; i++) {
    password.push(getRandom(allChars));
  }

  return password.sort(() => Math.random() - 0.5).join('');
}
