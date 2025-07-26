import { query, pool } from "../config/database.js";

// Vaccine
export async function createVaccine(req, res) {
  const {
    name,
    description,
    origin,
    disease_list,
    dose_quantity = 0,
  } = req.body;

  if (!name || !description || !origin) {
    console.log("Missing required fields", name, " ", description, " ", origin);
    return res
      .status(400)
      .json({ error: true, message: "Missing required fields" });
  }

  if (!Array.isArray(disease_list) || disease_list.length === 0) {
    console.log("disease_list must have at least one item");
    return res.status(400).json({
      error: true,
      message: "disease_list must have at least one item",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Check trùng tên vaccine
    const existing = await client.query(
      "SELECT id FROM vaccine WHERE name = $1",
      [name]
    );
    if (existing.rows.length > 0) {
      await client.query("ROLLBACK");
      console.log(`Vaccine ${name} already exists`);
      return res
        .status(409)
        .json({ error: true, message: `Vaccine ${name} already exists` });
    }

    // Check các disease_id tồn tại
    const diseaseCheck = await client.query(
      "SELECT id FROM disease WHERE id = ANY($1::int[])",
      [disease_list]
    );
    const foundIds = diseaseCheck.rows.map((r) => r.id);
    const missing = disease_list.filter((id) => !foundIds.includes(id));

    if (missing.length > 0) {
      await client.query("ROLLBACK");
      console.log(`Các disease_id sau không tồn tại: ${missing.join(", ")}`);
      return res.status(400).json({
        error: true,
        message: `Các disease_id sau không tồn tại: ${missing.join(", ")}`,
      });
    }

    // Thêm vaccine
    const insertVaccine = await client.query(
      `INSERT INTO vaccine (name, description, origin)
       VALUES ($1, $2, $3)
       RETURNING id, name, description, origin`,
      [name, description, origin]
    );
    const newVaccine = insertVaccine.rows[0];

    // Gắn vaccine với mảng disease_ids
    await client.query(
      `INSERT INTO vaccine_disease (vaccine_id, disease_id, dose_quantity)
       VALUES ($1, $2, $3)`,
      [newVaccine.id, disease_list, dose_quantity]
    );

    await client.query("COMMIT");

    return res.status(201).json({
      error: false,
      data: {
        ...newVaccine,
        disease_list,
        dose_quantity,
      },
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error creating vaccine:", err);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
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
        vd.dose_quantity,
        STRING_AGG(d.name, ', ') AS diseases
      FROM vaccine v
      LEFT JOIN vaccine_disease vd ON vd.vaccine_id = v.id
      LEFT JOIN LATERAL (
        SELECT name
        FROM disease
        WHERE id = ANY(vd.disease_id)
      ) d ON TRUE
      GROUP BY v.id, vd.dose_quantity
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
        v.origin,
        v.description,
        vd.dose_quantity,
        STRING_AGG(d.name, ', ') AS diseases
      FROM vaccine v
      LEFT JOIN vaccine_disease vd ON vd.vaccine_id = v.id
      LEFT JOIN LATERAL (
        SELECT name
        FROM disease
        WHERE id = ANY(vd.disease_id)
      ) d ON TRUE
      WHERE v.id = $1
      GROUP BY v.id, vd.dose_quantity

    `,
      [id]
    );

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
    console.log(vaccine_id);
    const diseases = await query(
      `
        SELECT 
          vd.disease_id, STRING_AGG(DISTINCT d.name, ', ') as disease_name, vd.dose_quantity
        FROM vaccine_disease vd
        LEFT JOIN disease d ON d.id = ANY(vd.disease_id)
        WHERE vd.vaccine_id = $1
        GROUP BY vd.disease_id, vd.dose_quantity
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
            vd.dose_quantity,
            vd.vaccine_id,
            v.name AS vaccine_name,
            STRING_AGG(d.name, ', ') AS disease_name,
            COALESCE(COUNT(vr.id) FILTER (
              WHERE vr.status = 'COMPLETED'
            ), 0) AS completed_doses
          FROM student s
          CROSS JOIN vaccine_disease vd
          LEFT JOIN vaccine v on v.id = vd.vaccine_id
          LEFT JOIN disease d on d.id = ANY(vd.disease_id)
          LEFT JOIN vaccination_record vr 
            ON vr.student_id = s.id 
            AND vr.disease_id = vd.disease_id
          WHERE vd.disease_id = $1::int[]
          GROUP BY 
            s.id,
            s.name,
            vd.dose_quantity,
            vd.vaccine_id,
            vaccine_name
        `,
        [disease.disease_id]
      );

      allStudents = [
        ...allStudents,
        ...students.rows.map((student) => ({
          student_id: student.student_id,
          name: student.name,
          completed_doses: student.completed_doses,
          dose_quantity: student.dose_quantity,
          disease_name: student.disease_name,
          vaccine_name: student.vaccine_name,
          vaccine_id: student.vaccine_id,
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

export async function getStudentsByDiseaseCluster(req, res) {
  const { disease_cluster_id } = req.params;

  if (!disease_cluster_id) {
    return res.status(400).json({
      error: true,
      message: "Thiếu disease_cluster_id",
    });
  }

  try {
    // Lấy danh sách bệnh thuộc cụm bệnh
    const diseases = await query(
      `
        SELECT 
          d.id AS disease_id,
          d.name AS disease_name
        FROM disease d
        JOIN disease_cluster dc ON dc.disease_id = d.id
        WHERE dc.cluster_id = $1
      `,
      [disease_cluster_id]
    );

    if (diseases.rows.length === 0) {
      return res.status(404).json({
        error: true,
        message: "Không tìm thấy bệnh nào thuộc cụm bệnh này",
      });
    }

    let allStudents = [];

    // Lấy danh sách học sinh cho từng bệnh trong cụm
    for (const disease of diseases.rows) {
      const students = await query(
        `
          SELECT 
            s.id AS student_id,
            s.name,
            COALESCE(COUNT(vr.id) FILTER (WHERE vr.status = 'COMPLETED'), 0) AS completed_doses,
            d.dose_quantity
          FROM student s
          CROSS JOIN disease d
          LEFT JOIN vaccination_record vr 
            ON vr.student_id = s.id 
            AND vr.disease_id = d.id
          WHERE d.id = $1
          GROUP BY s.id, s.name, d.dose_quantity
        `,
        [disease.disease_id]
      );

      allStudents = [
        ...allStudents,
        ...students.rows.map((student) => ({
          student_id: student.student_id,
          name: student.name,
          completed_doses: student.completed_doses,
          dose_quantity: student.dose_quantity,
          disease_name: disease.disease_name,
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
    console.error("Lỗi khi lấy danh sách học sinh theo cụm bệnh:", error);
    return res.status(500).json({
      error: true,
      message: "Lỗi server khi lấy danh sách học sinh",
    });
  }
}
