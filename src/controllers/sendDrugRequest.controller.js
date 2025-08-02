import { pool, query } from "../config/database.js";
import multer from "multer";
import { uploadFileToSupabaseStorage } from "../services/index.js";
import dayjs from 'dayjs';
import format from 'pg-format';

export async function createRequest(req, res) {
      const {
            student_id,
            create_by,
            diagnosis,
            schedule_send_date,
            start_intake_date,
            end_intake_date,
            note,
            request_items,
            prescription_img_urls,
      } = req.body;

      // Validate
      if (!student_id) return res.status(400).json({ error: true, message: "Thiếu student_id." });
      if (!create_by) return res.status(400).json({ error: true, message: "Thiếu người gửi." });
      if (!schedule_send_date) return res.status(400).json({ error: true, message: "Thiếu ngày hẹn gửi." });
      if (!start_intake_date || !end_intake_date) return res.status(400).json({ error: true, message: "Thiếu khoảng ngày cho học sinh uống thuốc." });
      if (!Array.isArray(request_items) || request_items.length === 0) return res.status(400).json({ error: true, message: "Thiếu các đơn vị thuốc." });

      const client = await pool.connect();
      try {
            await client.query('BEGIN');

            // 1. Tạo SendDrugRequest
            const result = await client.query(`
                  INSERT INTO SendDrugRequest (
                  student_id, create_by, diagnosis, schedule_send_date,
                  start_intake_date, end_intake_date, note, status, prescription_img_urls
                  ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'PROCESSING', $8)
                  RETURNING *`,
                  [
                        student_id,
                        create_by,
                        diagnosis,
                        schedule_send_date,
                        start_intake_date,
                        end_intake_date,
                        note || null,
                        prescription_img_urls || [],
                  ]
            );
            const sendDrugRequest = result.rows[0];
            const request_id = sendDrugRequest.id;

            // 2. Chèn từng thuốc (RequestItem)
            const insertedItems = [];

            for (const item of request_items) {
                  const intakeTemplates = Array.isArray(item.intake_templates)
                        ? item.intake_templates
                        : item.intake_templates.split(',').map(s => s.trim()).filter(Boolean);

                  const itemResult = await client.query(`
                        INSERT INTO RequestItem (request_id, name, intake_templates, dosage_usage)
                        VALUES ($1, $2, $3::intake_time_enum[], $4)
                        RETURNING *`,
                        [request_id, item.name, intakeTemplates, item.dosage_usage || item.dosageUsage]
                  );

                  insertedItems.push(itemResult.rows[0]);
            }

            await client.query('COMMIT');
            return res.status(200).json({
                  error: false,
                  message: 'Tạo thành công đơn gửi thuốc và lịch uống thuốc.',
                  data: sendDrugRequest
            });

      } catch (err) {
            await client.query('ROLLBACK');
            console.error("❌ Lỗi khi tạo đơn thuốc:", err);
            return res.status(500).json({
                  error: true,
                  message: "Lỗi server khi tạo đơn thuốc.",
                  detail: err.message
            });
      } finally {
            client.release();
      }
}

export async function updateRequest(req, res) {
      const { id } = req.params;
      const {
            student_id,
            create_by,
            diagnosis,
            schedule_send_date,
            start_intake_date,
            end_intake_date,
            note,
            request_items,
            prescription_img_urls,
      } = req.body;

      // Validate đầu vào
      if (!id) return res.status(400).json({ error: true, message: "Thiếu ID đơn gửi." });
      if (!student_id) return res.status(400).json({ error: true, message: "Thiếu student_id." });
      if (!create_by) return res.status(400).json({ error: true, message: "Thiếu người gửi." });
      if (!schedule_send_date) return res.status(400).json({ error: true, message: "Thiếu ngày hẹn gửi." });
      if (!start_intake_date || !end_intake_date) return res.status(400).json({ error: true, message: "Thiếu khoảng ngày uống thuốc." });
      if (!Array.isArray(request_items) || request_items.length === 0) return res.status(400).json({ error: true, message: "Thiếu các đơn vị thuốc." });

      const client = await pool.connect();
      try {
            await client.query('BEGIN');

            // Cập nhật SendDrugRequest
            const result = await client.query(`
      UPDATE SendDrugRequest 
      SET 
        student_id = $1, 
        create_by = $2, 
        diagnosis = $3, 
        schedule_send_date = $4, 
        start_intake_date = $5,
        end_intake_date = $6,
        note = $7, 
        prescription_img_urls = $8, 
        status = 'PROCESSING'
      WHERE id = $9
      RETURNING *`,
                  [
                        student_id,
                        create_by,
                        diagnosis || null,
                        schedule_send_date,
                        start_intake_date,
                        end_intake_date,
                        note || null,
                        prescription_img_urls || [],
                        id
                  ]
            );

            if (result.rows.length === 0) {
                  await client.query('ROLLBACK');
                  return res.status(404).json({ error: true, message: "Không tìm thấy đơn với ID này." });
            }

            const sendDrugRequest = result.rows[0];

            // Xóa toàn bộ RequestItem cũ
            await client.query(`DELETE FROM RequestItem WHERE request_id = $1`, [id]);

            // Chèn lại request_items mới
            for (const item of request_items) {
                  const intakeTemplates = Array.isArray(item.intake_templates)
                        ? item.intake_templates
                        : item.intake_templates.split(',').map(s => s.trim()).filter(Boolean);

                  await client.query(`
        INSERT INTO RequestItem (request_id, name, intake_templates, dosage_usage)
        VALUES ($1, $2, $3::intake_time_enum[], $4)`,
                        [id, item.name, intakeTemplates, item.dosage_usage || item.dosageUsage]
                  );
            }

            await client.query('COMMIT');
            return res.status(200).json({
                  error: false,
                  message: 'Cập nhật đơn gửi thuốc thành công.',
                  data: sendDrugRequest
            });

      } catch (err) {
            await client.query('ROLLBACK');
            console.error("❌ Lỗi khi cập nhật đơn thuốc:", err);
            return res.status(500).json({
                  error: true,
                  message: "Lỗi server khi cập nhật đơn thuốc.",
                  detail: err.message
            });
      } finally {
            client.release?.();
      }
}

export async function acceptRequest(req, res) {
      const { id } = req.params;
      if (!id) {
            return res.status(400).json({ error: true, message: "Thiếu ID đơn gửi." });
      }

      try {
            const result = await query(
                  "UPDATE SendDrugRequest SET status = 'ACCEPTED' WHERE id = $1 RETURNING *",
                  [id]
            );
            if (result.rows.length === 0) {
                  return res.status(404).json({ error: false, message: "Không tìm thấy đơn với ID này." });
            }

            return res.status(200).json({ error: false, message: "Đã đồng ý đơn." });
      } catch (err) {
            console.error("Gặp lỗi khi chấp nhận đơn thuốc.");
            return res.status(500).json({ error: true, message: "Gặp lỗi khi chấp nhận đơn thuốc." });
      }
}

export async function refuseRequest(req, res) {
      const { id } = req.params;
      if (!id) {
            return res.status(400).json({ error: true, message: "Thiếu ID đơn gửi." });
      }

      try {
            const result = await query(
                  "UPDATE SendDrugRequest SET status = 'REFUSED' WHERE id = $1 RETURNING *",
                  [id]
            );
            if (result.rows.length === 0) {
                  return res.status(404).json({ error: false, message: "Không tìm thấy đơn với ID này." });
            }

            return res.status(200).json({ error: false, message: "Đã từ chối đơn." });
      } catch (err) {
            console.error("Gặp lỗi khi từ chối đơn thuốc.");
            return res.status(500).json({ error: true, message: "Gặp lỗi khi từ chối đơn thuốc." });
      }
}

export async function cancelRequest(req, res) {
      const { id } = req.params;
      if (!id) {
            return res.status(400).json({ error: true, message: "Thiếu ID đơn gửi." });
      }

      try {
            const result = await query(
                  "UPDATE SendDrugRequest SET status = 'CANCELLED' WHERE id = $1 RETURNING *",
                  [id]
            );
            if (result.rows.length === 0) {
                  return res.status(404).json({ error: false, message: "Không tìm thấy đơn với ID này." });
            }

            return res.status(200).json({ error: false, message: "Đã hủy đơn." });
      } catch (err) {
            console.error("Gặp lỗi khi hủy đơn thuốc.");
            return res.status(500).json({ error: true, message: "Gặp lỗi khi hủy đơn thuốc." });
      }
}

export async function receiveDrug(req, res) {
      const { id } = req.params;
      const { receive_at } = req.body;


      if (!id) {
            return res.status(400).json({ error: true, message: "Thiếu ID đơn gửi." });
      }

      if (!receive_at) {
            return res.status(400).json({ error: true, message: "Thiếu thời gian đã nhận đơn gửi." });
      }

      const client = await pool.connect();

      try {
            await client.query("BEGIN");

            const result = await client.query(
                  `UPDATE SendDrugRequest 
                   SET status = 'RECEIVED', receive_at = $2 
                   WHERE id = $1 
                   RETURNING *`,
                  [id, receive_at]
            );

            if (result.rows.length === 0) {
                  await client.query("ROLLBACK");
                  return res.status(404).json({ error: true, message: "Không tìm thấy đơn với ID này." });
            }

            await generateScheduleForRequestID(id, client);

            await client.query("COMMIT");

            return res.status(200).json({
                  error: false,
                  message: "Đã nhận thuốc và tạo lịch uống thuốc.",
                  data: result.rows[0]
            });

      } catch (err) {
            await client.query("ROLLBACK");
            console.error("❌ Gặp lỗi khi nhận đơn thuốc hoặc tạo lịch:", err);
            return res.status(500).json({
                  error: true,
                  message: "Gặp lỗi khi nhận và tạo lịch uống thuốc.",
                  detail: err.message
            });
      } finally {
            client.release();
      }
}


export async function doneTakingMedicine(req, res) {
      const { id } = req.params;
      if (!id) {
            return res.status(400).json({ error: true, message: "Thiếu ID đơn gửi." });
      }

      try {
            const result = await query(
                  "UPDATE SendDrugRequest SET status = 'DONE' WHERE id = $1 RETURNING *",
                  [id]
            );
            if (result.rows.length === 0) {
                  return res.status(404).json({ error: false, message: "Không tìm thấy đơn với ID này." });
            }

            return res.status(200).json({ message: "Đã cho học sinh uống thuốc.", error: false });
      } catch (err) {
            console.error("Gặp lỗi khi cập nhật đơn thuốc: " + err);
            return res.status(500).json({ error: true, message: "Gặp lỗi khi cập nhật đơn thuốc." });
      }
}

export async function retrieveRequestByID(req, res) {
      const { id } = req.params;

      if (!id) {
            return res.status(400).json({ error: true, message: "Thiếu ID đơn gửi." });
      }

      try {
            const result = await query(
                  `
      SELECT 
  a.*,
  s.name AS student_name,
  c.name AS class_name,
  COALESCE(json_agg(
    json_build_object(
      'id', b.id,
      'name', b.name,
      'intake_templates', array_to_json(b.intake_templates),
      'dosage_usage', b.dosage_usage
    )
  ) FILTER (WHERE b.id IS NOT NULL), '[]') AS request_items
FROM senddrugrequest a
LEFT JOIN requestitem b ON a.id = b.request_id
JOIN student s ON s.id = a.student_id
JOIN class c ON c.id = s.class_id
WHERE a.id = $1
GROUP BY a.id, s.name, c.name;

      `,
                  [id]
            );

            if (result.rows.length === 0) {
                  return res.status(404).json({ error: false, message: "Không tìm thấy đơn với ID này." });
            }

            return res.status(200).json({ error: false, data: result.rows[0] });
      } catch (err) {
            console.error("Gặp lỗi khi truy xuất đơn gửi thuốc: " + err);
            return res.status(500).json({
                  error: true,
                  message: "Gặp lỗi khi truy xuất đơn gửi thuốc.",
                  detail: err.message,
            });
      }
}
export async function getSendDrugRequestsOfStudent(req, res) {
      const { student_id } = req.params;

      if (!student_id) {
            return res.status(400).json({ error: true, message: "Thiếu student_id." });
      }

      try {
            const result = await query(
                  `SELECT 
    a.*,
    s.name AS student_name,
    c.name AS class_name,
    COALESCE(
        json_agg(
            json_build_object(
                'id', b.id,
                'name', b.name,
                'intake_templates', array_to_json(b.intake_templates),
                'dosage_usage', b.dosage_usage
            )
        ) FILTER (WHERE b.id IS NOT NULL), '[]'
    ) AS request_items
FROM senddrugrequest a
LEFT JOIN requestitem b ON a.id = b.request_id
JOIN student s ON s.id = a.student_id
JOIN class c ON c.id = s.class_id
WHERE a.student_id = $1
GROUP BY a.id, s.name, c.name
ORDER BY a.id DESC;
`,
                  [student_id]
            );

            if (result.rows.length === 0) {
                  return res.status(404).json({ error: false, message: "Không có yêu cầu gửi thuốc nào." });
            }

            return res.status(200).json({ error: false, data: result.rows });
      } catch (err) {
            console.error("Lỗi khi lấy send-drug-requests:", err);
            return res.status(500).json({ error: true, message: "Lỗi hệ thống." });
      }
}


export async function listRequests(req, res) {
      try {
            const result = await query(`
      SELECT 
        a.*, 
        s.name AS student_name, 
        c.name AS class_name,
        COALESCE(json_agg(
          json_build_object(
            'id', b.id,
            'name', b.name,
            'intake_templates', array_to_json(b.intake_templates),
            'dosage_usage', b.dosage_usage
          )
        ) FILTER (WHERE b.id IS NOT NULL), '[]') AS request_items
      FROM senddrugrequest a
      LEFT JOIN requestitem b ON a.id = b.request_id
      JOIN student s ON s.id = a.student_id
      JOIN class c ON s.class_id = c.id
      GROUP BY a.id, s.name, c.name
      ORDER BY a.id;
    `);

            if (result.rows.length === 0) {
                  return res.status(404).json({ error: false, message: "Không có đơn gửi nào." });
            }

            return res.status(200).json({ error: false, data: result.rows });
      } catch (err) {
            console.error("Gặp lỗi khi truy xuất danh sách đơn gửi thuốc: " + err);
            return res.status(500).json({
                  error: true,
                  message: "Gặp lỗi khi truy xuất danh sách đơn gửi thuốc."
            });
      }
}


export async function generateScheduleForRequestID(request_id, client) {
      const reqRes = await client.query(
            `SELECT start_intake_date, end_intake_date, student_id 
     FROM SendDrugRequest WHERE id = $1`,
            [request_id]
      );
      if (reqRes.rows.length === 0) throw new Error(`Request ID ${request_id} not found.`);

      const { start_intake_date, end_intake_date, student_id } = reqRes.rows[0];

      const itemsRes = await client.query(`
    SELECT id, intake_templates FROM RequestItem WHERE request_id = $1`,
            [request_id]
      );

      const days = [];
      for (let d = dayjs(start_intake_date); !d.isAfter(end_intake_date); d = d.add(1, 'day')) {
            days.push(d.format('YYYY-MM-DD'));
      }

      const scheduleRows = []; // for MedicationSchedule
      const scheduleItemMap = []; // for MedicationScheduleItem

      for (const day of days) {
            for (const item of itemsRes.rows) {
                  const intakes = Array.isArray(item.intake_templates)
                        ? item.intake_templates
                        : (item.intake_templates || '').replace(/[{}"]/g, '').split(',').map(x => x.trim()).filter(Boolean);

                  for (const intake of intakes) {
                        if (!intake) continue;

                        // Push 1 MedicationSchedule row (returning id after insert)
                        scheduleRows.push({
                              request_id,
                              student_id,
                              date: day,
                              intake_template: intake,
                              request_item_id: item.id,
                        });
                  }
            }
      }

      if (scheduleRows.length === 0) return;

      // Step 1: Insert schedule and RETURN ids
      const insertedScheduleIds = [];
      for (const row of scheduleRows) {
            const result = await client.query(
                  `INSERT INTO MedicationSchedule (request_id, student_id, date, intake_template)
       VALUES ($1, $2, $3, $4) RETURNING id`,
                  [row.request_id, row.student_id, row.date, row.intake_template]
            );
            insertedScheduleIds.push({
                  schedule_id: result.rows[0].id,
                  request_item_id: row.request_item_id
            });
      }

      // Step 2: Insert to MedicationScheduleItem
      const msItems = insertedScheduleIds.map(row => [row.request_item_id, row.schedule_id]);
      const insertMappingQuery = format(`
    INSERT INTO MedicationScheduleItem (request_item_id, schedule_id)
    VALUES %L`, msItems);
      await client.query(insertMappingQuery);
}


export async function handleUploadPrescriptionImgs(req, res) {
      const upload = multer({ storage: multer.memoryStorage() }).array('images');

      upload(req, res, async function (err) {
            if (err) {
                  return res.status(500).json({ error: true, message: 'Lỗi khi xử lý file.' });
            }

            const files = req.files;

            if (!files || files.length === 0) {
                  return res.status(400).json({ error: true, message: 'Không có file ảnh nào được upload.' });
            }

            try {
                  const uploadPromises = files.map(file => {
                        const fileName = `${Date.now()}-${file.originalname}`;
                        return uploadFileToSupabaseStorage(file, "prescription-files", fileName);
                  });

                  const urls = await Promise.all(uploadPromises);

                  return res.status(200).json({
                        error: false,
                        message: "Upload ảnh thành công",
                        prescription_img_urls: urls,
                  });

            } catch (err) {
                  console.error("❌ Upload error:", err);
                  return res.status(500).json({
                        error: true,
                        message: `Lỗi hệ thống: ${err.message || err}`,
                  });
            }
      });
}

export async function tickForSuccessMedicationTaking(req, res) {
      const { id } = req.params;
      const { note, intake_time } = req.body;
      if (!id || !intake_time) return res.status(400).json({ error: true, message: 'Thiếu dữ liệu.' });

      try {
            const result = await query(
                  `UPDATE MedicationSchedule
       SET is_taken = TRUE, intake_time = $2, note = COALESCE($1, note)
       WHERE id = $3 RETURNING *`,
                  [note || null, intake_time, id]
            );
            if (result.rows.length === 0) return res.status(404).json({ error: true, message: 'Không tìm thấy.' });
            res.json({ error: false, message: 'Đã đánh dấu.', data: result.rows[0] });
      } catch (err) {
            console.error(err);
            res.status(500).json({ error: true, message: 'Lỗi server.' });
      }
}

// Bỏ đánh dấu đã uống
export async function untickForSuccessMedicationTaking(req, res) {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: true, message: 'Thiếu id.' });

      try {
            const result = await query(
                  `UPDATE MedicationSchedule
       SET is_taken = FALSE, intake_time = NULL, note = NULL
       WHERE id = $1 RETURNING *`,
                  [id]
            );
            if (result.rows.length === 0) return res.status(404).json({ error: true, message: 'Không tìm thấy.' });
            res.json({ error: false, message: 'Đã bỏ đánh dấu.', data: result.rows[0] });
      } catch (err) {
            console.error(err);
            res.status(500).json({ error: true, message: 'Lỗi server.' });
      }
}


// Danh sách ngày uống thuốc
export async function listMedicationScheduleDays(req, res) {
      try {
            const result = await query(`
      SELECT date, COUNT(*) AS total_medications,
      COUNT(*) FILTER (WHERE is_taken = TRUE) AS taken_medications
      FROM MedicationSchedule
      GROUP BY date ORDER BY date DESC`);
            res.json({ error: false, data: result.rows });
      } catch (err) {
            console.error(err);
            res.status(500).json({ error: true, message: 'Lỗi server.' });
      }
}

// Lấy lịch uống thuốc theo ngày (gộp theo intake_template)
export async function getMedicationScheduleByDay(req, res) {
      const { date } = req.query;
      if (!date) return res.status(400).json({ error: true, message: "Thiếu ngày." });

      try {
            const result = await query(`
      SELECT 
        ms.id AS medication_schedule_id,
        ms.intake_template,
        ms.is_taken,
        ms.note,
        ms.intake_time,
        ms.request_id,
        s.id AS student_id,
        s.name AS student_name,
        c.name AS class_name,
        ri.name AS item_name,
        ri.dosage_usage
      FROM MedicationSchedule ms
      JOIN student s ON s.id = ms.student_id
      JOIN class c ON s.class_id = c.id
      JOIN MedicationScheduleItem msi ON msi.schedule_id = ms.id
      JOIN RequestItem ri ON ri.id = msi.request_item_id
      WHERE ms.date = $1
      ORDER BY ms.intake_template, ms.request_id, ms.id
    `, [date]);

            const grouped = {
                  MORNING: [],
                  MIDDAY: [],
                  AFTERNOON: []
            };

            for (const row of result.rows) {
                  const time = row.intake_template;
                  if (!grouped[time]) continue;

                  let reqGroup = grouped[time].find(
                        (g) => g.request_id === row.request_id
                  );

                  if (!reqGroup) {
                        reqGroup = {
                              request_id: row.request_id,
                              student_id: row.student_id,
                              student_name: row.student_name,
                              class_name: row.class_name,
                              is_taken: row.is_taken,
                              note: row.note,
                              intake_time: row.intake_time,
                              medications: []
                        };
                        grouped[time].push(reqGroup);
                  }

                  reqGroup.medications.push({
                        medication_schedule_id: row.medication_schedule_id,
                        item_name: row.item_name,
                        dosage_usage: row.dosage_usage
                  });
            }

            return res.status(200).json({ error: false, data: grouped });
      } catch (err) {
            console.error("❌ Lỗi getMedicationScheduleByDay:", err);
            return res.status(500).json({ error: true, message: "Lỗi server." });
      }
}


export async function getMedicationScheduleDaysByStudent(req, res) {
      const { id } = req.params;

      if (!id) {
            return res.status(400).json({ error: true, message: "Thiếu student id." });
      }

      try {
            const result = await query(`
      SELECT 
        date,
        COUNT(*) AS total_medications,
        COUNT(*) FILTER (WHERE is_taken = TRUE) AS taken_medications
      FROM MedicationSchedule
      WHERE student_id = $1
      GROUP BY date
      ORDER BY date DESC
    `, [id]);

            return res.status(200).json({ error: false, data: result.rows });
      } catch (err) {
            console.error("❌ Lỗi khi lấy ngày uống thuốc theo học sinh:", err);
            return res.status(500).json({ error: true, message: "Lỗi server." });
      }
}

export async function getStudentMedicationScheduleByDay(req, res) {
      const { id } = req.params;
      const { date } = req.query;

      if (!id || !date) {
            return res.status(400).json({ error: true, message: "Thiếu student id hoặc date." });
      }

      try {
            const result = await query(`
      SELECT 
        ms.id AS medication_schedule_id,
        ms.intake_template,
        ms.request_id,
        ms.is_taken,
        ms.intake_time,
        ms.note,

        s.id AS student_id,
        s.name AS student_name,
        c.name AS class_name,

        ri.name AS item_name,
        ri.dosage_usage

      FROM MedicationSchedule ms
      JOIN Student s ON s.id = ms.student_id
      JOIN Class c ON c.id = s.class_id
      JOIN MedicationScheduleItem msi ON msi.schedule_id = ms.id
      JOIN RequestItem ri ON ri.id = msi.request_item_id

      WHERE ms.date = $1 AND ms.student_id = $2
      ORDER BY ms.intake_template, ms.request_id, ms.id
    `, [date, id]);

            const grouped = { MORNING: [], MIDDAY: [], AFTERNOON: [] };

            for (const row of result.rows) {
                  const intake = row.intake_template;
                  if (!grouped[intake]) continue;

                  let group = grouped[intake].find(g =>
                        g.request_id === row.request_id &&
                        g.is_taken === row.is_taken &&
                        g.intake_time === row.intake_time &&
                        g.note === row.note
                  );

                  if (!group) {
                        group = {
                              request_id: row.request_id,
                              student_id: row.student_id,
                              student_name: row.student_name,
                              class_name: row.class_name,
                              is_taken: row.is_taken,
                              intake_time: row.intake_time,
                              note: row.note,
                              medications: []
                        };
                        grouped[intake].push(group);
                  }

                  group.medications.push({
                        medication_schedule_id: row.medication_schedule_id,
                        item_name: row.item_name,
                        dosage_usage: row.dosage_usage
                  });
            }

            return res.status(200).json({ error: false, data: grouped });

      } catch (err) {
            console.error("❌ Lỗi khi lấy lịch uống thuốc theo ngày cho học sinh:", err);
            return res.status(500).json({ error: true, message: "Lỗi server." });
      }
}
