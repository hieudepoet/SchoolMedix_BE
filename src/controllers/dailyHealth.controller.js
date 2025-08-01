import { query, pool } from "../config/database.js";
import {
  checkAdequateQuantityForItems,
  createNewMedicalItemsForTransaction,
  createNewTransaction,
  eraseAllTransactionItemsByTransactionID,
  getMedicalItemsByTransactionID,
  restoreMedicalItemsForTransaction,
} from "./medicalItem.controller.js";

// Create a new daily health record
export const createDailyHealthRecord = async (req, res) => {
  const {
    student_id,
    detect_time,
    diagnosis,
    on_site_treatment,
    transferred_to,
    items_usage,
    status,
    medical_items,
  } = req.body;

  if (!student_id || !detect_time) {
    return res
      .status(400)
      .json({ error: false, message: "Missing required fields" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Check if the student exists
    const students = await query(
      "SELECT id FROM student WHERE id = $1;",
      [student_id],
      { client }
    );
    if (students.rowCount === 0) {
      throw new Error("Student not found");
    }

    const record_date = new Date();
    let transaction_id = null;
    if (Array.isArray(medical_items) && medical_items.length > 0) {
      // Check if there are enough quantity of medical item to use
      let is_valid_transaction_quantity = await checkAdequateQuantityForItems(
        medical_items,
        1
      );
      if (is_valid_transaction_quantity === false) {
        throw new Error("Các vật tư y tế/thuốc không đủ số lượng.");
      }
      // If yes, then inserting new transaction
      transaction_id = await createNewTransaction(
        1,
        "Sử dụng thuốc/vật tư cho học sinh",
        record_date,
        medical_items,
        null,
        client
      );
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
      transaction_id,
    ];
    const result = await query(insertQuery, values, { client });

    await client.query("COMMIT");
    return res
      .status(201)
      .json({ message: "Daily health record created", data: result.rows[0] });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating daily health record:", error);
    return res
      .status(500)
      .json({ error: true, message: error.message || "Internal server error" });
  } finally {
    client.release();
  }
};

// Get all daily health records
export const getDailyHealthRecords = async (req, res) => {
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
      d.transaction_id,
      d.status,
      COALESCE(json_agg(
          json_build_object(
              'id', mi.id,
              'name', mi.name,
              'unit', mi.unit,
              'description', mi.description,
              'category', mi.category,
              'quantity', ABS(ti.transaction_quantity)
          )
      ) FILTER (WHERE mi.id IS NOT NULL), '[]') AS medical_items,
      STRING_AGG(
          CASE WHEN mi.id IS NOT NULL 
              THEN mi.name || ' ' || CAST(ABS(ti.transaction_quantity) AS VARCHAR) || ' ' || mi.unit 
              ELSE NULL 
          END, 
          '\n'
      ) AS items_usage
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
        d.transaction_id,
        d.status,
        COALESCE(json_agg(
          json_build_object(
            'id', mi.id,
            'name', mi.name,
            'unit', mi.unit,
            'quantity', ABS(ti.transaction_quantity)
          )
        ) FILTER (WHERE mi.id IS NOT NULL), '[]') AS medical_items,
        STRING_AGG(
            CASE WHEN mi.id IS NOT NULL 
                THEN mi.name || ' ' || CAST(ABS(ti.transaction_quantity) AS VARCHAR) || ' ' || mi.unit 
                ELSE NULL 
            END, 
            '\n'
        ) AS items_usage
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
        d.transaction_id,
        d.status,
        COALESCE(json_agg(
          json_build_object(
            'id', mi.id,
            'name', mi.name,
            'unit', mi.unit,
            'quantity', ABS(ti.transaction_quantity)
          )
        ) FILTER (WHERE mi.id IS NOT NULL), '[]') AS medical_items,
        STRING_AGG(
            CASE WHEN mi.id IS NOT NULL 
                THEN mi.name || ' ' || CAST(ABS(ti.transaction_quantity) AS VARCHAR) || ' ' || mi.unit 
                ELSE NULL 
            END, 
            '\n'
        ) AS items_usage
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
    medical_items,
  } = req.body;

  if (!diagnosis) {
    return res
      .status(400)
      .json({ error: true, message: "Missing required field: Diagnosis" });
  }

  //console.log("update: ", medical_items);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Check if the record exists
    const recordCheck = await client.query(
      "SELECT * FROM daily_health_record WHERE id = $1;",
      [id]
    );
    if (recordCheck.rowCount === 0) {
      throw new Error("Daily health record not found");
    }

    const old_medical_items = await getMedicalItemsByTransactionID(
      transaction_id,
      client
    );

    await eraseAllTransactionItemsByTransactionID(transaction_id, client);
    const is_valid_transaction_quantity = await checkAdequateQuantityForItems(
      medical_items,
      1,
      client
    );
    if (is_valid_transaction_quantity === true) {
      await createNewMedicalItemsForTransaction(
        transaction_id,
        medical_items,
        1,
        client
      );
    } else {
      await restoreMedicalItemsForTransaction(
        transaction_id,
        old_medical_items,
        client
      );
      throw new Error("Không đủ vật tư/ thuốc để sử dụng!");
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
    console.log("UPDATE");
    const values = [
      diagnosis,
      on_site_treatment || null,
      transferred_to || null,
      items_usage || null,
      status || null,
      detect_time || null,
      id,
    ];
    const result = await client.query(updateQuery, values);

    await client.query("COMMIT");
    return res.status(200).json({
      message: "Daily health record updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating daily health record:", error);
    return res
      .status(500)
      .json({ error: true, message: error.message || "Internal server error" });
  } finally {
    client.release();
  }
};

export const deleteDailyHealthRecordById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ error: true, message: "Missing required field: id" });
  }

  const client = await pool.connect(); // lấy client để dùng transaction

  try {
    await client.query("BEGIN");

    // Kiểm tra bản ghi tồn tại
    const recordCheck = await client.query(
      "SELECT * FROM daily_health_record WHERE id = $1;",
      [id]
    );

    if (recordCheck.rowCount === 0) {
      await client.query("ROLLBACK");
      return res
        .status(404)
        .json({ error: true, message: "Daily health record not found" });
    }

    const transaction_id = recordCheck.rows[0].transaction_id;

    // Xóa các item liên quan trong bảng con (nếu cần)
    await eraseAllTransactionItemsByTransactionID(transaction_id, client); // truyền client

    // Xóa transaction chính
    await client.query(`DELETE FROM inventorytransaction WHERE id = $1;`, [
      transaction_id,
    ]);

    // Xóa daily health record
    await client.query(`DELETE FROM daily_health_record WHERE id = $1;`, [id]);

    await client.query("COMMIT");

    return res.status(200).json({
      message: "Daily health record deleted successfully",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error deleting daily health record:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  } finally {
    client.release();
  }
};
