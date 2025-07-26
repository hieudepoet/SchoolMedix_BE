import { query } from "../config/database.js";
import { checkAdequateQuantityForItems, createNewMedicalItemsForTransaction, createNewTransaction } from "./medicalItem.controller.js";

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
    medical_items
  } = req.body;

  if (!student_id || !detect_time || !medical_items) {
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


    const record_date = new Date();
    let transaction_id = null;
    if (Array.isArray(medical_items) && medical_items.length > 0) {
      // check if there are enough quanity of medical item to use
      let is_valid_transaction_quantity = await checkAdequateQuantityForItems(medical_items, 1);
      if (!is_valid_transaction_quantity) {
        return res.status(400).json({ error: true, message: "Các vật tư y tế/thuốc không đủ số lượng." });
      }
      // if yes, then inserting new transaction
      transaction_id = await createNewTransaction(1, 'Sử dụng thuốc/vật tư cho học sinh', record_date, medical_items);
    }

    // Insert the daily health record
    const insertQuery = `
           INSERT INTO daily_health_record (student_id, detect_time, record_date, diagnosis, on_site_treatment, transferred_to, items_usage, status, transaction_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
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
      transaction_id
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
      `SELECT 
        d.id AS id,
        d.student_id,
        s.name AS student_name,
        s.class_id,
        d.detect_time,
        d.record_date,
        d.diagnosis,
        d.on_site_treatment,
        d.transferred_to,
        d.items_usage,
        d.transaction_id,
        d.status,
        COALESCE(json_agg(
          json_build_object(
            'medical_item_id', mi.id,
            'name', mi.name,
            'unit', mi.unit,
            'description', mi.description,
            'category', mi.category,
            'transaction_quantity', ABS(ti.transaction_quantity)
          )
        ) FILTER (WHERE mi.id IS NOT NULL), '[]') AS medical_items
      FROM daily_health_record d
      JOIN student s ON d.student_id = s.id
      LEFT JOIN TransactionItems ti ON ti.transaction_id = d.transaction_id
      LEFT JOIN MedicalItem mi ON mi.id = ti.medical_item_id
      GROUP BY d.id, s.id
      ORDER BY d.detect_time DESC;
`
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
      `
      SELECT 
        d.id AS id,
        d.student_id,
        s.name AS student_name,
        s.class_id,
        d.detect_time,
        d.record_date,
        d.diagnosis,
        d.on_site_treatment,
        d.transferred_to,
        d.items_usage,
        d.transaction_id,
        d.status,
        COALESCE(json_agg(
          json_build_object(
            'medical_item_id', mi.id,
            'name', mi.name,
            'unit', mi.unit,
            'transaction_quantity', ABS(ti.transaction_quantity)
          )
        ) FILTER (WHERE mi.id IS NOT NULL), '[]') AS medical_items
      FROM daily_health_record d
      JOIN student s ON d.student_id = s.id
      LEFT JOIN TransactionItems ti ON ti.transaction_id = d.transaction_id
      LEFT JOIN MedicalItem mi ON mi.id = ti.medical_item_id
      WHERE d.student_id = $1
      GROUP BY d.id, s.id
      ORDER BY d.record_date DESC;
      `,
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
      `
      SELECT 
        d.id AS id,
        d.student_id,
        s.name AS student_name,
        s.class_id,
        d.detect_time,
        d.record_date,
        d.diagnosis,
        d.on_site_treatment,
        d.transferred_to,
        d.items_usage,
        d.transaction_id,
        d.status,
        COALESCE(json_agg(
          json_build_object(
            'medical_item_id', mi.id,
            'name', mi.name,
            'unit', mi.unit,
            'transaction_quantity', ABS(ti.transaction_quantity)
          )
        ) FILTER (WHERE mi.id IS NOT NULL), '[]') AS medical_items
      FROM daily_health_record d
      JOIN student s ON d.student_id = s.id
      LEFT JOIN TransactionItems ti ON ti.transaction_id = d.transaction_id
      LEFT JOIN MedicalItem mi ON mi.id = ti.medical_item_id
      WHERE d.id = $1
      GROUP BY d.id, s.id
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: true, message: "Daily health record not found" });
    }

    return res.status(200).json({
      error: false,
      message: "Daily health record retrieved successfully.",
      data: result.rows[0],
    });
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
    transaction_id,
    medical_items
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

    // update medical items transaction
    if (transaction_id && Array.isArray(medical_items) && medical_items.length > 0) {
      await createNewMedicalItemsForTransaction(transaction_id, medical_items, 1);
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