import { query } from "../config/database.js";


// Campaign
export async function createCampaign(req, res) {
      const { vaccine_id, description, location, start_date, end_date } = req.body;

      if (!vaccine_id || !description || !start_date || !end_date) {
            return res
                  .status(400)
                  .json({ error: true, message: "Missing required fields" });
      }

      try {
            // Check if vaccine exists
            const vaccines = await query("SELECT * FROM vaccine WHERE id = $1", [
                  vaccine_id,
            ]);
            if (vaccines.rows.length === 0) {
                  return res
                        .status(404)
                        .json({ error: true, message: "Vaccine not found" });
            }

            // Check if campaign already exists for the same vaccine and date range
            //  ------------- cái này khỏi check cx đc, do hard code, mình có thể xóa campaign nếu trùng mà
            // const existingCampaigns = await query(
            //   `SELECT * FROM vaccination_campaign 
            //    WHERE vaccine_id = $1 
            //    AND start_date <= $2 
            //    AND end_date >= $3`,
            //   [vaccine_id, start_date, end_date]
            // );
            // if (existingCampaigns.rows.length > 0) {
            //   return res.status(409).json({
            //     error: true,
            //     message: "Campaign already exists",
            //   });
            // }

            // Insert campaign into database
            const insertQuery = `
        INSERT INTO vaccination_campaign (vaccine_id, description, location, start_date, end_date, status)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;

            const result = await query(insertQuery, [
                  vaccine_id,
                  description,
                  location,
                  start_date,
                  end_date,
                  "PREPARING", // mndkhanh: sai flow, khi tạo ra campaign là PREPARING, (giai đoạn nhận đơn đăng ký)
            ]);

            const campaign_id = result.rows[0].id;

            const register_success = await createRegisterRequest(campaign_id);

            if (!register_success) {
                  console.log("Internal server error: " + "tạo register thất bại!");
            }
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

// get all campaigns to see
export async function getAllCampaigns(req, res) {
      try {
            const result = await query(`
      
            select a.id as campaign_id, b.id as vaccine_id, c.name as vaccine_name, b.name as vaccine_name, a.description as description, location, start_date, end_date, status
            from vaccination_campaign a
            join vaccine b on a.vaccine_id = b.id
			join vaccine c on a.vaccine_id = c.id
            ORDER BY a.start_date DESC;
            `);

            return res.status(200).json({
                  error: false,
                  message: "Lấy danh sách chiến dịch thành công",
                  data: result.rows
            });
      } catch (error) {
            console.error("Lỗi khi lấy danh sách chiến dịch:", error);
            return res.status(500).json({
                  error: true,
                  message: "Lỗi server khi lấy danh sách chiến dịch"
            });
      }
}


export async function getCampaignDetailByID(req, res) {
      const { campaign_id } = req.params;

      if (!campaign_id) {
            return res.status(400).json({
                  error: true,
                  message: "Thiếu campaign_id"
            });
      }

      try {
            const result = await query(
                  `
                        select a.id as campaign_id, b.id as vaccine_id, c.name as vaccine_name, b.name as vaccine_name, a.description as description, location, start_date, end_date, status
            from vaccination_campaign a
            join vaccine b on a.vaccine_id = b.id
			join vaccine c on a.vaccine_id = c.id
                        WHERE a.id = $1
                        LIMIT 1;
                  `,
                  [campaign_id]
            );

            if (result.rows.length === 0) {
                  return res.status(404).json({
                        error: true,
                        message: "Không tìm thấy chiến dịch với ID này"
                  });
            }

            return res.status(200).json({
                  error: false,
                  message: "Lấy chi tiết chiến dịch thành công",
                  data: result.rows[0]
            });
      } catch (error) {
            console.error("Lỗi khi lấy chi tiết chiến dịch:", error);
            return res.status(500).json({
                  error: true,
                  message: "Lỗi server khi lấy chi tiết chiến dịch"
            });
      }
}

// Register
async function createRegisterRequest(campaign_id) {
      if (!campaign_id) {
            return false;
      }

      try {
            // Check if campaign exists
            const campaigns = await query(
                  "SELECT * FROM vaccination_campaign WHERE id = $1",
                  [campaign_id]
            );
            if (campaigns.rows.length === 0) {
                  return false;
            }

            // SAI FLOW RÙI
            // Check if campaign is in progress
            // const currentDate = new Date();
            // const startDate = new Date(campaigns.rows[0].start_date);
            // const endDate = new Date(campaigns.rows[0].end_date);
            // console.log("Current Date:", currentDate);
            // console.log("Start Date:", startDate);
            // console.log("End Date:", endDate);
            // if (currentDate < startDate || currentDate > endDate) { // THIS IS NOT RIGHT TO THE CORE FLOW
            //       return res
            //             .status(400)
            //             .json({ error: true, message: "Campaign is not in progress" });
            // }

            // Check nếu campaign đang trong giai đoạn nhận đơn thì tiếp tục tạo register (status PREPARING), không thì return
            if (campaigns.rows[0].status !== 'PREPARING') {
                  return false;
            }


            // Check if registration already exists for the campaign
            // THIS IS HARD CODE, JUST FINE AT THE DEMO SCOPE, PLS CHANGE LATER
            const existingRegistrations = await query(
                  "SELECT * FROM vaccination_campaign_register WHERE campaign_id = $1",
                  [campaign_id]
            );
            if (existingRegistrations.rows.length > 0) {
                  return false;
            }

            // Find vaccine from campaign
            const vaccine_id = campaigns.rows[0].vaccine_id;
            if (!vaccine_id) {
                  return false;
            }

            // Find disease from vaccine
            const disease_id = await query(
                  "SELECT disease_id FROM vaccine WHERE id = $1",
                  [vaccine_id]
            );

            // console.log("Disease ID:", disease_id.rows[0].disease_id);

            const disease = await query("SELECT * FROM disease WHERE id = $1", [
                  disease_id.rows[0].disease_id,
            ]);
            console.log("Disease:", disease.rows[0]);

            if (disease.rows.length === 0) {
                  return false;
            }

            //Get all students eligible for the campaign
            const eligibleStudents = await getStudentEligibleForADiseaseID(disease_id.rows[0].disease_id);
            console.log(eligibleStudents);

            if (eligibleStudents.length === 0) {
                  return false;
            }

            //Create registration requests for eligible students
            if (!eligibleStudents || eligibleStudents.length === 0) {
                  return false;
            }
            for (const student of eligibleStudents) {
                  await query(
                        `INSERT INTO vaccination_campaign_register (campaign_id, student_id, reason, is_registered)
                        VALUES ($1, $2, $3, $4)`,
                        [campaign_id, student.student_id, `Auto_gen for ${campaign_id}`, false]
                  );
            }

            return true;
      } catch (error) {
            console.error("Error creating registration request:", error);
            return false;
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

            // const currentDate = new Date();
            // const startDate = new Date(campaign.rows[0].start_date);
            // const endDate = new Date(campaign.rows[0].end_date);

            // THIS BELOW CODES IS WRONG RELATED TO LOGIC
            // if (currentDate < startDate || currentDate > endDate) {
            //       console.log("Current Date:", currentDate);
            //       console.log("Start Date:", startDate);
            //       console.log("End Date:", endDate);
            //       return res.status(400).json({
            //             error: true,
            //             message: "Cannot update registration status outside campaign dates",
            //       });
            // }

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
            return res.status(400).json({ error: true, message: "Thiếu id đơn đăng ký tiêm." });
      }

      if (!reason) {
            return res.status(400).json({ error: true, message: "Thiếu lý do tại sao không đăng ký tiêm." });
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

            // THIS BELOW CODES IS WRONG RELATED TO LOGIC
            // const currentDate = new Date();
            // const startDate = new Date(campaign.rows[0].start_date);
            // const endDate = new Date(campaign.rows[0].end_date);

            // if (currentDate < startDate || currentDate > endDate) {
            //       console.log("Current Date:", currentDate);
            //       console.log("Start Date:", startDate);
            //       console.log("End Date:", endDate);
            //       return res.status(400).json({
            //             error: true,
            //             message: "Cannot update registration status outside campaign dates",
            //       });
            // }

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
            return res.status(400).json({ error: true, message: "Missing campaign_id" });
      }

      try {
            // Truy vấn disease_id từ chiến dịch
            const result = await query(
                  `
                        SELECT dis.id AS disease_id
                        FROM vaccination_campaign camp
                        JOIN vaccine vac ON camp.vaccine_id = vac.id
                        JOIN disease dis ON dis.id = vac.disease_id
                        WHERE camp.id = $1
                  `,
                  [campaign_id]
            );

            if (!result.rows || result.rows.length === 0) {
                  return res.status(404).json({ error: true, message: "Campaign not found or no associated disease" });
            }

            const disease_id = result.rows[0].disease_id;
            console.log(disease_id);

            // Lấy danh sách học sinh đủ điều kiện
            const studentCompletedDoses = await query(`
                  SELECT 
                  s.id AS student_id,
                  COALESCE(COUNT(vr.id) FILTER (
                  WHERE vr.status = 'COMPLETED'
                  ), 0) AS completed_doses,
                  d.dose_quantity
                  FROM student s
                  CROSS JOIN disease d
                  LEFT JOIN vaccine v ON v.disease_id = d.id
                  LEFT JOIN vaccination_record vr 
                  ON vr.student_id = s.id 
                  AND vr.vaccine_id = v.id
                  WHERE d.id = $1
                  GROUP BY s.id, d.dose_quantity;
            `, [disease_id])

            console.log(studentCompletedDoses.rows);

            if (studentCompletedDoses.rowCount === 0) {
                  return res.status(404).json({ error: true, message: "No eligible students found" });
            }

            let completed_doses_and_record = [];

            for (let student of studentCompletedDoses.rows) {
                  const records = await query(`
                        select rec.id as record_id, rec.register_id, rec.description, rec.location, rec.vaccination_date, rec.status, vac.name as vaccine_name ,vac.id as vaccine_id,dis.id as disease_id ,dis.name as disease_name 
                        from vaccination_record rec join vaccine vac on rec.vaccine_id = vac.id
                        join disease dis on vac.disease_id = dis.id
                        where student_id = $1 and disease_id = $2
                  `, [student.student_id, disease_id]);
                  console.log(student);
                  console.log(records.rows);
                  completed_doses_and_record.push({ student_id: student.student_id, completed_doses: student.completed_doses, dose_quantity: student.dose_quantity, records: records.rows });
            }

            return res.status(200).json({
                  error: false,
                  message: "Eligible students retrieved",
                  data: completed_doses_and_record,
            });

      } catch (error) {
            console.error("Error retrieving eligible students:", error);
            return res.status(500).json({ error: true, message: "Internal server error" });
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

            // Get name of the disease from the vaccine in the campaign
            const vaccine_id = campaigns.rows[0].vaccine_id;
            const disease_id = await query(
                  "SELECT disease_id FROM vaccine WHERE id = $1",
                  [vaccine_id]
            );
            const disease_name = await query("SELECT name FROM disease WHERE id = $1", [
                  disease_id.rows[0].disease_id,
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
                        `INSERT INTO vaccination_record (student_id, vaccine_id, status)
                        VALUES ($1, $2, 'PENDING')`,
                        [registration.student_id, vaccine_id]
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


// Cái này dùng cho tạo record mà không đăng ký tiêm qua campaign
export async function createVaccinationRecord(req, res) {
      const {
            student_id,
            register_id,
            description,
            vaccine_id,
            location,
            vaccination_date,
            status
      } = req.body;
      if (!student_id || !vaccination_date || !vaccine_id || !status) {
            return res
                  .status(400)
                  .json({ error: true, message: "Missing required fields" });
      }

      try {
            // Check if student exists
            const students = await query("SELECT * FROM student WHERE id = $1", [
                  student_id,
            ]);
            if (students.rows.length === 0) {
                  return res
                        .status(404)
                        .json({ error: true, message: "Student not found" });
            }

            // Insert vaccination record into database
            const insertQuery = `
                  INSERT INTO vaccination_record (student_id, register_id, description, name, location, vaccination_date, status, campaign_id)
                  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                  RETURNING *;
            `;

            const result = await query(insertQuery, [
                  student_id,
                  register_id || null,
                  description || null,
                  vaccine_id,
                  location || null,
                  vaccination_date,
                  status,
            ]);

            return res
                  .status(201)
                  .json({ message: "Vaccination record created", data: result.rows[0] });
      } catch (error) {
            console.error("Error creating vaccination record:", error);
            return res
                  .status(500)
                  .json({ error: true, message: "Internal server error" });
      }
}

// Update vaccination record - keep old content if no new data is passed (null = no change)
export async function updateVaccinationRecord(req, res) {
      const { record_id } = req.params;
      const { description, vaccine_id, location, vaccination_date, status } =
            req.body;

      try {
            // Check if vaccination record exists
            const record = await query(
                  "SELECT * FROM vaccination_record WHERE id = $1",
                  [record_id]
            );
            if (record.rows.length === 0) {
                  return res
                        .status(404)
                        .json({ error: true, message: "Vaccination record not found" });
            }

            // Update vaccination record
            const updateQuery = `
                  UPDATE vaccination_record
                  SET description = COALESCE($1, description),
                        vaccine_id = COALESCE($2, vaccine_id),
                        location = COALESCE($3, location),
                        vaccination_date = COALESCE($4, vaccination_date),
                        status = COALESCE($5, status)
                  WHERE id = $6
                  RETURNING *;
            `;

            const result = await query(updateQuery, [
                  description,
                  vaccine_id,
                  location,
                  vaccination_date,
                  status,
                  record_id
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

// Get vaccination record by record ID
export async function getVaccinationRecord(req, res) {
      const { id } = req.params;

      if (!id) {
            return res
                  .status(400)
                  .json({ error: true, message: "Missing required fields" });
      }

      try {
            const records = await query(
                  "SELECT * FROM vaccination_record WHERE id = $1",
                  [id]
            );
            if (records.rows.length === 0) {
                  return res
                        .status(404)
                        .json({ error: true, message: "Vaccination record not found" });
            }

            return res.status(200).json({
                  message: "Vaccination record retrieved",
                  data: records.rows[0],
            });
      } catch (error) {
            console.error("Error retrieving vaccination record:", error);
            return res
                  .status(500)
                  .json({ error: true, message: "Internal server error" });
      }
}

// Get all vaccination records for a student
export async function getVaccinationRecordsByStudentID(req, res) {
      const { student_id } = req.params;

      if (!student_id) {
            return res
                  .status(400)
                  .json({ error: true, message: "Missing required fields" });
      }

      try {
            const records = await query(
                  "SELECT * FROM vaccination_record a join vaccine b on a.vaccine_id = b.id WHERE student_id = $1",
                  [student_id]
            );
            if (records.rows.length === 0) {
                  return res.status(404).json({
                        error: true,
                        message: "No vaccination records found for this student",
                  });
            }

            return res.status(200).json({
                  message: "Vaccination records retrieved",
                  data: records.rows,
            });
      } catch (error) {
            console.error("Error retrieving vaccination records:", error);
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
            const result = await query(`
      SELECT *
      FROM vaccination_campaign_register
      WHERE student_id = $1 AND campaign_id = $2
    `, [student_id, campaign_id]);

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
    CROSS JOIN disease d
    LEFT JOIN vaccine v ON v.disease_id = d.id
    LEFT JOIN vaccination_record vr 
      ON vr.student_id = s.id 
      AND vr.vaccine_id = v.id
    WHERE d.id = $1
    GROUP BY s.id, d.dose_quantity
    HAVING COALESCE(COUNT(vr.id) FILTER (
      WHERE vr.status = 'COMPLETED'
    ), 0) < d.dose_quantity;
  `;

      return (await query(sql, [disease_id])).rows;

}

async function updateCampaignStatus(campaign_id, status, res, successMessage) {
      try {
            const result = await query(`
                  UPDATE vaccination_campaign
                  SET status = $1
                  WHERE id = $2
                  RETURNING *
            `, [status, campaign_id]);

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
      return updateCampaignStatus(campaign_id, "PREPARING", res, "Chiến dịch đã mở đăng ký!");
}

export async function closeRegisterByCampaignID(req, res) {
      const { campaign_id } = req.params;

      try {
            // tạo trạng thái chiến dịch
            const updatedCampaign = await query(`
                  UPDATE vaccination_campaign
                  SET status = 'UPCOMING'
                  WHERE id = $1
                  RETURNING *
            `, [campaign_id]);

            if (updatedCampaign.rowCount === 0) {
                  return res.status(404).json({
                        error: true,
                        message: "Cập nhật trạng thái cho chiến dịch thành UPCOMING không thành công!",
                  });
            }


            // Lấy danh sách học sinh đã đăng ký thành công cho chiến dịch này
            const registrations = await query(
                  `SELECT 
                  r.student_id, 
                  c.vaccine_id, 
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


            // Tạo bản ghi tiền tiêm chủng (PENDING) cho từng học sinh
            for (const registration of registrations.rows) {
                  await query(
                        `INSERT INTO vaccination_record (student_id, vaccine_id, status, register_id)
                        VALUES ($1, $2, 'PENDING', $3) ON CONFLICT (student_id, vaccine_id, register_id) DO NOTHING`,
                        [registration.student_id, registration.vaccine_id, registration.register_id]
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
      return updateCampaignStatus(campaign_id, "ONGOING", res, "Chiến dịch đã bắt đầu, đang tiêm cho học sinh");
}

export async function completeCampaign(req, res) {
      const { campaign_id } = req.params;
      return updateCampaignStatus(campaign_id, "COMPLETED", res, "Chiến dịch đã hoàn thành.");
}

export async function cancelCampaignByID(req, res) {
      const { campaign_id } = req.params;
      return updateCampaignStatus(campaign_id, "CANCELLED", res, "Chiến dịch đã bị hủy");
}
