import { query } from "../config/database.js";

export async function getDiseaseOfStudent(req, res) {
  const { student_id } = req.params;
  try {
    const result = await query(`
      SELECT dr.*, d.name AS disease_name
      FROM disease_record dr
      JOIN disease d ON dr.disease_id = d.id
      WHERE dr.student_id = $1
    `, [student_id]);

    return res.status(200).json({
      error: false,
      message: "Lấy danh sách bệnh học sinh thành công",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching disease records:", error);
    return res.status(500).json({
      error: true,
      message: "Lỗi server khi lấy danh sách bệnh",
    });
  }
}

export async function recordDiseaseOfStudent(req, res) {
  const { student_id } = req.params;
  const { disease_id, diagnosis, detect_date, cure_date, location_cure } = req.body;

  try {
    const result = await query(`
      INSERT INTO disease_record (
        student_id, disease_id, diagnosis, detect_date, cure_date, location_cure
      )
      VALUES ($1, $2, $3, $4, $5, $6) returning *
    `, [student_id, disease_id, diagnosis, detect_date, cure_date, location_cure]);

    return res.status(201).json({
      error: false,
      message: "Ghi nhận bệnh cho học sinh thành công",
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Error recording disease:", error);
    return res.status(500).json({
      error: true,
      message: "Lỗi server khi ghi nhận bệnh",
    });
  }
}
