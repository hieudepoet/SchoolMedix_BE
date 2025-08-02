import { query, pool } from "../config/database.js";
import { getProfileOfStudentByUUID } from "../services/index.js";

export async function getSchedule(req, res) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { parent_id } = req.params;
    const { startDate, endDate, type } = req.query;

    const parentResult = await client.query(
      "SELECT id FROM parent WHERE id = $1",
      [parent_id]
    );
    if (!parentResult.rows.length) {
      return res.status(404).json({
        error: true,
        message: "Không tìm thấy phụ huynh hoặc không có quyền truy cập",
        data: null,
      });
    }

    // Truy vấn gộp từ vaccination_campaign_register và CheckupCampaign
    let queryText = `
      SELECT 
  vcr.campaign_id AS id,
  vc.title AS title,
  vc.start_date AS event_date,
  'vaccination' AS type,
  ARRAY_AGG(s1.id) AS child_ids
FROM vaccination_campaign_register vcr
JOIN vaccination_campaign vc ON vcr.campaign_id = vc.id
JOIN (
  SELECT id, name, home_id FROM student
) AS s1 ON s1.id = vcr.student_id
JOIN student s2 ON s2.id = vcr.student_id
JOIN home h ON s2.home_id = h.id
JOIN parent p ON (h.mom_id = p.id OR h.dad_id = p.id)
WHERE p.id = $1
  AND vcr.is_registered = true
  AND vc.status IN ('PREPARING', 'ONGOING', 'COMPLETED', 'UPCOMING')
GROUP BY vcr.campaign_id, vc.title, vc.start_date

UNION ALL

SELECT
  cc.id AS id,
  cc.name AS title,
  cc.start_date AS event_date,
  'checkup' AS type,
  ARRAY_AGG(s1.id) AS child_ids
FROM CheckupCampaign cc
JOIN CheckupRegister cr ON cr.campaign_id = cc.id
JOIN (
  SELECT id, name, home_id FROM student
) AS s1 ON s1.id = cr.student_id
JOIN student s2 ON s2.id = cr.student_id
JOIN home h ON s2.home_id = h.id
JOIN parent p ON (h.mom_id = p.id OR h.dad_id = p.id)
WHERE p.id = $1
  AND cc.status IN ('PREPARING', 'ONGOING', 'DONE', 'UPCOMING')
GROUP BY cc.id, cc.name, cc.start_date

ORDER BY event_date ASC;

    `;
    let queryParams = [parent_id];

    // Thêm điều kiện lọc theo startDate, endDate, type
    let paramIndex = 2;
    if (startDate || endDate || type) {
      queryText = `
        SELECT * FROM (
          ${queryText}
        ) AS events
        WHERE 1=1
        ${startDate ? `AND event_date >= $${paramIndex++}` : ""}
        ${endDate ? `AND event_date <= $${paramIndex++}` : ""}
        ${type ? `AND type = $${paramIndex}` : ""}
        ORDER BY event_date ASC
      `;
      if (startDate) queryParams.push(startDate);
      if (endDate) queryParams.push(endDate);
      if (type) queryParams.push(type);
    }

    const result = await client.query(queryText, queryParams);

    // Định dạng dữ liệu trả về
    const events = result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      date: row.event_date.toISOString(),
      childIds: row.child_ids || [],
      type: row.type,
    }));

    await client.query("COMMIT");

    return res.status(200).json({
      error: false,
      message: "Fetching data successfully",
      data: events,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error fetching schedule:", error.message);
    return res.status(500).json({
      error: true,
      message: "Không thể tải lịch trình: " + error.message,
      data: null,
    });
  } finally {
    client.release();
  }
}
