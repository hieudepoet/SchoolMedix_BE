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
    return res.status(200).json({
      error: false,
      message: "Fetching data successfully",
      data: result.rows,
    });
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

export async function getVaccinesByDisease(req, res) {
  const { id } = req.params;

  try {
    const vaccineQuery = `
      SELECT v.*
      FROM vaccine v
      INNER JOIN vaccine_disease vd ON vd.vaccine_id = v.id
      WHERE vd.disease_id = $1
    `;
    const result = await query(vaccineQuery, [id]);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: true, message: "No vaccines found for this disease" });
    }

    return res.status(200).json({
      error: false,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching vaccines by disease:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
}
