import e from "express";
import { query, pool } from "../config/database.js";

// Vaccine
export async function createVaccine(req, res) {
  const { name, description, disease_list } = req.body;

  // Kiểm tra input
  if (!name || !description) {
    return res
      .status(400)
      .json({ error: true, message: "Missing required fields" });
  }

  if (!Array.isArray(disease_list) || disease_list.length === 0) {
    return res.status(400).json({
      error: true,
      message: "disease_list must have at least one item",
    });
  }

  const client = await pool.connect();

  try {
    // Bắt đầu transaction
    await client.query("BEGIN");

    // Kiểm tra vaccine đã tồn tại
    const vaccineCheck = await client.query(
      "SELECT * FROM vaccine WHERE name = $1",
      [name]
    );
    if (vaccineCheck.rows[0]) {
      await client.query("ROLLBACK");
      return res
        .status(409)
        .json({ error: true, message: `Vaccine ${name} already exists` });
    }

    // Kiểm tra disease_id trong disease_list
    const diseaseCheck = await client.query(
      `SELECT id FROM disease WHERE id = ANY($1::int[])`,
      [disease_list]
    );
    const foundDiseaseIds = diseaseCheck.rows.map((row) => row.id);
    const missingIds = disease_list.filter(
      (id) => !foundDiseaseIds.includes(id)
    );
    if (missingIds.length > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        error: true,
        message: `Các disease_id sau không tồn tại: ${missingIds.join(", ")}`,
      });
    }

    // Chèn vaccine
    const insertVaccineQuery = `
      INSERT INTO vaccine (name, description)
      VALUES ($1, $2)
      RETURNING id, name, description;
    `;
    const vaccineResult = await client.query(insertVaccineQuery, [
      name,
      description,
    ]);
    const newVaccine = vaccineResult.rows[0];

    // Chèn liên kết vaccine_disease
    const insertVaccineDiseaseQuery = `
      INSERT INTO vaccine_disease (vaccine_id, disease_id)
      VALUES ${disease_list.map((_, i) => `($1, $${i + 2})`).join(", ")}
    `;
    await client.query(insertVaccineDiseaseQuery, [
      newVaccine.id,
      ...disease_list,
    ]);

    // Commit transaction
    await client.query("COMMIT");

    // Trả về kết quả
    return res.status(201).json({
      error: false,
      data: {
        id: newVaccine.id,
        name: newVaccine.name,
        description: newVaccine.description,
        disease_list,
      },
    });
  } catch (error) {
    // Rollback nếu có lỗi
    await client.query("ROLLBACK");
    console.error("Error creating vaccine:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  } finally {
    client.release();
  }
}

// Lấy tất cả vaccine (list)
export async function getAllVaccines(req, res) {
  try {
    const result = await query(`
      SELECT 
        v.id,
        v.name,
        v.origin,
        v.description,
        STRING_AGG(d.name, ', ') AS diseases
      FROM vaccine v
      LEFT JOIN vaccine_disease vd ON v.id = vd.vaccine_id
      LEFT JOIN disease d ON vd.disease_id = d.id
      GROUP BY v.id
      ORDER BY v.id;
    `);

    return res.status(200).json({
      error: false,
      message: "Lấy danh sách vaccine thành công",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching vaccines:", error);
    return res.status(500).json({
      error: true,
      message: "Lỗi server khi lấy danh sách vaccine",
    });
  }
}

// Cập nhật thông tin vaccine vaccine
export async function updateVaccine(req, res) {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const result = await query(
      `
        UPDATE vaccine
        SET
          name = $1,
          description = $2
        WHERE id = $3
      `,
      [name, description, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: true,
        message: "Không tìm thấy thông tin vaccine",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Cập nhật thông tin vaccine thành công!",
    });
  } catch (error) {
    console.error("Error fetching vaccines:", error);
    return res.status(500).json({
      error: true,
      message: "Lỗi server khi lấy danh sách vaccine",
    });
  }
}

// Xóa bản ghi vaccine
export async function deleteVaccine(req, res) {
  const { id } = req.params;

  try {
    const result = await query(
      `
        DELETE FROM vaccine
        WHERE id = $1
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: true,
        message: "Không tìm thấy thông tin vaccine",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Xóa thông tin vaccine thành công",
    });
  } catch (error) {
    console.log("Error fetching vaccines:", error);
    return res.status(500).json({
      error: true,
      message: "Lỗi server khi lấy danh sách vaccine",
    });
  }
}
// Lấy thông tin một loại vaccine
export async function getVaccine(req, res) {
  const { id } = req.params;

  try {
    const result = await query(
      `
      SELECT 
        v.id, 
        v.name, 
        v.description
      FROM vaccine v
      WHERE v.id = $1;
    `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: true,
        message: "Không tìm thấy thông tin vaccine",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Lấy thông tin vaccine thành công",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching vaccines:", error);
    return res.status(500).json({
      error: true,
      message: "Lỗi server khi lấy thông tin vaccine",
    });
  }
}

/**
 * Lấy tất cả các bệnh mà một loại vaccine phòng ngừa
 * GET /vaccines/:id/diseases
 */
export async function getDiseasesByVaccine(req, res) {
  const { id } = req.params;

  try {
    const result = await query(
      `
        SELECT d.id, d.name, d.description
        FROM disease d
        INNER JOIN vaccine_disease vd ON vd.disease_id = d.id
        WHERE vd.vaccine_id = $1
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: true,
        message: "Không tìm thấy bệnh nào cho vaccine này",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Lấy danh sách bệnh thành công",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching diseases of vaccine:", error);
    return res.status(500).json({
      error: true,
      message: "Lỗi server khi lấy danh sách bệnh của vaccine",
    });
  }
}

export async function getStudentsByVaccine(req, res) {
  const { vaccine_id } = req.params;

  if (!vaccine_id) {
    return res.status(400).json({
      error: true,
      message: "Thiếu vaccine_id",
    });
  }

  try {
    // Lấy danh sách bệnh liên quan đến vaccine
    const diseases = await query(
      `
        SELECT d.id, d.name, d.dose_quantity
        FROM disease d
        INNER JOIN vaccine_disease vd ON vd.disease_id = d.id
        WHERE vd.vaccine_id = $1
      `,
      [vaccine_id]
    );

    if (diseases.rows.length === 0) {
      return res.status(404).json({
        error: true,
        message: "Không tìm thấy bệnh nào liên quan đến vaccine này",
      });
    }

    let allStudents = [];

    // Lấy danh sách học sinh cho từng bệnh
    for (const disease of diseases.rows) {
      const students = await query(
        `
          SELECT 
            s.id AS student_id,
            s.name,
            COALESCE(COUNT(vr.id) FILTER (
              WHERE vr.status = 'COMPLETED' AND vr.vaccine_id = $1
            ), 0) AS completed_doses,
            d.dose_quantity,
            d.name AS disease_name
          FROM student s
          CROSS JOIN disease d
          LEFT JOIN vaccination_record vr 
            ON vr.student_id = s.id 
            AND vr.disease_id = d.id
            AND vr.vaccine_id = $1
          WHERE d.id = $2
          GROUP BY s.id, s.name, d.dose_quantity, d.name
        `,
        [vaccine_id, disease.id]
      );

      allStudents = [
        ...allStudents,
        ...students.rows.map((student) => ({
          student_id: student.student_id,
          name: student.name,
          completed_doses: student.completed_doses,
          dose_quantity: student.dose_quantity,
          disease_name: student.disease_name,
        })),
      ];
    }

    // Loại bỏ học sinh trùng lặp dựa trên student_id
    const uniqueStudents = Array.from(
      new Map(
        allStudents.map((student) => [student.student_id, student])
      ).values()
    );

    return res.status(200).json({
      error: false,
      message: "Lấy danh sách học sinh thành công",
      data: uniqueStudents,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách học sinh theo vaccine:", error);
    return res.status(500).json({
      error: true,
      message: "Lỗi server khi lấy danh sách học sinh",
    });
  }
}
