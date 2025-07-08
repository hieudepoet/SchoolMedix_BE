import { query } from "../config/database.js";
import { getProfileOfStudentByUUID } from "../services/index.js";

// Campaign
export async function createCampaign(req, res) {
  const {
    title,
    disease_id,
    vaccine_id,
    description,
    location,
    start_date,
    end_date,
  } = req.body;

  // Validate required fields (removed disease_id from validation since it will be fetched)
  if (
    !title ||
    !disease_id ||
    !vaccine_id ||
    !description ||
    !start_date ||
    !end_date
  ) {
    return res
      .status(400)
      .json({ error: true, message: "Missing required fields" });
  }

  try {
    // Insert campaign into database
    const insertQuery = `
        INSERT INTO vaccination_campaign (disease_id, vaccine_id, title, description, location, start_date, end_date, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
    `;

    const result = await query(insertQuery, [
      disease_id,
      vaccine_id,
      title,
      description || NULL,
      location,
      start_date,
      end_date,
      "DRAFTED", // Campaign starts in PREPARING status
    ]);

    return res
      .status(201)
      .json({ message: "Campaign created", data: result.rows[0] });
  } catch (error) {
    console.error("Error creating campaign:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
}

export async function updateCampaignDetail(req, res) {
  const { campaign_id } = req.params;
  const {
    title,
    disease_id,
    vaccine_id,
    description,
    location,
    start_date,
    end_date,
  } = req.body;

  try {
    // Check if campaign exists
    const campaign = await query(
      "SELECT * FROM vaccination_campaign WHERE id = $1",
      [campaign_id]
    );
    if (campaign.rows.length === 0) {
      return res.status(404).json({
        error: true,
        message: "Không tìm thấy chiến dịch với ID này",
      });
    }

    // Only allow update if status is DRAFTED
    if (campaign.rows[0].status !== "DRAFTED") {
      return res.status(400).json({
        error: true,
        message: "Chỉ được cập nhật khi chiến dịch ở trạng thái DRAFTED",
      });
    }

    // Update campaign details, keep old value if not provided
    const updateQuery = `
      UPDATE vaccination_campaign
      SET
        title = COALESCE($1, title),
        disease_id = COALESCE($2, disease_id),
        vaccine_id = COALESCE($3, vaccine_id),
        description = COALESCE($4, description),
        location = COALESCE($5, location),
        start_date = COALESCE($6, start_date),
        end_date = COALESCE($7, end_date)
      WHERE id = $8
      RETURNING *;
    `;

    const result = await query(updateQuery, [
      title,
      disease_id,
      vaccine_id,
      description,
      location,
      start_date,
      end_date,
      campaign_id,
    ]);

    return res.status(200).json({
      error: false,
      message: "Cập nhật chiến dịch thành công",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật chiến dịch:", error);
    return res.status(500).json({
      error: true,
      message: "Lỗi server khi cập nhật chiến dịch",
    });
  }
}
// get all campaigns to see
export async function getAllCampaigns(req, res) {
  try {
    const result = await query(`
      select a.id as campaign_id, b.id as vaccine_id, b.name as vaccine_name, c.id as disease_id, c.name as disease_name, a.title, a.description as description, a.location, a.start_date, a.end_date, a.status, dose_quantity
      from vaccination_campaign a
      join vaccine b on a.vaccine_id = b.id
      join disease c on a.disease_id = c.id
      ORDER BY a.start_date DESC;
      `);

    return res.status(200).json({
      error: false,
      message: "Lấy danh sách chiến dịch thành công",
      data: result.rows,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách chiến dịch:", error);
    return res.status(500).json({
      error: true,
      message: "Lỗi server khi lấy danh sách chiến dịch",
    });
  }
}

export async function getCampaignDetailByID(req, res) {
  const { campaign_id } = req.params;

  if (!campaign_id) {
    return res.status(400).json({
      error: true,
      message: "Thiếu campaign_id",
    });
  }

  try {
    const result = await query(
      `
        select a.id as campaign_id, b.id as vaccine_id, b.name as vaccine_name, c.id as disease_id, c.name as disease_name, a.description as description, a.location, a.start_date, a.end_date, a.status
        from vaccination_campaign a
        join vaccine b on a.vaccine_id = b.id
        join disease c on a.disease_id = c.id
        WHERE a.id = $1
        LIMIT 1;
      `,
      [campaign_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: true,
        message: "Không tìm thấy chiến dịch với ID này",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Lấy chi tiết chiến dịch thành công",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết chiến dịch:", error);
    return res.status(500).json({
      error: true,
      message: "Lỗi server khi lấy chi tiết chiến dịch",
    });
  }
}

export async function createRegisterRequest(req, res) {
  const { campaign_id } = req.params || req.body || {};

  if (!campaign_id) {
    return res
      .status(400)
      .json({ error: true, message: "Missing campaign_id" });
  }

  try {
    // Check if campaign exists
    const campaigns = await query(
      "SELECT * FROM vaccination_campaign WHERE id = $1",
      [campaign_id]
    );
    if (campaigns.rows.length === 0) {
      return res
        .status(404)
        .json({ error: true, message: "Campaign not found" });
    }

    // Only allow register creation if campaign is in DRAFTED status
    if (campaigns.rows[0].status !== "DRAFTED") {
      return res
        .status(400)
        .json({ error: true, message: "Campaign is not in DRAFTED status" });
    }

    // Check if registration already exists for the campaign
    const existingRegistrations = await query(
      "SELECT * FROM vaccination_campaign_register WHERE campaign_id = $1",
      [campaign_id]
    );
    if (existingRegistrations.rows.length > 0) {
      return res
        .status(409)
        .json({ error: true, message: "Registers are already created" });
    }

    const disease_id = campaigns.rows[0].disease_id;

    // Get all students eligible for the campaign
    const eligibleStudents = await getStudentEligibleForADiseaseID(disease_id);

    if (!eligibleStudents || eligibleStudents.length === 0) {
      return res
        .status(200)
        .json({ error: false, message: "No eligible students found" });
    }

    // Create registration requests for eligible students
    for (const student of eligibleStudents) {
      await query(
        `INSERT INTO vaccination_campaign_register (campaign_id, student_id, reason, is_registered)
         VALUES ($1, $2, $3, $4)`,
        [campaign_id, student.student_id, `Auto_gen for ${campaign_id}`, false]
      );
    }

    const statusUpdate = await query(
      `
      UPDATE vaccination_campaign
      SET status = 'PREPARING'
      WHERE id = $1
      `,
      [campaign_id]
    );

    return res
      .status(201)
      .json({ error: false, message: "Campaign register created" });
  } catch (error) {
    console.error("Error creating registration request:", error);
    return res
      .status(500)
      .json({ error: true, message: "Failed to send request: " + error });
  }
}

// Update is_registered to true for a student - parent consent for vaccination, only allow to update if the date is in the range of the campaign (Start-date, end-date)
export async function acceptRegister(req, res) {
  const { id } = req.params;

  try {
    // Check if registration exists
    const registration = await query(
      "SELECT * FROM vaccination_campaign_register WHERE id = $1",
      [id]
    );
    if (registration.rows.length === 0) {
      return res
        .status(404)
        .json({ error: true, message: "Registration not found" });
    }

    const campaign = await query(
      "SELECT * FROM vaccination_campaign WHERE id = $1",
      [registration.rows[0].campaign_id]
    );
    if (campaign.rows.length === 0) {
      return res
        .status(404)
        .json({ error: true, message: "Campaign not found" });
    }

    if (campaign.rows[0].status !== "PREPARING") {
      return res.status(400).json({
        error: true,
        message: "Đã hết thời hạn đăng ký!",
      });
    }

    // Update registration status
    await query(
      "UPDATE vaccination_campaign_register SET is_registered = true WHERE id = $1",
      [id]
    );

    return res.status(200).json({
      message: "Registration status updated successfully",
      data: { id },
    });
  } catch (error) {
    console.error("Error updating registration status:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
}

export async function refuseRegister(req, res) {
  const { id } = req.params;
  const { reason } = req.body;

  if (!id) {
    return res
      .status(400)
      .json({ error: true, message: "Thiếu id đơn đăng ký tiêm." });
  }

  if (!reason) {
    return res.status(400).json({
      error: true,
      message: "Thiếu lý do tại sao không đăng ký tiêm.",
    });
  }

  try {
    // Check if registration exists
    const registration = await query(
      "SELECT * FROM vaccination_campaign_register WHERE id = $1",
      [id]
    );
    if (registration.rows.length === 0) {
      return res
        .status(404)
        .json({ error: true, message: "Registration not found" });
    }

    // Check if campaign is in progress
    const campaign = await query(
      "SELECT * FROM vaccination_campaign WHERE id = $1",
      [registration.rows[0].campaign_id]
    );
    if (campaign.rows.length === 0) {
      return res
        .status(404)
        .json({ error: true, message: "Campaign not found" });
    }

    console.log(campaign.rows[0].status);
    if (campaign.rows[0].status !== "PREPARING") {
      return res.status(400).json({
        error: true,
        message: "Đã hết thời hạn cập nhật đơn!",
      });
    }

    // Update registration status
    await query(
      "UPDATE vaccination_campaign_register SET is_registered = $1, reason = $2 WHERE id = $3",
      [false, reason, id]
    );

    console.log("here");
    return res.status(200).json({
      error: false,
      message: "Registration status updated successfully",
      data: { id },
    });
  } catch (error) {
    console.error("Error updating registration status:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
}

export async function getStudentEligibleForCampaign(req, res) {
  const { campaign_id } = req.params;

  if (!campaign_id) {
    return res
      .status(400)
      .json({ error: true, message: "Missing campaign_id" });
  }

  try {
    // Truy vấn disease_id từ chiến dịch
    const result = await query(
      `
        SELECT disease_id
        FROM vaccination_campaign
        WHERE id = $1
      `,
      [campaign_id]
    );

    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({
        error: true,
        message: "Campaign not found or no associated disease",
      });
    }

    const disease_id = result.rows[0].disease_id;

    // Lấy danh sách học sinh đủ điều kiện + trạng thái đăng ký (is_registered)
    const studentCompletedDoses = await query(
      `
        SELECT 
          s.id AS student_id,
          COALESCE(COUNT(vr.id) FILTER (
            WHERE vr.status = 'COMPLETED'
          ), 0) AS completed_doses,
          d.dose_quantity,
          req.is_registered
        FROM student s
        CROSS JOIN disease d
        LEFT JOIN vaccination_record vr 
          ON vr.student_id = s.id 
          AND vr.disease_id = d.id
        LEFT JOIN vaccination_campaign_register req
          ON req.student_id = s.id AND req.campaign_id = $2
        WHERE d.id = $1
        GROUP BY s.id, d.dose_quantity, req.is_registered
      `,
      [disease_id, campaign_id]
    );

    if (studentCompletedDoses.rowCount === 0) {
      return res
        .status(404)
        .json({ error: true, message: "No eligible students found" });
    }

    let completed_doses_and_record = [];

    for (let student of studentCompletedDoses.rows) {
      const records = await query(
        ` 
          SELECT 
            req.campaign_id AS campaign_id, 
            req.is_registered AS register_status,  
            rec.id AS record_id, 
            rec.register_id, 
            rec.description, 
            rec.location, 
            rec.vaccination_date, 
            rec.status, 
            vac.name AS vaccine_name, 
            vac.id AS vaccine_id, 
            dis.id AS disease_id, 
            dis.name AS disease_name 
          FROM vaccination_record rec 
          JOIN vaccine vac ON rec.vaccine_id = vac.id
          JOIN disease dis ON rec.disease_id = dis.id
          JOIN vaccination_campaign_register req ON req.student_id = rec.student_id
          WHERE rec.student_id = $1 AND dis.id = $2
        `,
        [student.student_id, disease_id]
      );

      completed_doses_and_record.push({
        student_id: student.student_id,
        completed_doses: student.completed_doses,
        dose_quantity: student.dose_quantity,
        is_registered: student.is_registered,
        records: records.rows,
      });
    }

    return res.status(200).json({
      error: false,
      message: "Eligible students retrieved",
      data: completed_doses_and_record,
    });
  } catch (error) {
    console.error("Error retrieving eligible students:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
}

// Record
// Create pre-vaccination record for students who registered for the campaign
export async function createPreVaccinationRecord(req, res) {
  const { campaign_id } = req.params;

  try {
    // Check if campaign exists
    const campaigns = await query(
      "SELECT * FROM vaccination_campaign WHERE id = $1",
      [campaign_id]
    );
    if (campaigns.rows.length === 0) {
      console.log("Campaign not found:", campaign_id);
      return res
        .status(404)
        .json({ error: true, message: "Campaign not found" });
    }

    // Get name of the disease
    const vaccine_id = campaigns.rows[0].vaccine_id;
    const disease_name = await query("SELECT name FROM disease WHERE id = $1", [
      campaigns.rows[0].disease_id,
    ]);

    // Get all students who registered for the campaign
    const registrations = await query(
      "SELECT * FROM vaccination_campaign_register WHERE campaign_id = $1 AND is_registered = true",
      [campaign_id]
    );

    if (registrations.rows.length === 0) {
      return res
        .status(404)
        .json({ error: true, message: "No registered students found" });
    }

    // Create pre-vaccination records for each registered student
    for (const registration of registrations.rows) {
      await query(
        `INSERT INTO vaccination_record (student_id, disease_id, vaccine_id, status)
                        VALUES ($1, $2, 'PENDING')`,
        [registration.student_id, disease_id, vaccine_id]
      );
    }

    // Data to return
    // Fetch all vaccination records for the campaign
    const vaccinationRecords = await query(
      `select * from 
                  vaccination_record rec join vaccination_campaign_register reg on rec.register_id = reg.id
                  where reg.campaign_id = $1`,
      [campaign_id]
    );
    return res.status(201).json({
      message: "Pre-vaccination records created for registered students",
      data: vaccinationRecords.rows,
    });
  } catch (error) {
    console.error("Error creating pre-vaccination record:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
}

export async function completeRecord(req, res) {
  const { record_id } = req.params;

  try {
    // Check if vaccination record exists
    const record = await query(
      "SELECT * FROM vaccination_record WHERE id = $1",
      [record_id]
    );

    const register_id = record.rows[0].register_id;

    const campaign_id_rows = await query(
      "SELECT campaign_id FROM vaccination_campaign_register WHERE id = $1",
      [register_id]
    );

    const campaign_id = campaign_id_rows.rows[0].campaign_id;

    const info = await query(
      "SELECT * FROM vaccination_campaign WHERE id = $1",
      [campaign_id]
    );

    if (record.rows.length === 0) {
      return res
        .status(404)
        .json({ error: true, message: "Vaccination record not found" });
    }

    // Update vaccination record
    console.log(info.rows[0].vaccination_date);
    const updateQuery = `
                  UPDATE vaccination_record
                  SET 
                    status = 'COMPLETED',
                    description = $2,
                    location = $3,
                    vaccination_date = $4
                  WHERE id = $1
                  RETURNING *;
            `;

    const result = await query(updateQuery, [
      record_id,
      info.rows[0].description,
      info.rows[0].location,
      info.rows[0].vaccination_date,
    ]);

    return res.status(200).json({
      message: "Vaccination record updated",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating vaccination record:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
}

export async function getAllRegistersOfAStudentWithCampaignID(req, res) {
  const { student_id, campaign_id } = req.params;

  // Validate input
  if (!student_id || !campaign_id) {
    return res.status(400).json({
      error: true,
      message: "Thiếu student_id hoặc campaign_id",
    });
  }

  try {
    const result = await query(
      `
      SELECT *
      FROM vaccination_campaign_register
      WHERE student_id = $1 AND campaign_id = $2
    `,
      [student_id, campaign_id]
    );

    return res.status(200).json({
      error: false,
      message: "Lấy danh sách đăng ký thành công",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching register info:", error);
    return res.status(500).json({
      error: true,
      message: "Lỗi server khi lấy danh sách đăng ký",
    });
  }
}

async function getStudentEligibleForADiseaseID(disease_id) {
  const sql = `
    SELECT 
        s.id AS student_id,
        COALESCE(COUNT(vr.id) FILTER (
            WHERE vr.status = 'COMPLETED'
        ), 0) AS completed_doses,
        d.dose_quantity
    FROM student s
    LEFT JOIN vaccination_record vr 
        ON vr.student_id = s.id AND vr.disease_id = $1
    LEFT JOIN disease d 
        ON d.id = $2
    GROUP BY s.id, d.dose_quantity
    HAVING COALESCE(COUNT(vr.id) FILTER (
        WHERE vr.status = 'COMPLETED'
    ), 0) < d.dose_quantity;
  `;

  return (await query(sql, [disease_id, disease_id])).rows;
}

async function updateCampaignStatus(campaign_id, status, res, successMessage) {
  try {
    const result = await query(
      `
                  UPDATE vaccination_campaign
                  SET status = $1
                  WHERE id = $2
                  RETURNING *
            `,
      [status, campaign_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: true,
        message: "Không tìm thấy chiến dịch tiêm chủng",
      });
    }

    return res.status(200).json({
      error: false,
      message: successMessage,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating campaign status:", error);
    return res.status(500).json({
      error: true,
      message: "Lỗi server khi cập nhật trạng thái chiến dịch",
    });
  }
}

export async function startRegistrationForCampaign(req, res) {
  const { campaign_id } = req.params;
  return updateCampaignStatus(
    campaign_id,
    "PREPARING",
    res,
    "Chiến dịch đã mở đăng ký!"
  );
}

export async function closeRegisterByCampaignID(req, res) {
  const { campaign_id } = req.params;

  try {
    // Lấy danh sách học sinh đã đăng ký thành công cho chiến dịch này
    const registrations = await query(
      `SELECT 
                  r.student_id, 
                  c.vaccine_id, 
                  c.disease_id,
                  c.title,
                  r.id AS register_id
                  FROM vaccination_campaign_register r 
                  JOIN vaccination_campaign c ON r.campaign_id = c.id
                  WHERE r.campaign_id = $1 AND r.is_registered = true;`,
      [campaign_id]
    );

    if (registrations.rows.length === 0) {
      return res.status(404).json({
        error: true,
        message: "Không có học sinh nào đăng ký cho chiến dịch này.",
      });
    }

    // tạo trạng thái chiến dịch
    const updatedCampaign = await query(
      `
                  UPDATE vaccination_campaign
                  SET status = 'UPCOMING'
                  WHERE id = $1
                  RETURNING *
            `,
      [campaign_id]
    );

    if (updatedCampaign.rowCount === 0) {
      return res.status(404).json({
        error: true,
        message:
          "Cập nhật trạng thái cho chiến dịch thành UPCOMING không thành công!",
      });
    }

    // Tạo bản ghi tiền tiêm chủng (PENDING) cho từng học sinh
    for (const registration of registrations.rows) {
      await query(
        `INSERT INTO vaccination_record (student_id, disease_id, vaccine_id, status, register_id)
                        VALUES ($1, $2, $3, 'PENDING', $4) ON CONFLICT (student_id, vaccine_id, register_id) DO NOTHING`,
        [
          registration.student_id,
          registration.disease_id,
          registration.vaccine_id,
          registration.register_id,
        ]
      );
    }

    // Lấy tất cả bản ghi tiêm chủng vừa được tạo
    const vaccinationRecords = await query(
      `SELECT * FROM vaccination_record rec
                  JOIN vaccination_campaign_register reg ON rec.register_id = reg.id
                  WHERE reg.campaign_id = $1`,
      [campaign_id]
    );

    return res.status(201).json({
      error: false,
      message: "Đã đóng đăng ký và tạo bản ghi tiêm chủng chờ xử lý.",
      campaign: updatedCampaign.rows,
      records: vaccinationRecords.rows,
    });
  } catch (error) {
    console.error("Lỗi khi đóng đăng ký chiến dịch:", error);
    return res.status(500).json({
      error: true,
      message: "Lỗi server khi xử lý đóng đăng ký chiến dịch.",
    });
  }
}

export async function startCampaign(req, res) {
  const { campaign_id } = req.params;
  return updateCampaignStatus(
    campaign_id,
    "ONGOING",
    res,
    "Chiến dịch đã bắt đầu, đang tiêm cho học sinh"
  );
}

export async function completeCampaign(req, res) {
  const { campaign_id } = req.params;
  return updateCampaignStatus(
    campaign_id,
    "COMPLETED",
    res,
    "Chiến dịch đã hoàn thành."
  );
}

export async function cancelCampaignByID(req, res) {
  const { campaign_id } = req.params;
  return updateCampaignStatus(
    campaign_id,
    "CANCELLED",
    res,
    "Chiến dịch đã bị hủy"
  );
}

export async function getAllRegisteredRecords(req, res) {
  const { campaign_id } = req.params;
  if (!campaign_id) {
    return res.status(404).json({
      error: true,
      message: "Không tìm thấy campaing_id trong url",
    });
  }
  try {
    const records = await query(
      `
        SELECT 
        s.id AS student_id,
        s.supabase_uid as supabase_uid,
        rec.id AS record_id,
        rec.disease_id,
        rec.vaccine_id,
        rec.status as status,
        rec.description as description,
        rec.location as location
        FROM vaccination_campaign_register reg 
        JOIN vaccination_campaign camp ON reg.campaign_id = camp.id
        JOIN student s ON s.id = reg.student_id
        JOIN vaccination_record rec ON rec.register_id = reg.id
        WHERE camp.id = $1;
            `,
      [campaign_id]
    );

    if (records.rowCount === 0) {
      return res.status(404).json({
        error: true,
        message: "Không tìm thấy record nào cho chiến dịch",
      });
    }

    let final_result = [];

    for (let record of records.rows) {
      const student_profile = await getProfileOfStudentByUUID(
        record.supabase_uid
      );
      final_result.push({ ...record, student_profile });
    }

    return res.status(200).json({
      error: false,
      message: "ok",
      data: final_result,
    });
  } catch (error) {
    console.error(
      "Error when listing registered record within a campaign:",
      error
    );
    return res.status(500).json({
      error: true,
      message:
        "Lỗi server khi lấy toàn bộ record của học sinh đã đăng ký đồng ý tiêm.",
    });
  }
}

export async function getCompletedDosesMergedByDisease(req, res) {
  const { student_id } = req.params;

  try {
    // 1. Lấy thông tin học sinh và lớp
    const studentQuery = await query(
      `
      SELECT s.id AS student_id, s.name AS student_name, s.class_id, c.name AS class_name
      FROM student s
      JOIN class c ON s.class_id = c.id
      WHERE s.id = $1
    `,
      [student_id]
    );

    if (studentQuery.rows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy học sinh" });
    }

    const studentInfo = studentQuery.rows[0];

    // 2. Lấy danh sách bệnh, số liều đã tiêm (COMPLETED), và tổng số liều cần tiêm
    const dosesQuery = await query(
      `
      SELECT 
        d.id AS disease_id,
        d.name AS disease_name,
        COUNT(vr.id) AS completed_doses,
        d.dose_quantity
      FROM disease d
      LEFT JOIN vaccination_record vr 
        ON vr.disease_id = d.id 
        AND vr.student_id = $1 
        AND vr.status = 'COMPLETED'
      where d.vaccine_need = true
      GROUP BY d.id, d.name, d.dose_quantity
      ORDER BY d.id
    `,
      [student_id]
    );

    res.json({
      student_id: studentInfo.student_id,
      student_name: studentInfo.student_name,
      class_id: studentInfo.class_id,
      class_name: studentInfo.class_name,
      diseases: dosesQuery.rows,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Lỗi khi lấy thông tin", detail: err.message });
  }
}

export async function getAcceptedRegisteredRecords(req, res) {
  const { campaign_id } = req.params;
  if (!campaign_id) {
    return res.status(404).json({
      error: true,
      message: "Không tìm thấy campaing_id trong url",
    });
  }
  try {
    const records = await query(
      `
        SELECT 
        s.id AS student_id,
        s.supabase_uid as supabase_uid,
        rec.id AS record_id,
        rec.disease_id
        rec.vaccine_id,
        rec.status as status,
        rec.description as description,
        rec.location as location
        FROM vaccination_campaign_register reg 
        JOIN vaccination_campaign camp ON reg.campaign_id = camp.id
        JOIN student s ON s.id = reg.student_id
        JOIN vaccination_record rec ON rec.register_id = reg.id
        WHERE camp.id = $1 AND reg.is_registered = true;
            `,
      [campaign_id]
    );

    if (records.rowCount === 0) {
      return res.status(404).json({
        error: true,
        message: "Không tìm thấy record nào cho chiến dịch",
      });
    }

    let final_result = [];

    for (let record of records.rows) {
      const student_profile = await getProfileOfStudentByUUID(
        record.supabase_uid
      );
      final_result.push({ ...record, student_profile });
    }

    return res.status(200).json({
      error: false,
      message: "ok",
      data: final_result,
    });
  } catch (error) {
    console.error(
      "Error when listing registered record within a campaign:",
      error
    );
    return res.status(500).json({
      error: true,
      message:
        "Lỗi server khi lấy toàn bộ record của học sinh đã đăng ký đồng ý tiêm.",
    });
  }
}
