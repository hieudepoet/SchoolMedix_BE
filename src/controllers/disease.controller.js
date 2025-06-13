// disease.controller.js
import { query } from "../config/database.js";

// Create a new disease
export async function createDisease(req, res) {
  const { disease_category, name, description, vaccine_need, dose_quantity } =
    req.body;

  if (!name || vaccine_need === undefined || dose_quantity === undefined) {
    return res
      .status(400)
      .json({ error: true, message: "Missing required fields" });
  }

  try {
    const insertQuery = `
        INSERT INTO disease (disease_category, name, description, vaccine_need, dose_quantity)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        `;
    const values = [
      disease_category || null,
      name,
      description || null,
      vaccine_need,
      dose_quantity,
    ];
    const result = await query(insertQuery, values);

    return res
      .status(201)
      .json({ message: "Disease created", data: result.rows[0] });
  } catch (error) {
    console.error("Error creating disease:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
}

// Get all diseases
export async function getAllDiseases(req, res) {
  try {
    const result = await query("SELECT * FROM disease ORDER BY id;");
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching diseases:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
}

// Update disease
export async function updateDisease(req, res) {
  const { id } = req.params;
  const { disease_category, name, description, vaccine_need, dose_quantity } =
    req.body;

  if (!name || vaccine_need === undefined || dose_quantity === undefined) {
    return res
      .status(400)
      .json({ error: true, message: "Missing required fields" });
  }

  try {
    const updateQuery = `
        UPDATE disease
        SET disease_category = $1,
            name = $2,
            description = $3,
            vaccine_need = $4,
            dose_quantity = $5
        WHERE id = $6
        RETURNING *;
        `;
    const values = [
      disease_category || null,
      name,
      description || null,
      vaccine_need,
      dose_quantity,
      id,
    ];
    const result = await query(updateQuery, values);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: true, message: "Disease not found" });
    }

    return res
      .status(200)
      .json({ message: "Disease updated", data: result.rows[0] });
  } catch (error) {
    console.error("Error updating disease:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
}

// Delete disease by ID
export async function deleteDisease(req, res) {
  const { id } = req.params;

  try {
    const deleteQuery = "DELETE FROM disease WHERE id = $1 RETURNING *;";
    const result = await query(deleteQuery, [id]);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: true, message: "Disease not found" });
    }

    return res
      .status(200)
      .json({ message: "Disease deleted", data: result.rows[0] });
  } catch (error) {
    console.error("Error deleting disease:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
}

// Create a disease record of student
export async function createDiseaseRecord(req, res) {
  const {
    student_id,
    disease_id,
    detect_date,
    cure_date,
    location_cure,
    prescription,
    diagnosis,
    admission_date,
    discharge_date,
    cur_status,
    create_by,
  } = req.body;

  if (!student_id || !disease_id) {
    return res
      .status(400)
      .json({ error: true, message: "Missing required fields" });
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

    // Check if the disease exists
    const diseases = await query("SELECT id FROM disease WHERE id = $1;", [
      disease_id,
    ]);
    if (diseases.rowCount === 0) {
      return res
        .status(404)
        .json({ error: true, message: "Disease not found" });
    }

    const insertQuery = `
        INSERT INTO disease_record (
          student_id, 
          disease_id, 
          detect_date, 
          cure_date, 
          location_cure, 
          prescription,   
          diagnosis, 
          admission_date, 
          discharge_date, 
          cur_status, 
          create_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *;
        `;
    const values = [
      student_id,
      disease_id,
      detect_date,
      cure_date || null,
      location_cure || null,
      prescription || null,
      diagnosis || null,
      admission_date || null,
      discharge_date || null,
      cur_status || null,
      create_by || null,
    ];
    const result = await query(insertQuery, values);

    return res
      .status(201)
      .json({ message: "Disease record created", data: result.rows[0] });
  } catch (error) {
    console.error("Error creating disease record:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
}

// Update a disease record by ID
export async function updateDiseaseRecord(req, res) {
  const { id } = req.params;
  const {
    detect_date,
    cure_date,
    location_cure,
    prescription,
    diagnosis,
    admission_date,
    discharge_date,
    cur_status,
    at_school,
  } = req.body;

  try {
    // Check if the disease record exists
    const records = await query(
      "SELECT id FROM disease_record WHERE id = $1;",
      [id]
    );
    if (records.rowCount === 0) {
      return res
        .status(404)
        .json({ error: true, message: "Disease record not found" });
    }
    const updateQuery = `
        UPDATE disease_record
        SET detect_date = $1,
            cure_date = $2,
            location_cure = $3,
            prescription = $4,
            diagnosis = $5,
            admission_date = $6,
            discharge_date = $7,
            cur_status = $8,
            at_school = $9
        WHERE id = $10
        RETURNING *;
        `;
    const values = [
      detect_date || null,
      cure_date || null,
      location_cure || null,
      prescription || null,
      diagnosis || null,
      admission_date || null,
      discharge_date || null,
      cur_status || null,
      at_school || null,
      id,
    ];
    const result = await query(updateQuery, values);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: true, message: "Disease record not found" });
    }

    return res
      .status(200)
      .json({ message: "Disease record updated", data: result.rows[0] });
  } catch (error) {
    console.error("Error updating disease record:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
}

// Delete a disease record by ID
export async function deleteDiseaseRecord(req, res) {
  const { id } = req.params;

  try {
    const deleteQuery = "DELETE FROM disease_record WHERE id = $1 RETURNING *;";
    const result = await query(deleteQuery, [id]);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: true, message: "Disease record not found" });
    }

    return res
      .status(200)
      .json({ message: "Disease record deleted", data: result.rows[0] });
  } catch (error) {
    console.error("Error deleting disease record:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
}

// Get all disease records of a student
export async function getAllDiseaseRecords(req, res) {
  const { id } = req.params;
  const student_id = id;
  if (!student_id) {
    return res.status(400).json({ error: true, message: "Missing student ID" });
  }

  try {
    // Check if the student exists
    const studentCheckQuery = await query(
      "SELECT id FROM student WHERE id = $1;",
      [student_id]
    );
    if (studentCheckQuery.rowCount === 0) {
      return res
        .status(404)
        .json({ error: true, message: "Student not found" });
    }

    const selectQuery = `
        SELECT * FROM disease_record
        WHERE student_id = $1;
    `;
    const result = await query(selectQuery, [student_id]);

    return res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error("Error fetching disease records:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
}

// Get all disease records of a student by disease_category(Bệnh mãn tính, Bệnh truyền nhiễm, Bệnh thông thường)
export async function getDiseaseRecordsByCategory(req, res) {
  const { id, disease_category } = req.params;
  const student_id = id;

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

    // Check if the disease category is valid
    const validCategories = [
      "Bệnh mãn tính",
      "Bệnh truyền nhiễm",
      "Bệnh thông thường",
    ];
    if (!validCategories.includes(disease_category)) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid disease category" });
    }

    const selectQuery = `
        SELECT dr.*, d.name AS disease_name
        FROM disease_record dr
        JOIN disease d ON dr.disease_id = d.id
        WHERE dr.student_id = $1 AND d.disease_category = $2;
    `;
    const result = await query(selectQuery, [student_id, disease_category]);

    return res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error("Error fetching disease records by category:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
}
