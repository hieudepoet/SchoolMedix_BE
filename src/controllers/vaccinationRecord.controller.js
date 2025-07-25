import { query, pool } from "../config/database.js";

// Cái này dùng cho tạo record mà không đăng ký tiêm qua campaign
export async function createVaccinationRecord(req, res) {
  const {
    student_id,
    description,
    disease_id,
    vaccine_id,
    location,
    vaccination_date,
  } = req.body;
  if (!student_id || !vaccination_date || !disease_id || !vaccine_id) {
    return res
      .status(400)
      .json({ error: true, message: "Missing required fields" });
  }

  try {
    // Check if student exists
    const students = await query("SELECT * FROM student WHERE id = $1", [
      student_id,
    ]);
    if (students.rows.length === 0) {
      return res
        .status(404)
        .json({ error: true, message: "Student not found" });
    }

    // Insert vaccination record into database
    const insertQuery = `
                  INSERT INTO vaccination_record (student_id, description, disease_id, vaccine_id, location, vaccination_date, pending, status)
                  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                  RETURNING *;
            `;

    const result = await query(insertQuery, [
      student_id,
      description || null,
      disease_id,
      vaccine_id,
      location || null,
      vaccination_date,
      "PENDING",
      "PENDING",
    ]);

    return res
      .status(201)
      .json({ message: "Vaccination record created", data: result.rows[0] });
  } catch (error) {
    console.error("Error creating vaccination record:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
}

export async function acceptVaccinationRecord(req, res) {
  const { id } = req.params;

  try {
    const accept = await query(
      `
        UPDATE vaccination_record 
        SET
          pending = 'DONE', status = 'COMPLETED'
        WHERE 
          id = $1
        RETURNING student_id, disease_id, vaccine_id, description, location, vaccination_date
      `,
      [id]
    );

    return res.status(200).json({
      error: false,
      message: "Accept recording request successfully",
      data: accept,
    });
  } catch (error) {
    console.error("Error accepting recording request: " + error);
    return res.status(500).json({
      error: true,
      message: "Error when accepting record request: ",
    });
  }
}

export async function refuseVaccinationRecord(req, res) {
  const { id } = req.params;
  const { reason_by_nurse } = req.body;

  try {
    const refuse = await query(
      `
        UPDATE vaccination_record 
        SET
          pending = 'CANCELLED', status = 'CANCELLED',
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
    console.error("Error refusing recording request: " + error);
    return res.status(500).json({
      error: true,
      message: "Error when refusing record request: ",
    });
  }
}

export async function getVaccinationDeclarationsHistoryByStudentID(req, res) {
  const { student_id } = req.params;
  try {
    const result = await query(
      `
        SELECT 
          vr.*, 
          s.name as student_name, 
          c.name as class_name, 
          v.name as vaccine_name,
          vd.disease_id, 
          STRING_AGG(d.name, ',') as disease_name
        FROM vaccination_record vr
        JOIN student s on vr.student_id = s.id
        JOIN vaccine v on vr.vaccine_id = v.id
        JOIN vaccine_disease vd on vd.vaccine_id = v.id
        JOIN disease d on d.id = ANY(vr.disease_id) 
        JOIN class c on s.class_id = c.id
        WHERE student_id = $1 AND pending IS NOT NULL
        GROUP BY           
          vr.id, 
          s.name, 
          c.name, 
          v.name,
          vd.disease_id
        ORDER BY vr.created_at DESC
      `,
      [student_id]
    );

    return res.status(200).json({
      error: false,
      message:
        "Get vaccinationvaccination-declaration history requests successfully",
      data: result,
    });
  } catch (error) {
    console.log(
      "Error when getting vaccination-declaration history requests: " + error
    );
    return res.status(500).json({
      error: true,
      message: "Error when getting vaccination-declaration history requests",
    });
  }
}

export async function getVaccinationDeclarationsHistory(req, res) {
  try {
    const result = await query(
      `
        SELECT 
          vr.*, 
          s.name as student_name, 
          c.name as class_name, 
          v.name as vaccine_name,
          vd.disease_id, 
          STRING_AGG(d.name, ',') as disease_name
        FROM vaccination_record vr
        JOIN student s on vr.student_id = s.id
        JOIN vaccine v on vr.vaccine_id = v.id
        JOIN vaccine_disease vd on vd.vaccine_id = v.id
        JOIN disease d on d.id = ANY(vr.disease_id) 
        JOIN class c on s.class_id = c.id
        WHERE pending IS NOT NULL
        GROUP BY           
          vr.id, 
          s.name, 
          c.name, 
          v.name,
          vd.disease_id
        ORDER BY vr.created_at DESC
      `
    );

    return res.status(200).json({
      error: false,
      message:
        "Get vaccinationvaccination-declaration history requests successfully",
      data: result,
    });
  } catch (error) {
    console.log(
      "Error when getting vaccination-declaration history requests: " + error
    );
    return res.status(500).json({
      error: true,
      message: "Error when getting vaccination-declaration history requests",
    });
  }
}

export async function getVaccinationRecordsRequestedByStudentID(req, res) {
  const { student_id } = req.params;
  try {
    const result = await query(
      `
        SELECT vr.*, s.name as student_name, v.*, d.* 
        FROM vaccination_record vr 
        JOIN student s ON vr.student_id = s.id
        JOIN vaccine v ON vr.vaccine_id = v.id
        JOIN disease d ON vr.disease_id = d.id
        WHERE student_id = $1 AND pending = 'PENDING' 
        ORDER BY vr.created_at DESC
      `,
      [student_id]
    );

    return res.status(200).json({
      error: false,
      message: "Get vaccination-record requests successfully",
      data: result,
    });
  } catch (error) {
    console.log("Error when getting vaccination-record requests: " + error);
    return res.status(500).json({
      error: true,
      message: "Error when getting vaccination-record requests",
    });
  }
}

export async function getAllVaccinationRecordsRequested(req, res) {
  try {
    const result = await query(
      `
        SELECT vr.*, s.*, s.name as student_name, v.*, d.*
        FROM vaccination_record vr 
        JOIN student s ON vr.student_id = s.id
        WHERE vr.pending = 'PENDING' 
        ORDER BY vr.created_at DESC
      `
    );

    return res.status(200).json({
      error: false,
      message: "Get vaccination-record requests successfully",
      data: result,
    });
  } catch (error) {
    console.log("Error when getting vaccination-record requests: " + error);
    return res.status(500).json({
      error: true,
      message: "Error when getting vaccination-record requests",
    });
  }
}

export async function getAllMedicalRecordsRequested(req, res) {
  try {
    const result = await query(
      `
            SELECT 
                ROW_NUMBER() OVER (ORDER BY created_at DESC) AS serial_id,
                combined.*
            FROM (
                SELECT 
                    NULL AS disease_record_id,
                    id AS vaccination_record_id,
                    'VACCINATION' AS record_type,
                    student_id,
                    NULL AS disease_id, 
                    NULL AS diagnosis,
                    NULL AS detect_date,
                    NULL AS cure_date,
                    NULL AS location_cure,
                    NULL AS transferred_to,
                    status,
                    pending,
                    reason_by_nurse,
                    created_at,
                    updated_at,
                    register_id,
                    vaccine_id,
                    description,
                    location,
                    vaccination_date,
                    NULL AS status_health 
                FROM vaccination_record
                WHERE pending = 'PENDING'
                
                UNION ALL
                
                SELECT 
                    id AS disease_record_id,
                    NULL AS vaccination_record_id,
                    'DISEASE' AS record_type,
                    student_id,
                    disease_id,
                    diagnosis,
                    detect_date,
                    cure_date,
                    location_cure,
                    transferred_to,
                    NULL AS status,  
                    pending,
                    reason_by_nurse,
                    created_at,
                    updated_at,
                    NULL AS register_id,  
                    NULL AS vaccine_id,   
                    NULL AS description, 
                    NULL AS location,    
                    NULL AS vaccination_date,
                    status AS status_health  
                FROM disease_record
                WHERE pending = 'PENDING'
            ) AS combined
            ORDER BY created_at DESC;
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

export async function getAllMedicalRecordsRequestedBuStudentID(req, res) {
  const { student_id } = req.params;

  try {
    const result = await query(
      `
                SELECT 
                    ROW_NUMBER() OVER (ORDER BY created_at DESC) AS serial_id,
                    combined.*
                FROM (
                    SELECT 
                        NULL AS disease_record_id,
                        id AS vaccination_record_id,
                        'VACCINATION' AS record_type,
                        student_id,
                        NULL AS disease_id, 
                        NULL AS diagnosis,
                        NULL AS detect_date,
                        NULL AS cure_date,
                        NULL AS location_cure,
                        NULL AS transferred_to,
                        status,
                        pending,
                        reason_by_nurse,
                        created_at,
                        updated_at,
                        register_id,
                        vaccine_id,
                        description,
                        location,
                        vaccination_date,
                        NULL AS status_health 
                    FROM vaccination_record
                    WHERE pending = 'PENDING'
                    
                    UNION ALL
                    
                    SELECT 
                        id AS disease_record_id,
                        NULL AS vaccination_record_id,
                        'DISEASE' AS record_type,
                        student_id,
                        disease_id,
                        diagnosis,
                        detect_date,
                        cure_date,
                        location_cure,
                        transferred_to,
                        NULL AS status,  
                        pending,
                        reason_by_nurse,
                        created_at,
                        updated_at,
                        NULL AS register_id,  
                        NULL AS vaccine_id,   
                        NULL AS description, 
                        NULL AS location,    
                        NULL AS vaccination_date,
                        status AS status_health  
                    FROM disease_record
                    WHERE pending = 'PENDING' AND student_id = $1
                ) AS combined
                ORDER BY created_at DESC;
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

// Update vaccination record - keep old content if no new data is passed (null = no change)
export async function updateVaccinationRecord(req, res) {
  const { record_id } = req.params;
  const { description, disease_id, vaccine_id, location, vaccination_date } =
    req.body;

  try {
    // Check if vaccination record exists
    const record = await query(
      "SELECT * FROM vaccination_record WHERE id = $1",
      [record_id]
    );
    if (record.rows.length === 0) {
      return res
        .status(404)
        .json({ error: true, message: "Vaccination record not found" });
    }

    // Update vaccination record
    const updateQuery = `
                  UPDATE vaccination_record
                  SET description = COALESCE($1, description),
                        disease_id = COALESE($7, disease_id),
                        vaccine_id = COALESCE($2, vaccine_id),
                        location = COALESCE($3, location),
                        vaccination_date = COALESCE($4, vaccination_date)
                  WHERE id = $5
                  RETURNING *;
            `;

    const result = await query(updateQuery, [
      description,
      vaccine_id,
      location,
      vaccination_date,
      record_id,
      disease_id,
    ]);

    return res.status(200).json({
      message: "Vaccination record updated",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating vaccination record:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
}

// Get vaccination record by record ID
export async function getVaccinationRecordByID(req, res) {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ error: true, message: "Missing required fields" });
  }

  try {
    const records = await query(
      `
        SELECT vr.*, s.name as student_name, v.name as vaccine_name, STRING_AGG(DISTINCT d.name, ', ') AS disease_name
        FROM vaccination_record vr
        JOIN student s ON vr.student_id = s.id
        JOIN vaccine v ON vr.vaccine_id = v.id
        LEFT JOIN disease d ON d.id = ANY(vr.disease_id)
        WHERE vr.id = $1 AND (vr.pending IS NULL OR vr.pending = 'DONE')
        GROUP BY vr.id , s.name, v.name`,
      [id]
    );
    if (records.rows.length === 0) {
      return res
        .status(404)
        .json({ error: true, message: "Vaccination record not found" });
    }

    return res.status(200).json({
      message: "Vaccination record retrieved",
      data: records.rows[0],
    });
  } catch (error) {
    console.error("Error retrieving vaccination record:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
}

// Get all vaccination records for a student
export async function getVaccinationRecordsByStudentID(req, res) {
  const { student_id } = req.params;

  if (!student_id) {
    return res
      .status(400)
      .json({ error: true, message: "Missing required fields" });
  }

  try {
    const records = await query(
      `
        SELECT vr.*, s.name as student_name, v.name as vaccine_name, d.name as disease_name 
        FROM vaccination_record vr 
        JOIN student s ON vr.student_id = s.id
        JOIN vaccine v ON vr.vaccine_id = v.id
        JOIN disease d ON vr.disease_id = d.id
        WHERE vr.student_id = $1 AND pending IS NULL OR pending = 'DONE'`,
      [student_id]
    );
    if (records.rows.length === 0) {
      return res.status(404).json({
        error: true,
        message: "No vaccination records found for this student",
      });
    }

    return res.status(200).json({
      message: "Vaccination records retrieved",
      data: records.rows,
    });
  } catch (error) {
    console.error("Error retrieving vaccination records:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
}

export async function getVaccinationRecordsOfAStudentBasedOnADisease(
  req,
  res,
  disease_id
) {
  console.log(disease_id);
  const { student_id } = req.params;
  try {
    const { rows } = await query(
      `
        SELECT vr.*, s.name as student_name, v.name as vaccine_name, STRING_AGG(DISTINCT d.name, ', ') AS disease_name
        FROM vaccination_record vr
        JOIN student s ON vr.student_id = s.id
        JOIN vaccine v ON vr.vaccine_id = v.id
        LEFT JOIN disease d ON d.id = ANY(vr.disease_id)
        WHERE vr.student_id = $1 AND vr.disease_id = $2::int[] AND (vr.pending IS NULL OR vr.pending = 'DONE')
        GROUP BY vr.id , s.name, v.name
        ORDER BY vr.vaccination_date
    `,
      [student_id, disease_id]
    );

    if (rows.length === 0) {
      console.log("404");
      return res.status(404).json({
        error: true,
        message: "Không có lịch sử tiêm chủng cho học sinh này với bệnh này",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Lấy thông tin tiêm chủng thành công",
      data: rows,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: true,
      message: "Lỗi khi lấy lịch sử tiêm chủng theo bệnh",
    });
  }
}
