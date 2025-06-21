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
