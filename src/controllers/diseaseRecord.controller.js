import { query } from "../config/database.js";
import { getProfileByUUID, getProfileOfStudentByUUID } from "../services/index.js";
import { getStudentProfileByID } from "./users.controller.js";

export async function getDiseaseRecordsOfStudent(req, res) {
  const { student_id } = req.params;

  try {
    const result = await query(
      `
      SELECT 
        dr.student_id,
        dr.disease_id,
        dr.diagnosis,
        dr.detect_date,
        dr.cure_date,
        dr.location_cure,
        dr.created_at,
        dr.updated_at,
        d.id as disease_id,
        d.disease_category,
        d.name AS disease_name,
        d.description,
        d.vaccine_need,
        d.dose_quantity,
        s.supabase_uid,
        c.name as class_name
      FROM 
        disease_record dr
      JOIN 
        disease d ON dr.disease_id = d.id
      JOIN 
        student s ON dr.student_id = s.id
      JOIN 
        class c ON s.class_id = c.id
      WHERE dr.student_id = $1
      ORDER BY dr.student_id ASC
    `,
      [student_id]
    );

    // Gắn profile từ Supabase
    const studentsWithProfiles = await Promise.all(
      result.rows.map(async (student) => {
        const profile = await getProfileOfStudentByUUID(student.supabase_uid);
        return {
          ...student,
          profile,
        };
      })
    );

    return res.status(200).json({
      error: false,
      message: "Lấy danh sách tất cả hồ sơ bệnh thành công",
      data: studentsWithProfiles,
    });
  } catch (error) {
    console.error("Error fetching all disease records:", error);
    return res.status(500).json({
      error: true,
      message: "Lỗi server khi lấy danh sách hồ sơ bệnh",
    });
  }
}

export async function getChronicDiseaseRecordsOfStudent(req, res) {
  const { student_id } = req.params;

  try {
    const result = await query(
      `
      SELECT 
        dr.student_id,
        dr.disease_id,
        dr.diagnosis,
        dr.detect_date,
        dr.cure_date,
        dr.location_cure,
        dr.created_at,
        dr.updated_at,
        d.id as disease_id,
        d.disease_category,
        d.name AS disease_name,
        d.description,
        d.vaccine_need,
        d.dose_quantity,
        s.supabase_uid,
        c.name as class_name
      FROM 
        disease_record dr
      JOIN 
        disease d ON dr.disease_id = d.id
      JOIN 
        student s ON dr.student_id = s.id
      JOIN 
        class c ON s.class_id = c.id
      WHERE dr.student_id = $1 AND d.disease_category = 'Bệnh mãn tính'
      ORDER BY dr.student_id ASC
    `,
      [student_id]
    );

    // Gắn profile từ Supabase
    const studentsWithProfiles = await Promise.all(
      result.rows.map(async (student) => {
        const profile = await getProfileOfStudentByUUID(student.supabase_uid);
        return {
          ...student,
          profile,
        };
      })
    );

    return res.status(200).json({
      error: false,
      message: "Lấy danh sách tất cả hồ sơ bệnh thành công",
      data: studentsWithProfiles,
    });
  } catch (error) {
    console.error("Error fetching all disease records:", error);
    return res.status(500).json({
      error: true,
      message: "Lỗi server khi lấy danh sách hồ sơ bệnh",
    });
  }
}

export async function getInfectiousDiseaseRecordsOfStudent(req, res) {
  const { student_id } = req.params;

  try {
    const result = await query(
      `
      SELECT 
        dr.student_id,
        dr.disease_id,
        dr.diagnosis,
        dr.detect_date,
        dr.cure_date,
        dr.location_cure,
        dr.created_at,
        dr.updated_at,
        d.id as disease_id,
        d.disease_category,
        d.name AS disease_name,
        d.description,
        d.vaccine_need,
        d.dose_quantity,
        s.supabase_uid,
        c.name as class_name
      FROM 
        disease_record dr
      JOIN 
        disease d ON dr.disease_id = d.id
      JOIN 
        student s ON dr.student_id = s.id
      JOIN 
        class c ON s.class_id = c.id
      WHERE dr.student_id = $1 AND d.disease_category = 'Bệnh truyền nhiễm'
      ORDER BY dr.student_id ASC
    `,
      [student_id]
    );

    // Gắn profile từ Supabase
    const studentsWithProfiles = await Promise.all(
      result.rows.map(async (student) => {
        const profile = await getProfileOfStudentByUUID(student.supabase_uid);
        return {
          ...student,
          profile,
        };
      })
    );

    return res.status(200).json({
      error: false,
      message: "Lấy danh sách tất cả hồ sơ bệnh thành công",
      data: studentsWithProfiles,
    });
  } catch (error) {
    console.error("Error fetching all disease records:", error);
    return res.status(500).json({
      error: true,
      message: "Lỗi server khi lấy danh sách hồ sơ bệnh",
    });
  }
}

export async function createDiseaseRecord(req, res) {
  const { student_id } = req.params;
  const {
    disease_id,
    diagnosis,
    detect_date,
    cure_date,
    location_cure,
    transferred_to,
    status,
  } = req.body;

  try {
    const result = await query(
      `
      INSERT INTO disease_record (
        student_id,
        disease_id,
        diagnosis,
        detect_date,
        cure_date,
        location_cure,
        transferred_to,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
      `,
      [
        student_id,
        disease_id,
        diagnosis,
        detect_date,
        cure_date,
        location_cure,
        transferred_to,
        status,
      ]
    );

    return res.status(201).json({
      error: false,
      message: "Ghi nhận bệnh cho học sinh thành công",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error recording disease:", error);
    return res.status(500).json({
      error: true,
      message: "Lỗi server khi ghi nhận bệnh",
    });
  }
}

export async function updateDiseaseRecord(req, res) {
  const { student_id } = req.params;
  const {
    disease_id,
    diagnosis,
    detect_date,
    cure_date,
    location_cure,
    transferred_to,
    status,
  } = req.body;

  try {
    const result = await query(
      `
      UPDATE disease_record
      SET 
        diagnosis = $1,
        detect_date = $2,
        cure_date = $3,
        location_cure = $4,
        transferred_to = $5,
        status = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE student_id = $7 AND disease_id = $8
      RETURNING *;
    `,
      [
        diagnosis,
        detect_date,
        cure_date,
        location_cure,
        transferred_to,
        status,
        student_id,
        disease_id,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: true,
        message: "Không tìm thấy bản ghi để cập nhật",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Cập nhật thông tin bệnh thành công",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating disease:", error);
    return res.status(500).json({
      error: true,
      message: "Lỗi server khi cập nhật bệnh",
    });
  }
}

export async function getAllChronicDiseaseRecords(req, res) {
  try {
    const result = await query(`
      SELECT 
        dr.student_id,
        dr.disease_id,
        dr.diagnosis,
        dr.detect_date,
        dr.cure_date,
        dr.location_cure,
        dr.created_at,
        dr.updated_at,
        d.id as disease_id,
        d.disease_category,
        d.name AS disease_name,
        d.description,
        d.vaccine_need,
        d.dose_quantity,
        s.supabase_uid,
        c.name as class_name
      FROM 
        disease_record dr
      JOIN 
        disease d ON dr.disease_id = d.id
      JOIN 
        student s ON dr.student_id = s.id
      JOIN 
        class c ON s.class_id = c.id
      WHERE d.disease_category = 'Bệnh mãn tính'
      ORDER BY dr.student_id ASC
    `);

    // Gắn profile từ Supabase
    const studentsWithProfiles = await Promise.all(
      result.rows.map(async (student) => {
        const profile = await getProfileOfStudentByUUID(student.supabase_uid);
        return {
          ...student,
          profile,
        };
      })
    );

    return res.status(200).json({
      error: false,
      message: "Lấy danh sách tất cả hồ sơ bệnh thành công",
      data: studentsWithProfiles,
    });
  } catch (error) {
    console.error("Error fetching all disease records:", error);
    return res.status(500).json({
      error: true,
      message: "Lỗi server khi lấy danh sách hồ sơ bệnh",
    });
  }
}

export async function getAllInfectiousDiseaseRecords(req, res) {
  try {
    const result = await query(`
      SELECT 
        dr.student_id,
        dr.disease_id,
        dr.diagnosis,
        dr.detect_date,
        dr.cure_date,
        dr.location_cure,
        dr.created_at,
        dr.updated_at,
        d.id as disease_id,
        d.disease_category,
        d.name AS disease_name,
        d.description,
        d.vaccine_need,
        d.dose_quantity,
        s.supabase_uid,
        c.name as class_name
      FROM 
        disease_record dr
      JOIN 
        disease d ON dr.disease_id = d.id
      JOIN 
        student s ON dr.student_id = s.id
      JOIN 
        class c ON s.class_id = c.id
      WHERE d.disease_category = 'Bệnh truyền nhiễm'
      ORDER BY dr.student_id ASC
    `);

    // Gắn profile từ Supabase
    const studentsWithProfiles = await Promise.all(
      result.rows.map(async (student) => {
        const profile = await getProfileOfStudentByUUID(student.supabase_uid);
        return {
          ...student,
          profile,
        };
      })
    );

    return res.status(200).json({
      error: false,
      message: "Lấy danh sách tất cả hồ sơ bệnh thành công",
      data: studentsWithProfiles,
    });
  } catch (error) {
    console.error("Error fetching all disease records:", error);
    return res.status(500).json({
      error: true,
      message: "Lỗi server khi lấy danh sách hồ sơ bệnh truyền nhiễm",
    });
  }
}

// Lấy tất cả record bệnh trong database for (Admin) + tên học sinh + lớp
export async function getAllDiseaseRecords(req, res) {
  try {
    const result = await query(`
      SELECT 
        dr.student_id,
        dr.disease_id,
        dr.diagnosis,
        dr.detect_date,
        dr.cure_date,
        dr.location_cure,
        dr.created_at,
        dr.updated_at,
        d.id as disease_id,
        d.disease_category,
        d.name AS disease_name,
        d.description,
        d.vaccine_need,
        d.dose_quantity,
        s.supabase_uid,
        c.name as class_name
      FROM 
        disease_record dr
      JOIN 
        disease d ON dr.disease_id = d.id
      JOIN 
        student s ON dr.student_id = s.id
      JOIN 
        class c ON s.class_id = c.id
      ORDER BY dr.student_id ASC
    `);

    // Gắn profile từ Supabase
    const studentsWithProfiles = await Promise.all(
      result.rows.map(async (student) => {
        const profile = await getProfileOfStudentByUUID(student.supabase_uid);
        return {
          ...student,
          profile,
        };
      })
    );

    return res.status(200).json({
      error: false,
      message: "Lấy danh sách tất cả hồ sơ bệnh thành công",
      data: studentsWithProfiles,
    });
  } catch (error) {
    console.error("Error fetching all disease records:", error);
    return res.status(500).json({
      error: true,
      message: "Lỗi server khi lấy danh sách hồ sơ bệnh",
    });
  }
}

// L
