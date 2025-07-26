import { query } from "../config/database.js";

export async function getMedicalItemById(req, res) {
  const { id } = req.params;
  try {
    const result = await query(`
        SELECT mi.*, COALESCE(SUM(ti.transaction_quantity), 0) AS quantity
        FROM MedicalItem mi
        LEFT JOIN TransactionItems ti ON mi.id = ti.medical_item_id
        WHERE MI.ID = $1
        GROUP BY mi.id
        ORDER BY mi.id
      `, [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: true, message: "Không tìm thấy vật tư / thuốc" });
    }
    return res.status(200).json({ error: false, message: "ok", data: result.rows[0] });
  } catch (err) {
    console.error("getMedicalItemById:", err);
    return res.status(500).json({ error: true, message: "Lỗi server khi lấy thông tin." });
  }
}

export async function getAllMedicalItems(req, res) {
  try {
    const result = await query(`
        SELECT mi.*, COALESCE(SUM(ti.transaction_quantity), 0) AS quantity
        FROM MedicalItem mi
        LEFT JOIN TransactionItems ti ON mi.id = ti.medical_item_id
        GROUP BY mi.id
        ORDER BY mi.id
      `);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: true, message: "Không tìm thấy vật tư / thuốc" });
    }
    return res.status(200).json({ error: false, message: "ok", data: result.rows });
  } catch (err) {
    return res.status(500).json({ error: true, message: "Lỗi server khi lấy thông tin." });
  }
}

export async function getAllMedicalSupplies(req, res) {
  try {
    const result = await query(`SELECT mi.*, COALESCE(SUM(ti.transaction_quantity), 0) AS quantity
        FROM MedicalItem mi
        LEFT JOIN TransactionItems ti ON mi.id = ti.medical_item_id
        WHERE mi.category = 'MEDICAL_SUPPLY'
        GROUP BY mi.id
        ORDER BY mi.id`);
    return res.status(200).json({ error: false, message: "ok", data: result.rows });
  } catch (err) {
    console.error("getAllMedicalSupplies:", err);
    return res.status(500).json({ error: true, message: "Lỗi server khi lấy vật tư y tế." });
  }
}

export async function getAllMedications(req, res) {
  try {
    const result = await query(`SELECT mi.*, COALESCE(SUM(ti.transaction_quantity), 0) AS quantity
        FROM MedicalItem mi
        LEFT JOIN TransactionItems ti ON mi.id = ti.medical_item_id
        WHERE mi.category = 'MEDICATION'
        GROUP BY mi.id
        ORDER BY mi.id`);
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


export async function checkAdequateQuantityForItems(incoming_medical_items, purpose_id) {
  let is_adequate_all = true;

  if (incoming_medical_items.length !== 0) {
    const purpose_result = await query(`select multiply_for from transactionpurpose where id = $1`, [purpose_id]);
    const multiply_for = purpose_result.rows[0].multiply_for;

    const current_items_quantity = await getCurrentItems();

    const quantity_map = new Map();

    for (const row of current_items_quantity) {
      quantity_map.set(row.id, row.quantity);
    }

    for (const item of incoming_medical_items) {
      const item_quantity = quantity_map.get(item.medical_item_id) ?? 0;

      if (item_quantity + multiply_for * item.transaction_quantity < 0) {
        is_adequate_all = false;
        break;
      }
    }
  }
  return is_adequate_all;
}


export async function getCurrentItems() {
  const result = await query(`
    SELECT mi.*, COALESCE(SUM(ti.transaction_quantity), 0) AS quantity
    FROM MedicalItem mi
    LEFT JOIN TransactionItems ti ON mi.id = ti.medical_item_id
    GROUP BY mi.id
	  ORDER BY mi.id
  `);
  return result.rows;
}

export async function createNewTransaction(purpose_id, note, transaction_date, medical_items, supplier_id = null) {
  // check if there are enough quanity of medical item to use
  let is_valid_transaction_quantity = await checkAdequateQuantityForItems(medical_items, purpose_id);
  if (!is_valid_transaction_quantity) {
    return;
  }
  // if yes, then inserting new transaction
  const transaction_result = await query(
    `
      INSERT INTO InventoryTransaction (purpose_id, note, transaction_date, supplier_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id
      `,
    [purpose_id, note, transaction_date, supplier_id]
  );

  const transaction_id = transaction_result.rows[0].id;

  // Chèn vào bảng TransactionItems
  await createNewMedicalItemsForTransaction(transaction_id, medical_items);

  return transaction_id;
}

export async function eraseAllTransactionItemsByTransactionID(transaction_id) {
  const result = await query(
    `DELETE FROM TransactionItems WHERE transaction_id = $1`,
    [transaction_id]
  );
}

export async function createNewMedicalItemsForTransaction(transaction_id, medical_items, purpose_id) {

  await eraseAllTransactionItemsByTransactionID(transaction_id);
  const purpose_result = await query(`select multiply_for from transactionpurpose where id = $1`, [purpose_id]);
  const multiply_for = purpose_result.rows[0].multiply_for;

  // check if there are enough quanity of medical item to use
  let is_valid_transaction_quantity = await checkAdequateQuantityForItems(medical_items, purpose_id);
  if (!is_valid_transaction_quantity) {
    return;
  }

  const values = [];
  const placeholders = [];

  for (let i = 0; i < medical_items.length; i++) {
    const { medical_item_id, transaction_quantity } = medical_items[i];
    values.push(transaction_id, medical_item_id, transaction_quantity);
    placeholders.push(`($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`);
  }


  if (values.length > 0) {
    const insert_items_query = `
        INSERT INTO TransactionItems (transaction_id, medical_item_id, transaction_quantity)
        VALUES ${placeholders.join(", ")}
      `;

    await query(insert_items_query, values);
  }
}


export async function getAllInventoryTransactions(req, res) {
  try {
    const result = await query(`
      SELECT 
  it.*, 
  tp.title AS purpose_title,
  s.name AS supplier_name,
  json_agg(
    json_build_object(
      'id', mi.id,
      'name', mi.name,
      'unit', mi.unit,
      'description', mi.description,
      'exp_date', mi.exp_date,
      'category', mi.category,
      'transaction_quantity', ti.transaction_quantity
    )
  ) AS medical_items
FROM InventoryTransaction it
LEFT JOIN TransactionPurpose tp ON it.purpose_id = tp.id
LEFT JOIN Supplier s ON it.supplier_id = s.id
LEFT JOIN TransactionItems ti ON it.id = ti.transaction_id
LEFT JOIN MedicalItem mi ON ti.medical_item_id = mi.id
GROUP BY it.id, tp.title, s.name
ORDER BY it.transaction_date DESC;

    `);

    return res.status(200).json({
      error: false,
      message: "Lấy danh sách giao dịch thành công",
      data: result.rows,
    });
  } catch (error) {
    console.error("getAllInventoryTransactions:", error);
    return res.status(500).json({
      error: true,
      message: "Lỗi server khi lấy danh sách giao dịch",
    });
  }
}

export async function getInventoryTransactionById(req, res) {
  const { id } = req.params;

  try {
    const result = await query(
      `
      SELECT 
        it.*, 
        tp.title AS purpose_title, 
        s.name AS supplier_name,
        json_agg(
          json_build_object(
            'id', mi.id,
            'name', mi.name,
            'unit', mi.unit,
            'description', mi.description,
            'exp_date', mi.exp_date,
            'category', mi.category,
            'transaction_quantity', ti.transaction_quantity
          )
        ) AS medical_items
      FROM InventoryTransaction it
      LEFT JOIN TransactionPurpose tp ON it.purpose_id = tp.id
      LEFT JOIN Supplier s ON it.supplier_id = s.id
      LEFT JOIN TransactionItems ti ON it.id = ti.transaction_id
      LEFT JOIN MedicalItem mi ON ti.medical_item_id = mi.id
      WHERE it.id = $1
      GROUP BY it.id, tp.title, s.name
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: true,
        message: "Không tìm thấy giao dịch",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Lấy giao dịch thành công",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("getInventoryTransactionById:", error);
    return res.status(500).json({
      error: true,
      message: "Lỗi server khi lấy giao dịch",
    });
  }
}

export async function getInventoryTransactionsBySupplier(req, res) {
  const { id } = req.params;

  try {
    const result = await query(
      `
      SELECT 
        it.*, 
        tp.title AS purpose_title,
        json_agg(
          json_build_object(
            'id', mi.id,
            'name', mi.name,
            'unit', mi.unit,
            'description', mi.description,
            'exp_date', mi.exp_date,
            'category', mi.category,
            'transaction_quantity', ti.transaction_quantity
          )
        ) AS medical_items
      FROM InventoryTransaction it
      LEFT JOIN TransactionPurpose tp ON it.purpose_id = tp.id
      LEFT JOIN TransactionItems ti ON it.id = ti.transaction_id
      LEFT JOIN MedicalItem mi ON ti.medical_item_id = mi.id
      WHERE it.supplier_id = $1
      GROUP BY it.id, tp.title
      ORDER BY it.transaction_date DESC
      `,
      [id]
    );

    return res.status(200).json({
      error: false,
      message: "Lấy giao dịch theo nhà cung cấp thành công",
      data: result.rows,
    });
  } catch (error) {
    console.error("getInventoryTransactionsBySupplier:", error);
    return res.status(500).json({
      error: true,
      message: "Lỗi server khi lấy giao dịch theo nhà cung cấp",
    });
  }
}

export async function getTransactionsForDailyHealthRecords(req, res) {
  try {
    const result = await query(`
      SELECT 
        it.*, 
        tp.title AS purpose_title,
        json_agg(
          json_build_object(
            'id', mi.id,
            'name', mi.name,
            'unit', mi.unit,
            'description', mi.description,
            'exp_date', mi.exp_date,
            'category', mi.category,
            'transaction_quantity', ti.transaction_quantity
          )
        ) AS medical_items
      FROM InventoryTransaction it
      JOIN TransactionPurpose tp ON it.purpose_id = tp.id
      LEFT JOIN TransactionItems ti ON it.id = ti.transaction_id
      LEFT JOIN MedicalItem mi ON ti.medical_item_id = mi.id
      WHERE it.purpose_id = 1
      GROUP BY it.id, tp.title
      ORDER BY it.transaction_date DESC
    `);

    return res.status(200).json({
      error: false,
      message: "Lấy giao dịch dùng cho học sinh / nhân viên thành công",
      data: result.rows,
    });
  } catch (error) {
    console.error("getTransactionsForDailyHealthRecords:", error);
    return res.status(500).json({
      error: true,
      message: "Lỗi server khi lấy giao dịch",
    });
  }
}

export async function getInventoryTransactionsByPurposeID(req, res) {
  const { id } = req.params;

  try {
    const result = await query(`
      SELECT it.*, tp.title AS purpose_title, s.name AS supplier_name,
             json_agg(json_build_object(
               'id', mi.id,
               'name', mi.name,
               'unit', mi.unit,
               'description', mi.description,
               'exp_date', mi.exp_date,
               'category', mi.category,
               'transaction_quantity', ti.transaction_quantity
             )) AS medical_items
      FROM InventoryTransaction it
      LEFT JOIN TransactionPurpose tp ON it.purpose_id = tp.id
      LEFT JOIN Supplier s ON it.supplier_id = s.id
      LEFT JOIN TransactionItems ti ON it.id = ti.transaction_id
      LEFT JOIN MedicalItem mi ON ti.medical_item_id = mi.id
      WHERE it.purpose_id = $1
      GROUP BY it.id, tp.title, s.name
      ORDER BY it.transaction_date DESC
    `, [id]);

    return res.status(200).json({
      error: false,
      message: "Lấy giao dịch theo purpose thành công",
      data: result.rows,
    });
  } catch (error) {
    console.error("getInventoryTransactionsByPurposeId:", error);
    return res.status(500).json({
      error: true,
      message: "Lỗi server khi lấy giao dịch theo purpose",
    });
  }
}


export async function checkAdequateQuantityForAItem(req, res) {
  const { medical_item_id, incoming_quantity, purpose_id } = req.body;

  try {
    if (!purpose_id) {
      return res.status(400).json({
        error: true,
        message: "Thieu purpose id",
      });
    }

    const purpose_result = await query(`select multiply_for from transactionpurpose where id = $1`, [purpose_id]);
    const multiply_for = purpose_result.rows[0].multiply_for;
    console.log(multiply_for);
    const current_items_quantity = await getCurrentItems();
    const quantity_map = new Map();

    for (const row of current_items_quantity) {
      quantity_map.set(row.id, row.quantity);
    }

    const current_quantity = quantity_map.get(medical_item_id) ?? 0;
    const is_adequate = current_quantity + multiply_for * incoming_quantity >= 0;

    return res.status(200).json({
      error: false,
      message: "Check adequate quantity success",
      data: {
        is_adequate,
        current_quantity: parseInt(current_quantity),
        incoming_quantity: multiply_for * incoming_quantity,
      },
    });
  } catch (err) {
    console.error("checkAdequateQuantityForAItem:", err);
    return res.status(500).json({
      error: true,
      message: "Lỗi server khi kiểm tra số lượng tồn kho",
    });
  }
}

export async function createInventoryTransaction(req, res) {
  const { purpose_id, note, transaction_date, medical_items, supplier_id } = req.body;

  if (!purpose_id || !transaction_date || !Array.isArray(medical_items) || medical_items.length === 0) {
    return res.status(400).json({
      error: true,
      message: "Missing required fields or empty medical_items array",
    });
  }

  try {
    const transaction_id = await createNewTransaction(purpose_id, note, transaction_date, medical_items, supplier_id = null)

    return res.status(201).json({
      error: false,
      message: "Tạo giao dịch thành công",
      transaction_id
    });
  } catch (err) {
    console.error("createInventoryTransaction:", err);
    return res.status(500).json({
      error: true,
      message: "Lỗi server khi tạo giao dịch",
    });
  }
}

export async function updateInventoryTransaction(req, res) {
  const { id } = req.params;
  const { purpose_id, note, transaction_date, medical_items, supplier_id } = req.body;

  if (!purpose_id || !transaction_date || !Array.isArray(medical_items)) {
    return res.status(400).json({
      error: true,
      message: "Missing required fields or empty medical_items array",
    });
  }

  try {
    const updateResult = await query(
      `UPDATE InventoryTransaction 
       SET purpose_id = $1, note = $2, transaction_date = $3, supplier_id = $4
       WHERE id = $5
       RETURNING *`,
      [purpose_id, note || "", transaction_date, supplier_id || null, id]
    );

    if (updateResult.rowCount === 0) {
      return res.status(404).json({ error: true, message: "Không tìm thấy giao dịch để cập nhật" });
    }

    await createNewMedicalItemsForTransaction(updateResult.rows[0].id, medical_items)

    return res.status(200).json({
      error: false,
      message: "Cập nhật giao dịch thành công",
      data: updateResult.rows[0],
    });
  } catch (err) {
    console.error("updateInventoryTransaction:", err);
    return res.status(500).json({
      error: true,
      message: "Lỗi server khi cập nhật giao dịch",
    });
  }
}
