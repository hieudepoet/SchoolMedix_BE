import { query, pool } from "../config/database.js";
import { getProfileOfStudentByUUID } from "../services/index.js";
import { sendVaccineRegister } from "../services/email/index.js";

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
      select 
        a.id as campaign_id,
        b.id as vaccine_id, 
        b.name as vaccine_name, 
        STRING_AGG(c.name, ', ') AS disease_name, 
        a.title, 
        a.description as description, 
        a.location, 
        a.start_date, 
        a.end_date, 
        a.status, 
        d.dose_quantity
      from vaccination_campaign a
      join vaccine b on a.vaccine_id = b.id
      LEFT JOIN LATERAL (
        SELECT name
        FROM disease
        WHERE id = ANY(a.disease_id)
      ) c ON TRUE
      JOIN vaccine_disease d ON d.vaccine_id = b.id 
      GROUP BY 
        a.id, 
        b.id, 
        vaccine_name, 
        a.title, 
        a.description, 
        a.location, 
        a.start_date, 
        a.end_date, 
        a.status, 
        d.dose_quantity
      ORDER BY a.start_date DESC
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

export async function getAllCampaignsForParent(req, res) {
  const { student_id } = req.params;
  try {
    const result = await query(
      `
      select 
        a.id as campaign_id,
        b.id as vaccine_id, 
        b.name as vaccine_name, 
        STRING_AGG(c.name, ', ') AS disease_name, 
        a.title, 
        a.description as description, 
        a.location, 
        a.start_date, 
        a.end_date, 
        a.status, 
        d.dose_quantity
      from vaccination_campaign a
      join vaccination_campaign_register reg on a.id = reg.campaign_id
      join student s on reg.student_id = s.id 
      join vaccine b on a.vaccine_id = b.id
      LEFT JOIN LATERAL (
        SELECT name
        FROM disease
        WHERE id = ANY(a.disease_id)
      ) c ON TRUE
      JOIN vaccine_disease d ON d.vaccine_id = b.id 
      WHERE status != 'DRAFTED' and s.id = $1
      GROUP BY 
        a.id, 
        b.id, 
        vaccine_name, 
        a.title, 
        a.description, 
        a.location, 
        a.start_date, 
        a.end_date, 
        a.status, 
        d.dose_quantity
      ORDER BY a.start_date DESC;
      `,
      [student_id]
    );

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
      select 
        a.id as campaign_id,
        b.id as vaccine_id, 
        b.name as vaccine_name, 
        a.disease_id,
        STRING_AGG(c.name, ', ') AS disease_name, 
        a.title, 
        a.description as description, 
        a.location, 
        a.start_date, 
        a.end_date, 
        a.status, 
        d.dose_quantity
      from vaccination_campaign a
      join vaccine b on a.vaccine_id = b.id
      LEFT JOIN LATERAL (
        SELECT name
        FROM disease
        WHERE id = ANY(a.disease_id)
      ) c ON TRUE
      JOIN vaccine_disease d ON d.vaccine_id = b.id 
      WHERE a.id = $1
      GROUP BY 
        a.id, 
        b.id, 
        vaccine_name, 
        a.title, 
        a.description, 
        a.location, 
        a.start_date, 
        a.end_date, 
        a.status, 
        d.dose_quantity
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

export async function getStudentEligib(campaign_id) {
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

    const disease_id = result.rows[0].disease_id;

    // Lấy danh sách học sinh đủ điều kiện + trạng thái đăng ký (is_registered)
    const studentCompletedDoses = await query(
      `
      WITH disease_target AS (
        SELECT unnest($1::int[]) AS disease_id
      ),
      vaccine_targets AS (
        SELECT d.disease_id, vd.dose_quantity
        FROM disease_target d
        JOIN vaccine_disease vd ON vd.disease_id = ARRAY[d.disease_id]
      ),
      student_doses AS (
        SELECT 
          s.id AS student_id,
          d.disease_id,
          COUNT(vr.id) FILTER (
            WHERE vr.status = 'COMPLETED' AND vr.disease_id = ARRAY[d.disease_id]
          ) AS completed_doses,
          d.dose_quantity,
          req.is_registered,
          s.name
        FROM student s
        CROSS JOIN vaccine_targets d
        LEFT JOIN vaccination_record vr ON vr.student_id = s.id
        LEFT JOIN vaccination_campaign_register req 
          ON req.student_id = s.id AND req.campaign_id = $2
        GROUP BY s.id, d.disease_id, d.dose_quantity, req.is_registered
      )
      SELECT *
      FROM student_doses
      WHERE completed_doses < dose_quantity
      `,
      [disease_id, campaign_id]
    );

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
          STRING_AGG(DISTINCT d.id::text, ', ') AS disease_id,
          STRING_AGG(DISTINCT d.name, ', ') AS disease_name
        FROM vaccination_record rec 
        JOIN vaccine vac ON rec.vaccine_id = vac.id
        LEFT JOIN vaccine_disease vd ON vac.id = vd.vaccine_id
        LEFT JOIN disease d ON d.id = ANY(vd.disease_id)
        JOIN vaccination_campaign_register req ON req.student_id = rec.student_id
        WHERE rec.student_id = $1 
          AND rec.disease_id = $2::int[]
        GROUP BY 
          req.campaign_id, 
          req.is_registered,  
          rec.id, 
          rec.register_id, 
          rec.description, 
          rec.location, 
          rec.vaccination_date, 
          rec.status, 
          vac.name, 
          vac.id

        `,
        [student.student_id, disease_id]
      );

      completed_doses_and_record.push({
        name: student.name,
        student_id: student.student_id,
        completed_doses: student.completed_doses,
        dose_quantity: student.dose_quantity,
        is_registered: student.is_registered,
        records: records.rows,
      });
    }

    return completed_doses_and_record;
  } catch (error) {
    console.error("Error retrieving eligible students:", error);
    return null;
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
      console.log("Error: Campaign not found or no associated disease");
      return res.status(404).json({
        error: true,
        message: "Campaign not found or no associated disease",
      });
    }

    const disease_id = result.rows[0].disease_id;

    // Lấy danh sách học sinh đủ điều kiện + trạng thái đăng ký (is_registered)
    const studentCompletedDoses = await query(
      `
      WITH disease_target AS (
        SELECT $1::int[] AS disease_id
      ),
      vaccine_targets AS (
        SELECT d.disease_id, vd.dose_quantity
        FROM disease_target d
        JOIN vaccine_disease vd ON vd.disease_id = d.disease_id
      ),
      student_doses AS (
        SELECT 
          s.id AS student_id,
          d.disease_id,
          COUNT(vr.id) FILTER (
            WHERE vr.status = 'COMPLETED' AND vr.disease_id = d.disease_id
          ) AS completed_doses,
          d.dose_quantity,
          req.is_registered,
          s.name
        FROM student s
        CROSS JOIN vaccine_targets d
        LEFT JOIN vaccination_record vr ON vr.student_id = s.id
        LEFT JOIN vaccination_campaign_register req 
          ON req.student_id = s.id AND req.campaign_id = $2
        GROUP BY s.id, d.disease_id, d.dose_quantity, req.is_registered
      )
      SELECT *
      FROM student_doses
      WHERE completed_doses < dose_quantity
      `,
      [disease_id, campaign_id]
    );

    if (studentCompletedDoses.rowCount === 0) {
      console.log("No eligible students found for disease:", disease_id);
      return res
        .status(500)
        .json({ error: true, message: "No eligible students found" });
    }

    let completed_doses_and_record = [];

    for (let student of studentCompletedDoses.rows) {
      const records = await query(
        ` 
        SELECT DISTINCT ON (rec.id)
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
          STRING_AGG(DISTINCT d.id::text, ', ') AS disease_id,
          STRING_AGG(DISTINCT d.name, ', ') AS disease_name
        FROM vaccination_record rec 
        JOIN vaccine vac ON rec.vaccine_id = vac.id
        LEFT JOIN vaccine_disease vd ON vac.id = vd.vaccine_id
        LEFT JOIN disease d ON d.id = ANY(vd.disease_id)
        JOIN vaccination_campaign_register req ON req.student_id = rec.student_id
        WHERE rec.student_id = $1 
          AND rec.disease_id = $2::int[]
          AND rec.status = 'COMPLETED'
        GROUP BY 
          req.campaign_id, 
          req.is_registered,  
          rec.id, 
          rec.register_id, 
          rec.description, 
          rec.location, 
          rec.vaccination_date, 
          rec.status, 
          vac.name, 
          vac.id

        `,
        [student.student_id, disease_id]
      );

      completed_doses_and_record.push({
        name: student.name,
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

export async function getStudentEligibleAndCompletedForCampaign(req, res) {
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
      console.log("Error: Campaign not found or no associated disease");
      return res.status(404).json({
        error: true,
        message: "Campaign not found or no associated disease",
      });
    }

    const disease_id = result.rows[0].disease_id;

    // Lấy danh sách học sinh đủ điều kiện + trạng thái đăng ký (is_registered)
    const studentCompletedDoses = await query(
      `
      WITH disease_target AS (
        SELECT $1::int[] AS disease_id
      ),
      vaccine_targets AS (
        SELECT d.disease_id, vd.dose_quantity
        FROM disease_target d
        JOIN vaccine_disease vd ON vd.disease_id = d.disease_id
      ),
      student_doses AS (
        SELECT 
          s.id AS student_id,
          d.disease_id,
          COUNT(vr.id) FILTER (
            WHERE vr.status = 'COMPLETED' AND vr.disease_id = d.disease_id
          ) AS completed_doses,
          d.dose_quantity,
          req.is_registered,
          s.name
        FROM student s
        CROSS JOIN vaccine_targets d
        LEFT JOIN vaccination_record vr ON vr.student_id = s.id
        LEFT JOIN vaccination_campaign_register req 
          ON req.student_id = s.id AND req.campaign_id = $2
        GROUP BY s.id, d.disease_id, d.dose_quantity, req.is_registered
      )
      SELECT *
      FROM student_doses
      ORDER BY student_id
      `,
      [disease_id, campaign_id]
    );

    if (studentCompletedDoses.rowCount === 0) {
      console.log("No eligible students found for disease:", disease_id);
      return res
        .status(500)
        .json({ error: true, message: "No eligible students found" });
    }

    let completed_doses_and_record = [];

    for (let student of studentCompletedDoses.rows) {
      const records = await query(
        ` 
        SELECT DISTINCT ON (rec.id)
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
          STRING_AGG(DISTINCT d.id::text, ', ') AS disease_id,
          STRING_AGG(DISTINCT d.name, ', ') AS disease_name
        FROM vaccination_record rec 
        JOIN vaccine vac ON rec.vaccine_id = vac.id
        LEFT JOIN vaccine_disease vd ON vac.id = vd.vaccine_id
        LEFT JOIN disease d ON d.id = ANY(vd.disease_id)
        JOIN vaccination_campaign_register req ON req.student_id = rec.student_id
        WHERE rec.student_id = $1 
          AND rec.disease_id = $2::int[]
          AND rec.status = 'COMPLETED'
        GROUP BY 
          req.campaign_id, 
          req.is_registered,  
          rec.id, 
          rec.register_id, 
          rec.description, 
          rec.location, 
          rec.vaccination_date, 
          rec.status, 
          vac.name, 
          vac.id

        `,
        [student.student_id, disease_id]
      );

      completed_doses_and_record.push({
        name: student.name,
        student_id: student.student_id,
        completed_doses: records.rowCount,
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
  const { description } = req.body;

  try {
    const info = await query(
      `
        SELECT vc.location
        FROM vaccination_record vr
        JOIN vaccination_campaign_register vcr ON vr.register_id = vcr.id
        JOIN vaccination_campaign vc ON vcr.campaign_id = vc.id
        WHERE vr.id = $1
      `,
      [record_id]
    );
    // Cập nhật vaccination record
    const now = new Date();
    const updateQuery = `
      UPDATE vaccination_record
      SET 
        status = 'COMPLETED',
        description = $2,
        location = $3,
        vaccination_date = $4
      WHERE id = $1
      RETURNING *
    `;

    const result = await query(updateQuery, [
      record_id,
      description || NULL,
      info.rows[0].location,
      now,
    ]);

    if (result.rowCount === 0) {
      throw new Error("Vaccination record not found");
    }

    return res.status(200).json({
      error: false,
      message: "Vaccination record updated",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating vaccination record:", error);
    return res.status(500).json({
      error: true,
      message: `Error when updating record: ${error.message}`,
    });
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

async function getStudentEligibleForADiseaseID(disease_ids) {
  const sql = `
    WITH vaccine_targets AS (
      SELECT DISTINCT unnest(disease_id) AS disease_id, dose_quantity
      FROM vaccine_disease
      WHERE disease_id = $1::int[]
    ),
    student_doses AS (
      SELECT 
        s.id AS student_id,
        d.disease_id,
        COUNT(vr.id) FILTER (
          WHERE vr.status = 'COMPLETED'
            AND vr.disease_id = ARRAY[d.disease_id]
        ) AS completed_doses,
        d.dose_quantity
      FROM student s
      CROSS JOIN vaccine_targets d
      LEFT JOIN vaccination_record vr ON vr.student_id = s.id
      GROUP BY s.id, d.disease_id, d.dose_quantity
    )
    SELECT *
    FROM student_doses
    WHERE completed_doses < dose_quantity
  `;

  const result = await query(sql, [disease_ids]);
  return result.rows;
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
        rec.location as location,
        rec.vaccination_date
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
        vd.disease_id,
        STRING_AGG(DISTINCT d.name, ', ') AS disease_name,
        (
          SELECT COUNT(*) 
          FROM vaccination_record vr_sub
          WHERE 
            vr_sub.student_id = $1 AND
            vr_sub.disease_id = vd.disease_id AND
            vr_sub.status = 'COMPLETED'
        ) AS completed_doses,
        vd.dose_quantity
      FROM vaccine_disease vd
      LEFT JOIN disease d ON d.id = ANY(vd.disease_id)
      GROUP BY vd.disease_id, vd.dose_quantity
      ORDER BY vd.disease_id
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

export async function getCompletedDosesMergedByDiseaseVNVC(req, res) {
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
        vd.disease_id,
        STRING_AGG(DISTINCT d.name, ', ') AS disease_name,
        (
          SELECT COUNT(*) 
          FROM vaccination_record vr_sub
          WHERE 
            vr_sub.student_id = $1 AND
            vr_sub.disease_id = vd.disease_id AND
            vr_sub.status = 'COMPLETED'
        ) AS completed_doses,
        vd.dose_quantity
      FROM vaccine_disease vd
      LEFT JOIN disease d ON d.id = ANY(vd.disease_id)
      WHERE vd.vnvc = true
      GROUP BY vd.disease_id, vd.dose_quantity
      ORDER BY vd.disease_id
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

export async function sendMailRegister(req, res) {
  const { campaign_id } = req.params;

  if (!campaign_id) {
    return res.status(400).json({
      error: true,
      message: "Thiếu dữ liệu!",
    });
  }

  try {
    const check = await query(
      `
      SELECT c.*, v.name AS vaccine_name
      FROM vaccination_campaign c
      JOIN vaccine v ON v.id = c.vaccine_id
      WHERE c.id = $1 `,
      [campaign_id]
    );

    if (check.rowCount === 0) {
      return res.status(400).json({
        error: true,
        message: "Không tìm thấy Campaign!",
      });
    }

    const campaign = check.rows;

    console.log(campaign);

    const student_list = await getStudentEligib(campaign_id);

    if (!student_list || student_list.length === 0) {
      return res.status(400).json({
        error: true,
        message: "Không tìm thấy Student List!",
      });
    }

    const getNameDisease = await query(
      `SELECT name FROM disease WHERE id = ANY($1::int[])`,
      [campaign[0].disease_id]
    );

    const diseaseNames = getNameDisease.rows.map((row) => row.name).join(" + ");

    const student_ids = student_list.map((student) => student.student_id);

    const result = await query(
      `
      SELECT DISTINCT s.name AS student_name, p.name AS parent_name, p.email
      FROM student s
      JOIN home h ON s.home_id = h.id
      JOIN parent p ON p.id = h.mom_id OR p.id = h.dad_id
      WHERE s.id = ANY($1::text[]) AND p.email IS NOT NULL
      `,
      [student_ids]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({
        error: true,
        message: "Không tìm thấy Parent List!",
      });
    }

    const rs = await sendVaccineRegister(
      result.rows,
      campaign[0].title,
      diseaseNames,
      campaign[0].vaccine_name,
      campaign[0].description,
      campaign[0].location,
      campaign[0].start_date,
      campaign[0].end_date
    );

    return res.status(200).json({
      error: false,
      message: `Đã gửi email thành công`,
    });
  } catch (err) {
    console.error("❌ Error:", err);
    return res.status(500).json({
      error: true,
      message: "Lỗi khi gửi mail",
      detail: err.message,
    });
  }
}
