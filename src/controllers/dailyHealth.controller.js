import { query } from "../config/database.js";

//Create a new daily health record
export const createDailyHealthRecord = async (req, res) => {
  const {
    student_id,
    detect_time,
    diagnosis,
    on_site_treatment,
    transferred_to,
    items_usage,
    status,
  } = req.body;

  if (!student_id || !detect_time) {
    return res
      .status(400)
      .json({ error: false, message: "Missing required fields" });
  }

  try {
    // Check if the student exists
    const students = await query("SELECT id FROM student WHERE id = $1;", [
      student_id,
    ]);
    if (students.rowCount === 0) {
      return res
        .status(404)
        .json({ error: true, message: "Student not found" });
    }

    // Insert the daily health record
    const record_date = new Date();
    const insertQuery = `
           INSERT INTO daily_health_record (student_id, detect_time, record_date, diagnosis, on_site_treatment, transferred_to, items_usage, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
    const values = [
      student_id,
      detect_time,
      record_date,
      diagnosis || null,
      on_site_treatment || null,
      transferred_to || null,
      items_usage || null,
      status,
    ];
    const result = await query(insertQuery, values);
    return res
      .status(201)
      .json({ message: "Daily health record created", data: result.rows[0] });
  } catch (error) {
    console.error("Error creating daily health record:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

// Get all daily health records
export const getDailyHealthRecords = async (req, res) => {
  try {
    const result = await query(
      `SELECT *, d.id as id, s.id as student_id FROM daily_health_record d
      JOIN student s ON d.student_id = s.id 
      ORDER BY d.detect_time DESC;`
    );
    return res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error("Error fetching daily health records:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

// Get all daily health record by student ID
export const getDailyHealthRecordsByStudentId = async (req, res) => {
  const { student_id } = req.params;

  try {
    const result = await query(
      `SELECT * FROM daily_health_record 
       WHERE student_id = $1 
       ORDER BY record_date DESC;`,
      [student_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: true,
        message: "No daily health records found for this student.",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Daily health records retrieved successfully.",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching daily health records:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error.",
    });
  }
};

// Get a daily health record by ID
export const getDailyHealthRecordById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query(
      `SELECT *, d.id as id, s.id as student_id FROM daily_health_record d
      JOIN student s ON d.student_id = s.id  
      WHERE d.id = $1;`,
      [id]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: true, message: "Daily health record not found" });
    }

    return res.status(200).json({ data: result.rows[0] });
  } catch (error) {
    console.error("Error fetching daily health record:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

// Update a daily health record by ID
export const updateDailyHealthRecordById = async (req, res) => {
  const { id } = req.params;
  const {
    diagnosis,
    on_site_treatment,
    transferred_to,
    items_usage,
    status,
    detect_time,
  } = req.body;

  if (!diagnosis) {
    return res
      .status(400)
      .json({ error: true, message: "Missing required field: Diagnosis" });
  }

  try {
    // Check if the record exists
    const recordCheck = await query(
      "SELECT * FROM daily_health_record WHERE id = $1;",
      [id]
    );
    if (recordCheck.rowCount === 0) {
      return res
        .status(404)
        .json({ error: true, message: "Daily health record not found" });
    }

    // Update the daily health record
    const updateQuery = `
      UPDATE daily_health_record 
      SET diagnosis = $1, 
          on_site_treatment = $2, 
          transferred_to = $3, 
          items_usage = $4, 
          status = $5,
          detect_time = $6 
      WHERE id = $7 
      RETURNING *;
    `;
    const values = [
      diagnosis,
      on_site_treatment || null,
      transferred_to || null,
      items_usage || null,
      status || null,
      detect_time || null,
      id,
    ];
    const result = await query(updateQuery, values);

    return res.status(200).json({
      message: "Daily health record updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating daily health record:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};
