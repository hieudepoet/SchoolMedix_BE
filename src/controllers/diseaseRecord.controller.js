import { query } from "../config/database.js";
import {
  getProfileByUUID,
  getProfileOfStudentByUUID,
} from "../services/index.js";
import { getStudentProfileByID } from "./users.controller.js";

export async function getDiseaseRecordsOfStudent(req, res) {
  const { student_id } = req.params;

  try {
    const result = await query(
      `
      SELECT 
        dr.id,
        dr.status,
        dr.pending,
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
      WHERE dr.student_id = $1 AND pending IS NULL OR pending = 'DONE'
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
      WHERE dr.student_id = $1 AND d.disease_category = 'Bệnh mãn tính' AND pending IS NULL OR pending = 'DONE'
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
      WHERE dr.student_id = $1 AND d.disease_category = 'Bệnh truyền nhiễm' AND pending IS NULL OR pending = 'DONE' 
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
      WHERE d.disease_category = 'Bệnh mãn tính' AND pending IS NULL OR pending = 'DONE'
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
      WHERE d.disease_category = 'Bệnh truyền nhiễm' AND pending IS NULL OR pending = 'DONE'
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
      WHERE AND pending IS NULL OR pending = 'DONE'
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

// Khai báo hồ sơ bệnh
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
        status,
        pending
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
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
        "PENDING",
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

export async function acceptDiseaseRecord(req, res) {
  const { id } = req.params;

  try {
    const accept = await query(
      `
        UPDATE disease_record 
        SET
          pending = 'DONE'
        WHERE 
          id = $1
      `,
      [id]
    );

    return res.status(200).json({
      error: false,
      message: "Accept recording request successfully",
      data: accept,
    });
  } catch (error) {
    console.error("Error accepting disease recording request: " + error);
    return res.status(500).json({
      error: true,
      message: "Error when accepting disease record request: ",
    });
  }
}

export async function refuseDiseaseRecord(req, res) {
  const { id } = req.params;
  const { reason_by_nurse } = req.body;

  try {
    const refuse = await query(
      `
        UPDATE disease_record 
        SET
          pending = 'CANCELLED',
          reason_by_nurse = $1
        WHERE 
          id = $2
      `,
      [reason_by_nurse, id]
    );

    return res.status(200).json({
      error: false,
      message: "Refuse recording request successfully",
      data: refuse,
    });
  } catch (error) {
    console.error("Error refusing disease recording request: " + error);
    return res.status(500).json({
      error: true,
      message: "Error when refusing disease record request: ",
    });
  }
}

export async function getDiseaseDeclarationsHistoryByStudentID(req, res) {
  const { student_id } = req.params;
  try {
    const result = await query(
      `
        SELECT dr.*, s.name as student_name
        FROM disease_record dr 
        JOIN student s on dr.student_id = s.id
        WHERE student_id = $1 AND pending IS NOT NULL
        ORDER BY created_at DESC
      `,
      [student_id]
    );

    return res.status(200).json({
      error: false,
      message: "Get disease-declaration history requests successfully",
      data: result,
    });
  } catch (error) {
    console.log(
      "Error when getting disease-declaration history requests: " + error
    );
    return res.status(500).json({
      error: true,
      message: "Error when getting disease-declaration history requests",
    });
  }
}

export async function getDiseaseDeclarationsHistory(req, res) {
  try {
    const result = await query(
      `
        SELECT dr.*, s.name as student_name
        FROM disease_record dr 
        JOIN student s on dr.student_id = s.id
        WHERE pending IS NOT NULL
        ORDER BY created_at DESC
      `
    );

    return res.status(200).json({
      error: false,
      message: "Get disease-declaration history requests successfully",
      data: result,
    });
  } catch (error) {
    console.log(
      "Error when getting disease-declaration history requests: " + error
    );
    return res.status(500).json({
      error: true,
      message: "Error when getting disease-declaration history requests",
    });
  }
}

export async function getDiseaseRecordsRequestedByStudentID(req, res) {
  const { student_id } = req.params;
  try {
    const result = await query(
      `
        SELECT * FROM disease_record WHERE student_id = $1 AND pending = 'PENDING' 
        ORDER BY created_at DESC
      `,
      [student_id]
    );

    return res.status(200).json({
      error: false,
      message: "Get disease-record requests successfully",
      data: result,
    });
  } catch (error) {
    console.log("Error when getting disease-record requests: " + error);
    return res.status(500).json({
      error: true,
      message: "Error when getting disease-record requests",
    });
  }
}

export async function getAllDiseaseRecordsRequested(req, res) {
  try {
    const result = await query(
      `
      SELECT * FROM disease_record WHERE pending = 'PENDING'
      ORDER BY created_at DESC
      `
    );

    return res.status(200).json({
      error: false,
      message: "Get disease-record requests successfully",
      data: result,
    });
  } catch (error) {
    console.log("Error when getting disease-record requests: " + error);
    return res.status(500).json({
      error: true,
      message: "Error when getting disease-record requests",
    });
  }
}

export async function updateDiseaseRecord(req, res) {
  const { id } = req.params;
  const {
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
      WHERE id = $7
      RETURNING *;
    `,
      [
        diagnosis,
        detect_date,
        cure_date,
        location_cure,
        transferred_to,
        status,
        id,
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
