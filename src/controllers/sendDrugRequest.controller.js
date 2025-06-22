import { query } from "../config/database.js";

export async function createRequest(req, res) {
      const {
            student_id,
            create_by,
            diagnosis,
            schedule_send_date,
            intake_date,
            note,
            request_items
      } = req.body;

      console.log(req.body);

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
          (student_id, create_by, diagnosis, schedule_send_date, intake_date, note, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *`,
                  [student_id, create_by, diagnosis, schedule_send_date, intake_date, note || null, 'PROCESSING']
            );

            const sendDrugRequest = result.rows[0];
            const request_id = sendDrugRequest.id;

            // Step 2: insert RequestItems
            for (const item of request_items) {
                  // Chuyển đổi intakeTemplateTime thành mảng nếu cần
                  const intakeTimes = Array.isArray(item.intake_template_time)
                        ? item.intake_template_time
                        : item.intake_template_time.split(',').map(s => s.trim()).filter(Boolean);;

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

export async function acceptRequest(req, res) {
      const { id } = req.params;
      console.log(id);
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
            const formatted = today.toISOString().split('T')[0]; // "2025-06-10"

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
            `, [id]); // requestId là số nguyên (int)

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
				  join student s on s.id = a.student_id
				  join class c on s.class_id = c.id
                  GROUP BY a.id, s.name, c.name
                  ORDER BY a.id; `);
            if (result.rows.length === 0) {
                  return res.status(404).json({ error: false, message: "Không có đơn gửi nào." });
            }

            return res.status(200).json({ error: false, data: result.rows }); // ✅ return all
      } catch (err) {
            console.error("Gặp lỗi khi truy xuất danh sách đơn gửi thuốc: " + err);
            return res.status(500).json({ error: true, message: "Gặp lỗi khi truy xuất danh sách đơn gửi thuốc." });
      }
}





