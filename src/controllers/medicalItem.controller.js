import { query } from "../config/database.js";

export async function getMedicalItemById(req, res) {
  const { id } = req.params;
  try {
    const result = await query("SELECT * FROM MedicalItem WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: true, message: "Không tìm thấy vật tư / thuốc" });
    }
    return res.status(200).json({ error: false, message: "ok", data: result.rows[0] });
  } catch (err) {
    console.error("getMedicalItemById:", err);
    return res.status(500).json({ error: true, message: "Lỗi server khi lấy thông tin." });
  }
}

export async function getAllMedicalSupplies(req, res) {
  try {
    const result = await query("SELECT * FROM MedicalItem WHERE category = 'MEDICAL_SUPPLY'");
    return res.status(200).json({ error: false, message: "ok", data: result.rows });
  } catch (err) {
    console.error("getAllMedicalSupplies:", err);
    return res.status(500).json({ error: true, message: "Lỗi server khi lấy vật tư y tế." });
  }
}

export async function getAllMedications(req, res) {
  try {
    const result = await query("SELECT * FROM MedicalItem WHERE category = 'MEDICATION'");
    return res.status(200).json({ error: false, message: "ok", data: result.rows });
  } catch (err) {
    console.error("getAllMedications:", err);
    return res.status(500).json({ error: true, message: "Lỗi server khi lấy thuốc." });
  }
}

export async function updateMedicalItem(req, res) {
  const { id } = req.params;
  const { name, unit, description, exp_date } = req.body;

  if (!name || !unit || !exp_date) {
    return res.status(400).json({
      error: true,
      message: "Thiếu tên vật tư, tên đơn vị hoặc ngày hết hạn",
    });
  }

  try {
    const result = await query(
      `
      UPDATE MedicalItem 
      SET name = $1, unit = $2, description = $3, exp_date = $4 
      WHERE id = $5 
      RETURNING *
    `,
      [name, unit, description, exp_date, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: true, message: "Không tìm thấy để cập nhật" });
    }

    return res.status(200).json({ error: false, message: "Cập nhật thành công", data: result.rows[0] });
  } catch (err) {
    console.error("updateMedicalItem:", err);
    return res.status(500).json({ error: true, message: "Lỗi server khi cập nhật." });
  }
}

export async function createNewMedication(req, res) {
  const { name, unit, description, exp_date } = req.body;

  if (!name || !unit || !exp_date) {
    return res.status(400).json({
      error: true,
      message: "Thiếu tên vật tư, tên đơn vị hoặc ngày hết hạn",
    });
  }

  try {
    const result = await query(
      `
      INSERT INTO MedicalItem (name, unit, quantity, description, exp_date, category)
      VALUES ($1, $2, 0, $3, $4, 'MEDICATION')
      RETURNING *
    `,
      [name, unit, description, exp_date]
    );

    return res.status(201).json({ error: false, message: "Tạo thuốc thành công", data: result.rows[0] });
  } catch (err) {
    console.error("createNewMedication:", err);
    return res.status(500).json({ error: true, message: "Lỗi server khi tạo thuốc." });
  }
}

export async function createNewMedicalSupply(req, res) {
  const { name, unit, description, exp_date } = req.body;

  if (!name || !unit || !exp_date) {
    return res.status(400).json({
      error: true,
      message: "Thiếu tên vật tư, tên đơn vị hoặc ngày hết hạn",
    });
  }

  try {
    const result = await query(
      `
      INSERT INTO MedicalItem (name, unit, quantity, description, exp_date, category)
      VALUES ($1, $2, 0, $3, $4, 'MEDICAL_SUPPLY')
      RETURNING *
    `,
      [name, unit, description, exp_date]
    );

    return res.status(201).json({ error: false, message: "Tạo vật tư thành công", data: result.rows[0] });
  } catch (err) {
    console.error("createNewMedicalSupply:", err);
    return res.status(500).json({ error: true, message: "Lỗi server khi tạo vật tư." });
  }
}
