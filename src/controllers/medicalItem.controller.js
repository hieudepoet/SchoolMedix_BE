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

export async function getAllSuppliers(req, res) {
  try {
    const result = await query(`SELECT * FROM Supplier`);
    return res.status(200).json({
      error: false,
      message: "Lấy danh sách nhà cung cấp thành công",
      data: result.rows,
    });
  } catch (err) {
    console.error("Error getting suppliers:", err);
    return res.status(500).json({
      error: true,
      message: "Lỗi server khi lấy danh sách nhà cung cấp",
    });
  }
}

export async function getSupplierById(req, res) {
  const { id } = req.params;
  try {
    const result = await query(`SELECT * FROM Supplier WHERE id = $1`, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: true,
        message: "Không tìm thấy nhà cung cấp",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Lấy thông tin nhà cung cấp thành công",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error getting supplier by id:", err);
    return res.status(500).json({
      error: true,
      message: "Lỗi server khi lấy thông tin nhà cung cấp",
    });
  }
}

export async function createSupplier(req, res) {
  const {
    name,
    description,
    address,
    email,
    phone,
    contact_person,
    tax_code,
  } = req.body;

  if (!name || !address || !email || !phone) {
    return res.status(400).json({
      error: true,
      message: "Thiếu thông tin bắt buộc (name, address, email, phone)",
    });
  }

  try {
    const result = await query(
      `
      INSERT INTO Supplier (name, description, address, email, phone, contact_person, tax_code)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [name, description, address, email, phone, contact_person, tax_code]
    );

    return res.status(201).json({
      error: false,
      message: "Tạo nhà cung cấp thành công",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error creating supplier:", err);
    return res.status(500).json({
      error: true,
      message: "Lỗi server khi tạo nhà cung cấp",
    });
  }
}

export async function updateSupplier(req, res) {
  const { id } = req.params;
  const {
    name,
    description,
    address,
    email,
    phone,
    contact_person,
    tax_code,
    status,
  } = req.body;

  try {
    const result = await query(
      `
      UPDATE Supplier
      SET name = $1,
          description = $2,
          address = $3,
          email = $4,
          phone = $5,
          contact_person = $6,
          tax_code = $7,
          status = $8
      WHERE id = $9
      RETURNING *
      `,
      [name, description, address, email, phone, contact_person, tax_code, status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: true,
        message: "Không tìm thấy nhà cung cấp để cập nhật",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Cập nhật nhà cung cấp thành công",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error updating supplier:", err);
    return res.status(500).json({
      error: true,
      message: "Lỗi server khi cập nhật nhà cung cấp",
    });
  }
}