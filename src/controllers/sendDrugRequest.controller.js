import { query } from "../config/database.js";
import multer from "multer";
import { uploadFileToSupabaseStorage } from "../services/index.js";

export async function createRequest(req, res) {
      const {
            student_id,
            create_by,
            diagnosis,
            schedule_send_date,
            intake_date,
            note,
            request_items,
            prescription_img_urls,
      } = req.body;

      if (!student_id) {
            return res.status(400).json({ error: true, message: "Thiếu student_id." });
      }
      if (!create_by) {
            return res.status(400).json({ error: true, message: "Thiếu người gửi" });
      }
      if (!schedule_send_date) {
            return res.status(400).json({ error: true, message: "Thiếu ngày hẹn gửi." });
      }
      if (!intake_date) {
            return res.status(400).json({ error: true, message: "Thiếu ngày cho học sinh uống thuốc." });
      }

      if (!request_items || !Array.isArray(request_items) || request_items.length === 0) {
            return res.status(400).json({ error: true, message: "Thiếu các đơn vị thuốc cần cho học sinh uống." });
      }

      try {
            // Step 1: insert SendDrugRequest
            const result = await query(
                  `INSERT INTO SendDrugRequest 
          (student_id, create_by, diagnosis, schedule_send_date, intake_date, note, status, prescription_img_urls)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING *`,
                  [student_id, create_by, diagnosis, schedule_send_date, intake_date, note || null, 'PROCESSING', prescription_img_urls]
            );

            const sendDrugRequest = result.rows[0];
            const request_id = sendDrugRequest.id;

            // Step 2: insert RequestItems
            for (const item of request_items) {
                  const intakeTimes = Array.isArray(item.intake_template_time)
                        ? item.intake_template_time
                        : item.intake_template_time.split(',').map(s => s.trim()).filter(Boolean);

                  await query(
                        `INSERT INTO RequestItem (request_id, name, intake_template_time, dosage_usage)
            VALUES ($1, $2, $3, $4)`,
                        [request_id, item.name, intakeTimes, item.dosage_usage || item.dosageUsage]
                  );
            }

            return res.status(201).json({
                  error: false,
                  message: 'Tạo thành công đơn gửi thuốc.',
                  data: sendDrugRequest
            });

      } catch (err) {
            console.error("❌ Error creating send-drug-request or request items:", err);
            return res.status(500).json({
                  error: true,
                  message: "Lỗi server khi tạo đơn thuốc.",
                  detail: err.message
            });
      }
}

export async function updateRequest(req, res) {
      const { id } = req.params;
      const {
            student_id,
            create_by,
            diagnosis,
            schedule_send_date,
            intake_date,
            note,
            request_items,
            prescription_img_urls,
      } = req.body;

      if (!id) {
            return res.status(400).json({ error: true, message: "Thiếu ID đơn gửi." });
      }
      if (!student_id) {
            return res.status(400).json({ error: true, message: "Thiếu student_id." });
      }
      if (!create_by) {
            return res.status(400).json({ error: true, message: "Thiếu người gửi." });
      }
      if (!schedule_send_date) {
            return res.status(400).json({ error: true, message: "Thiếu ngày hẹn gửi." });
      }
      if (!intake_date) {
            return res.status(400).json({ error: true, message: "Thiếu ngày cho học sinh uống thuốc." });
      }
      if (!request_items || !Array.isArray(request_items) || request_items.length === 0) {
            return res.status(400).json({ error: true, message: "Thiếu các đơn vị thuốc cần cho học sinh uống." });
      }

      try {
            // Step 1: Update SendDrugRequest
            const result = await query(
                  `UPDATE SendDrugRequest 
          SET student_id = $1, create_by = $2, diagnosis = $3, schedule_send_date = $4, intake_date = $5, note = $6, prescription_img_urls = $7, status = 'PROCESSING'
          WHERE id = $8
          RETURNING *`,
                  [student_id, create_by, diagnosis || null, schedule_send_date, intake_date, note || null, prescription_img_urls || [], id]
            );

            if (result.rows.length === 0) {
                  return res.status(404).json({ error: true, message: "Không tìm thấy đơn với ID này." });
            }

            const sendDrugRequest = result.rows[0];

            // Step 2: Delete existing RequestItems
            await query(`DELETE FROM RequestItem WHERE request_id = $1`, [id]);

            // Step 3: Insert new RequestItems
            for (const item of request_items) {
                  const intakeTimes = Array.isArray(item.intake_template_time)
                        ? item.intake_template_time
                        : item.intake_template_time.split(',').map(s => s.trim()).filter(Boolean);

                  await query(
                        `INSERT INTO RequestItem (request_id, name, intake_template_time, dosage_usage)
            VALUES ($1, $2, $3, $4)`,
                        [id, item.name, intakeTimes, item.dosage_usage || item.dosageUsage]
                  );
            }

            return res.status(200).json({
                  error: false,
                  message: 'Cập nhật đơn gửi thuốc thành công.',
                  data: sendDrugRequest
            });

      } catch (err) {
            console.error("❌ Error updating send-drug-request or request items:", err);
            return res.status(500).json({
                  error: true,
                  message: "Lỗi server khi cập nhật đơn thuốc.",
                  detail: err.message
            });
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
      if (!id) {
            return res.status(400).json({ error: true, message: "Thiếu ID đơn gửi." });
      }

      try {
            const today = new Date();
            const formatted = today.toISOString().split('T')[0];

            const result = await query(
                  "UPDATE SendDrugRequest SET status = 'RECEIVED', receive_date = $2 WHERE id = $1 RETURNING *",
                  [id, formatted]
            );

            if (result.rows.length === 0) {
                  return res.status(404).json({ error: false, message: "Không tìm thấy đơn với ID này." });
            }

            return res.status(200).json({ error: false, message: "Đã nhận thuốc." });
      } catch (err) {
            console.error("Gặp lỗi khi cập nhật đơn thuốc: " + err);
            return res.status(500).json({ error: true, message: "Gặp lỗi khi cập nhật đơn thuốc." });
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
            const result = await query(`
                  SELECT 
                  a.*,
                  json_agg(
                        json_build_object(
                        'name', b.name,
                        'intake_template_time', b.intake_template_time,
                        'dosage_usage', b.dosage_usage
                        )
                  ) AS request_items
                  FROM senddrugrequest a
                  LEFT JOIN requestitem b ON a.id = b.request_id
                  WHERE a.id = $1
                  GROUP BY a.id
                  ORDER BY a.id
            `, [id]);

            if (result.rows.length === 0) {
                  return res.status(404).json({ error: false, message: "Không tìm thấy đơn với ID này." });
            }

            return res.status(200).json({ error: false, data: result.rows[0] });
      } catch (err) {
            console.error("Gặp lỗi khi truy xuất đơn gửi thuốc: " + err);
            return res.status(500).json({ error: true, message: "Gặp lỗi khi truy xuất đơn gửi thuốc." });
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
                COALESCE(
                    json_agg(
                        json_build_object(
                            'name', b.name,
                            'intake_template_time', b.intake_template_time,
                            'dosage_usage', b.dosage_usage
                        )
                    ) FILTER (WHERE b.id IS NOT NULL), '[]'
                ) AS request_items
            FROM senddrugrequest a
            LEFT JOIN requestitem b ON a.id = b.request_id
            WHERE a.student_id = $1
            GROUP BY a.id
            ORDER BY a.id DESC`,
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
            const result = await query(`SELECT 
                   a.*, s.name as student_name, c.name as class_name,
                  json_agg(
                        json_build_object(
                              'name', b.name,
                              'intake_template_time', b.intake_template_time,
                              'dosage_usage', b.dosage_usage
                        )
                  ) AS request_items
                  FROM senddrugrequest a
                  LEFT JOIN requestitem b ON a.id = b.request_id
                  JOIN student s ON s.id = a.student_id
                  JOIN class c ON s.class_id = c.id
                  GROUP BY a.id, s.name, c.name
                  ORDER BY a.id;`);
            if (result.rows.length === 0) {
                  return res.status(404).json({ error: false, message: "Không có đơn gửi nào." });
            }

            return res.status(200).json({ error: false, data: result.rows });
      } catch (err) {
            console.error("Gặp lỗi khi truy xuất danh sách đơn gửi thuốc: " + err);
            return res.status(500).json({ error: true, message: "Gặp lỗi khi truy xuất danh sách đơn gửi thuốc." });
      }
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