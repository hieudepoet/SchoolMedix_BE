import { query } from "../config/database.js";

//FC lấy ID student từ Parent
async function getStudentIdsByParentId(parentId) {
    const result_student = await query(
        `SELECT id FROM Student WHERE mom_id = $1 OR dad_id = $1`,
        [parentId]
    );
    return result_student.rows.map((student) => student.id);
}
//FC check ID Parent có tồn tại hay không
async function checkParentIdExists(parentId) {
    const result = await query("SELECT * FROM Parent WHERE id = $1", [parentId]);
    if (result.rowCount === 0) {
        return false;
    } else return true;
}
//FC check ID Campaign có tồn tại không

async function checkCampaignExists(campaignID) {
    const result = await query("SELECT * FROM checkupcampaign  WHERE id = $1", [
        campaignID,
    ]);
    if (result.rowCount === 0) {
        return false;
    } else return true;
}

export async function createCampaign(req, res) {
    const {
        name,
        description,
        location,
        start_date,
        end_date,
        status, //Default:PREPARING-->UPCOMING-->ONGOING -->DONE or CANCELLED
        specialist_exam_ids, // Admin chon các Special  Exam List
    } = req.body;

    if (
        !name ||
        !description ||
        !location ||
        !start_date ||
        !end_date ||
        !Array.isArray(specialist_exam_ids)
    ) {
        return res
            .status(400)
            .json({ error: true, message: "Thiếu các thông tin cần thiết." });
    }

    try {
        // STEPT 1: Tạo mới Campaign
        const result_campaign = await query(
            `INSERT INTO CheckupCampaign 
            (name, description, location, start_date, end_date, status) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *`,
            [name, description, location, start_date, end_date, "PREPARING"]
        );

        const campaign = result_campaign.rows[0]; //Lấy Record đầu tiên trong  ( Phải có RETURNING mới có Record)

        if (result_campaign.rowCount === 0) {
            return res
                .status(400)
                .json({ error: true, message: "Create Campaign không thành công." });
        }

        //STEP 2: Tạo mới campagincontainsspeexam

        if (!Array.isArray(specialist_exam_ids)) {
            for (const exam_id of specialist_exam_ids) {
                const result_campagincontain = await query(
                    "INSERT INTO CampaignContainSpeExam (campaign_id,specialist_exam_id) VALUES ($1,$2) RETURNING *",
                    [campaign.id, exam_id]
                );

                if (result_campagincontain.rowCount === 0) {
                    return res
                        .status(400)
                        .json({
                            error: true,
                            message: "Create Campagincontainsspeexam không thành công.",
                        });
                }
            }
        }

        //STEP 3: Tạo CheckUp Register
        //Lấy danh sách student
        const result_student = await query(`SELECT * FROM Student`);
        const students = result_student.rows;
        const checkup_register = [];
        //Tạo CheckUp Register  và cho từng Student
        for (const student of students) {
            const result_checkup_register = await query(
                `INSERT INTO CheckupRegister (campaign_id, student_id, status)
                     VALUES ($1, $2, $3)  RETURNING*`,
                [campaign.id, student.id, "PENDING"]
            );

            if (result_checkup_register.rowCount === 0) {
                return res
                    .status(400)
                    .json({
                        error: true,
                        message: "Create CheckUp Register không thành công.",
                    });
            }

            checkup_register.push(result_checkup_register.rows[0]);
        }

        // STEP 4 Tạo specialistExamRecord theo từng CheckUp Register và Special List Exam

        for (const registerId of checkup_register) {
            for (const examId of specialist_exam_ids) {
                const result_update_speciallist = await query(
                    `INSERT INTO specialistExamRecord (register_id,spe_exam_id,status)
                        VALUES ($1, $2, $3)`,
                    [registerId.id, examId, "CANNOT_ATTACH"]
                );

                if (result_update_speciallist.rowCount === 0) {
                    return res
                        .status(400)
                        .json({
                            error: true,
                            message: "Create Special List Exam Record không thành công.",
                        });
                }
            }
        }

        // STEP 5: Tạo HealthRecord cho từng Register và Student

        for (const registerID of checkup_register) {
            const result_check_healthrecord = await query(
                `INSERT INTO HealthRecord (register_id) VALUES ($1)`,
                [registerID.id]
            );
            if (result_check_healthrecord.rowCount === 0) {
                return res
                    .status(400)
                    .json({
                        error: true,
                        message: "Create Health Record không thành công.",
                    });
            }
        }

        return res
            .status(200)
            .json({ error: false, message: "Create Campaign Thành Công" });
    } catch (err) {
        console.error("❌ Error creating Campaign ", err);
        return res
            .status(500)
            .json({ error: true, message: "Lỗi server khi tạo Check Up Campaign." });
    }
}
export async function getAllCheckupCampaigns(req, res) {
    try {
        // Lấy tất cả các chiến dịch
        const result_campaigns = await query(`
            SELECT * FROM CheckupCampaign
            ORDER BY start_date DESC
        `);

        const campaigns = result_campaigns.rows;

        if (campaigns.length === 0) {
            return res
                .status(200)
                .json({ error: false, message: "Không có chiến dịch nào.", data: [] });
        }

        // Lặp qua từng chiến dịch để lấy thông tin SpecialistExam tương ứng
        for (const campaign of campaigns) {
            const result_exams = await query(
                `
                SELECT s.id, s.name, s.description
                FROM CampaignContainSpeExam c
                JOIN SpecialistExamList s ON c.specialist_exam_id = s.id
                WHERE c.campaign_id = $1
            `,
                [campaign.id]
            );

            campaign.specialist_exams = result_exams.rows;
        }

        return res.status(200).json({
            error: false,
            message: "Lấy danh sách chiến dịch thành công.",
            data: campaigns,
        });
    } catch (err) {
        console.error("❌ Error creating Campaign ", err);
        return res
            .status(500)
            .json({ error: true, message: "Lỗi server lấy danh sách Campaign." });
    }
}

export async function getALLHealthRecord(req, res) {
    try {
        const result = await query("SELECT * FROM healthrecord WHERE status = $1", [
            "DONE",
        ]);
        if (result.rowCount === 0) {
            return res
                .status(400)
                .json({ error: true, message: "không lấy được Health Record." });
        }

        return res.status(200).json({ error: false, data: result.rows });
    } catch (err) {
        console.error("❌ Error creating Campaign ", err);
        return res
            .status(500)
            .json({ error: true, message: "Lỗi server khi  nhận Health Record." });
    }
}

export async function getALLSpeciaListExamRecord(req, res) {
    try {
        const result = await query(
            "SELECT * FROM specialistexamrecord WHERE status = $1",
            ["DONE"]
        );

        if (result.rowCount === 0) {
            return res
                .status(400)
                .json({ error: true, message: "không lấy được SpeciaListExamRecord." });
        }

        return res.status(200).json({ error: false, data: result.rows });
    } catch (err) {
        console.error("❌ Error creating Campaign ", err);
        return res
            .status(500)
            .json({ error: true, message: "Lỗi server lấy SpeciaListExamRecord." });
    }
}

export async function getALLRegisterByCampaignID(req, res) {
    const { id } = req.params;
    try {
        if (!id) {
            return res
                .status(400)
                .json({ error: true, message: "không lấy nhận được Campaign ID." });
        }

        const check = await query("SELECT * FROM checkupcampaign WHERE id = $1", [
            id,
        ]);
        if (check.rowCount === 0) {
            return res
                .status(400)
                .json({ error: true, message: "không  tìm được Campaign." });
        }

        const result = await query(`
            SELECT c.id as register_id, c.status as register_status, cr.status as campaign_status, c.*,cr.*, s.name as student_name, s.class_id, cla.name as class_name
            FROM checkupregister c
            JOIN checkupcampaign cr ON c.campaign_id = cr.id
			join student s on s.id = c.student_id
			join class cla on cla.id = s.class_id
            WHERE cr.id = $1`
            , [id]);

        if (result.rowCount === 0) {
            return res
                .status(400)
                .json({ error: true, message: "không lấy được đơn đăng ký." });
        }

        return res.status(200).json({ error: false, data: result.rows });
    } catch (err) {
        console.error("❌ Error creating Campaign ", err);
        return res
            .status(500)
            .json({ error: true, message: "Lỗi Lấy Danh Sách CheckUp Register." });
    }
}

//Lấy tất cả các CheckUp Register theo parent_id (KHÔNG CẦN PHẢI PENDING)
export async function getCheckupRegisterByParentID(req, res) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: true, message: "Thiếu ID Parent." });
    }

    try {
        const result_check = await query("SELECT * FROM parent WHERE id = $1", [
            id,
        ]);

        if (result_check.rowCount === 0) {
            return res
                .status(400)
                .json({ error: true, message: "Không tìm thấy ID của Parent." });
        }

        //Lấy tất cả Student có mon_id or dad_id là parent_id
        const result_student = await query(
            `SELECT * FROM Student WHERE mom_id = $1 OR dad_id = $2`,
            [id, id]
        );

        //Lấy student_id từ Prent
        const student_ids = [];
        for (const student of result_student.rows) {
            student_ids.push(student.id);
        }

        if (student_ids.length === 0) {
            return res
                .status(400)
                .json({ error: true, message: "Không tìm thấy ID của Student." });
        }

        //Lấy các CheckUpRegister và speciallistexamrecord từ Student_id

        const allRegisters = [];

        for (const student_id of student_ids) {
            const result_checkup_register = await query(
                ` SELECT 
                    r.id AS register_id,
                    r.campaign_id,
                    r.student_id,
                    r.submit_by,
                    r.submit_time,
                    r.reason,
                    r.status,
                    s.spe_exam_id,
                    s.status
                FROM checkupregister r
                JOIN specialistexamrecord s ON s.register_id = r.id
                WHERE r.student_id = $1
            `,
                [student_id]
            );

            allRegisters.push(...result_checkup_register.rows);
        }

        // 3. Group by register_id
        const mapByRegister = {};
        for (const row of allRegisters) {
            const id = row.register_id;
            if (!mapByRegister[id]) {
                // Khởi tạo lần đầu
                mapByRegister[id] = {
                    register_id: row.register_id,
                    campaign_id: row.campaign_id,
                    student_id: row.student_id,
                    submit_by: row.submit_by,
                    submit_time: row.submit_time,
                    reason: row.reason,
                    status: row.status,
                    exams: [],
                };
            }
            // Đẩy exam vào mảng
            mapByRegister[id].exams.push({
                spe_exam_id: row.spe_exam_id,
                status: row.status,
            });
        }

        // Chuyển về array
        const mergedRegisters = Object.values(mapByRegister);

        // 4. Trả về
        return res.status(200).json({ error: false, data: mergedRegisters });
    } catch (err) {
        console.error("❌ Error creating Campaign ", err);
        return res
            .status(500)
            .json({
                error: true,
                message: "Lỗi server khi Parent nhận Register Form.",
            });
    }
}

//Lấy tất cả các CheckUp Register theo student_id (KHÔNG CẦN PHẢI PENDING)
export async function getCheckupRegisterByStudentID(req, res) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: true, message: "Thiếu ID Hoc sinh." });
    }

    try {
        //Lấy các CheckUpRegister và speciallistexamrecord từ Student_id

        const result_checkup_register = await query(
            ` SELECT 
                    r.id AS register_id,
                    r.campaign_id,
                    r.student_id,
                    r.submit_by,
                    r.submit_time,
                    r.reason,
                    r.status,
                    s.spe_exam_id,
                    s.status
                FROM checkupregister r
                JOIN specialistexamrecord s ON s.register_id = r.id
                WHERE r.student_id = $1
            `,
            [id]
        );

        const result = result_checkup_register.rows;

        if (result.length === 0) {
            return res
                .status(200)
                .json({ error: false, message: "Không có Register" });
        }

        const mapByRegister = {};
        for (const row of result) {
            const ids = row.result.register_id;
            if (!mapByRegister[ids]) {
                // Khởi tạo lần đầu
                mapByRegister[ids] = {
                    register_id: row.register_id,
                    campaign_id: row.campaign_id,
                    student_id: row.student_id,
                    submit_by: row.submit_by,
                    submit_time: row.submit_time,
                    reason: row.reason,
                    status: row.status,
                    exams: [],
                };
            }
            // Đẩy exam vào mảng
            mapByRegister[ids].exams.push({
                spe_exam_id: row.spe_exam_id,
                status: row.status,
            });
        }

        // Chuyển về array
        const mergedRegisters = Object.values(mapByRegister);

        // Trả về
        return res.status(200).json({ error: false, data: mergedRegisters });
    } catch (err) {
        console.error("❌ Error creating Campaign ", err);
        return res
            .status(500)
            .json({
                error: true,
                message: "Lỗi server khi Parent nhận Register Form.",
            });
    }
}

// Parent nhấn Submit Register truyền vào Register_id
export async function submitRegister(req, res) {

    const { id } = req.params;
    const { parent_id, submit_time, reason, exams } = req.body;
    try {


        if (!id || !parent_id || !reason) {

            return res.status(400).json({ error: true, message: "Không có nội dung." });
        }

        if (!Array.isArray(exams)) {
            return res.status(400).json({ error: true, message: "Không có exams." });
        }


        const result_check = await query('SELECT * FROM checkupregister WHERE id = $1 AND status = $2', [id, 'PENDING']);

        if (result_check.rowCount === 0) {
            return res.status(200).json({ error: true, message: "Không có tồn tại Register or đã CANCEL" });
        }


        const result_submit = await query(`UPDATE checkupregister
         SET
           reason      = $1,
           status      = $2,
           submit_by   = $3,
           submit_time = $4
       WHERE id = $5`,
            [reason, 'SUBMITTED', parent_id, submit_time, id]
        );


        if (result_submit.rowCount === 0) {
            return res.status(400).json({ error: true, message: "Submit Register không thành công." });
        }

        const result_update_speciallis = [];

        for (const ex of exams) {
            const { spe_exam_id, status } = ex;
            const result_update = await query(
                `UPDATE specialistexamrecord
            SET status = $1
            WHERE register_id = $2
            AND spe_exam_id  = $3`,
                [status, id, spe_exam_id]);

            result_update_speciallis.push(result_update.rows);
        }

        if (result_update_speciallis.rowCount === 0) {
            return res.status(400).json({ error: true, message: "Submit Register không thành công." });
        } else {
            return res.status(200).json({ error: false, message: 'Submit thành công' });
        }


    } catch (err) {
        console.error("❌ Error creating Campaign ", err);
        return res.status(500).json({ error: true, message: "Lỗi server khi Submit Register Form." });
    }

}

//Admin đóng form Register truyền vào ID Campaign
export async function closeRegister(req, res) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: true, message: "Thiếu ID Campaign." });
    }

    try {
        const result_check = await query(
            "SELECT * FROM CheckupCampaign WHERE id = $1",
            [id]
        );
        if (result_check.rowCount === 0) {
            return res
                .status(400)
                .json({ error: true, message: "Không tìm thấy id Campaign ." });
        }

        // Step 1: Cập nhật trạng thái UPCOMING cho Campaign
        const result = await query(
            "UPDATE CheckupCampaign SET status = $1 WHERE id = $2",
            ["UPCOMING", id]
        );

        // Step 2: cập nhật trạng thái cho Register

        // 2.1 Lấy tất cả các Register từ campaign_id và Status = 'PENDING'

        const result_checkup_register = await query(
            "SELECT * FROM checkupregister WHERE status = $1 AND campaign_id = $2",
            ["PENDING", id]
        );
        const data = result_checkup_register.rows;

        if (data.length < 0) {
            return res
                .status(400)
                .json({ error: true, message: "Không tìm thấy Register." });
        }

        // 2.2 Chuyển trạng thái Register sang CANCELLED
        const rs = [];

        for (const register_id of data) {
            const res = await query(
                "UPDATE checkupregister SET status = $1 WHERE id = $2",
                ["CANCELLED", register_id.id]
            );

            rs.push(res.rows[0]);
        }

        if (result.rowCount === 0 || rs.length < 0) {
            return res
                .status(400)
                .json({
                    error: true,
                    message: "Đóng form Register không thành công .",
                });
        } else
            return res
                .status(200)
                .json({ error: false, message: "Đóng form Register thành công" });
    } catch (err) {
        console.error("❌ Error creating Campaign ", err);
        return res
            .status(500)
            .json({ error: true, message: "Lỗi khi đóng Register." });
    }
}

//Admin cancel Campaign chuyển status thành CANCELLED
export async function cancelRegister(req, res) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: true, message: "Thiếu ID." });
    }

    try {
        const result_check = await query(
            "SELECT * FROM CheckupCampaign WHERE id = $1",
            [id]
        );
        if (result_check.rowCount === 0) {
            return res
                .status(400)
                .json({ error: true, message: "Không tìm thấy id Campaign ." });
        }

        //Cập nhật trạng thái Cancel cho CheckUpCampaign
        const result = await query(
            "UPDATE CheckupCampaign SET status = $1 WHERE id = $2",
            ["CANCELLED", id]
        );
        //Cập nhật trạng thái cho CheckUp Register
        const result_checkup_register = await query(
            "UPDATE checkupregister SET status = $1 WHERE campaign_id = $2",
            ["CANCELLED", id]
        );
        //Lấy checkup register id từ campaign_id

        const result_checkup_register_id = await query(
            "SELECT * FROM checkupregister WHERE campaign_id = $1",
            [id]
        );

        const rs = result_checkup_register_id.rows.map((r) => r.id);

        //Cập nhật trạng thái cho Health Record

        for (const register_id of rs) {
            const result_health_record = await query(
                "UPDATE healthrecord SET status = $1 WHERE register_id = $2",
                ["CANCELLED", register_id]
            );
        }

        if (result.rowCount === 0 || result_checkup_register.rowCount === 0) {
            return res
                .status(400)
                .json({ error: true, message: "CANCEL không thành công." });
        } else
            return res
                .status(200)
                .json({ error: false, message: "CANCEL thành công" });
    } catch (err) {
        console.error("❌ Error creating Campaign ", err);
        return res
            .status(500)
            .json({ error: true, message: "Lỗi khi đóng Register." });
    }
}
// Nurse or Doctor Update Health  Recordcho Student theo Register ID
export async function updateHealthRecord(req, res) {
    const { id } = req.params;
    const {
        height,
        weight,
        blood_pressure,
        left_eye,
        right_eye,
        ear,
        nose,
        throat,
        teeth,
        gums,
        skin_condition,
        heart,
        lungs,
        spine,
        posture,
        final_diagnosis,
    } = req.body;

    if (
        !height ||
        !weight ||
        !blood_pressure ||
        !left_eye ||
        !right_eye ||
        !ear ||
        !nose ||
        !register_id
    ) {
        return res
            .status(400)
            .json({ error: true, message: "Các chỉ số cơ bản không thể trống." });
    }

    try {
        const result_check = await query(
            "SELECT * FROM healthrecord WHERE register_id = $1",
            [id]
        );

        if (result_check.rowCount === 0) {
            return res
                .status(400)
                .json({
                    error: true,
                    message: "Không tìm thấy hoặc không Health Record",
                });
        }

        //Step 1: Update Health Record
        const result = await query(
            `UPDATE HealthRecord
     SET
        height = $1,
        weight = $2,
        blood_pressure = $3,
        left_eye = $4,
        right_eye = $5,
        ear = $6,
        nose = $7,
        throat = $8,
        teeth = $9,
        gums = $10,
        skin_condition = $11,
        heart = $12,
        lungs = $13,
        spine = $14,
        posture = $15,
        final_diagnosis = $16,
        status = $17
        WHERE register_id = $18`,
            [
                height,
                weight,
                blood_pressure,
                left_eye,
                right_eye,
                ear,
                nose,
                throat,
                teeth,
                gums,
                skin_condition,
                heart,
                lungs,
                spine,
                posture,
                final_diagnosis,
                "DONE",
                register_id,
            ]
        );

        const result_checkup_register = await query(
            "UPDATE checkupregister SET status= $1 WHERE id = $2",
            ["DONE", id]
        );

        if (result.rowCount === 0 || result_checkup_register.rowCount === 0) {
            return res
                .status(400)
                .json({
                    error: true,
                    message: "Không tìm thấy hoặc không Update được Health record.",
                });
        } else {
            return res
                .status(200)
                .json({ error: false, message: "Update Health record thành công." });
        }
    } catch (err) {
        console.error("❌ Error creating Campaign ", err);
        return res
            .status(500)
            .json({ error: true, message: "Lỗi khi tạo record." });
    }
}

//Student xem CheckUpRegister của mình cần truyền vào student_id
export async function getCheckupRegisterStudent(req, res) {
    const { id } = req.params;

    try {
        const result = await query(
            "SELECT * FROM checkupregister WHERE student_id = $1",
            [id]
        );
        const data_ = result.rows;
        if (result.rowCount === 0) {
            return res
                .status(400)
                .json({ error: true, message: "Không Campaign đang diễn ra" });
        } else {
            return res.status(200).json({ error: false, data: data_ });
        }
    } catch (err) {
        console.error("❌ Error creating Campaign ", err);
        return res
            .status(500)
            .json({ error: true, message: "Lỗi khi tạo record." });
    }
}

//Parent xem HealthRecord của Student cần truyền vào student id
export async function getHealthRecordParent(req, res) {
    const { id } = req.params;

    if (!id) {
        return res
            .status(400)
            .json({ error: true, message: "Không Nhận được ID Student." });
    }

    try {
        const check_student = await query(`SELECT * FROM student WHERE id = $1`, [
            id,
        ]);

        //Check ID Student có tồn tại không
        if (check_student.rowCount === 0) {
            return res
                .status(400)
                .json({ error: true, message: "Student ID không tồn tại." });
        }

        //Lấy HealthRecod từ Student ID

        const rs = await query(
            ` SELECT cr.campaign_id ,hr.id AS health_record_id , hr.register_id,cr.student_id,hr.is_checked,hr.status AS record_status

    FROM HealthRecord hr
    JOIN CheckupRegister cr ON hr.register_id = cr.id
    WHERE cr.student_id = $1`,
            [id]
        );

        if (rs.rowCount === 0) {
            return res
                .status(400)
                .json({ error: true, message: "Không tồn tại  Health Record." });
        }

        const result = rs.rows;

        return res.status(200).json({ error: false, data: result });
    } catch (err) {
        console.error("❌ Error creating Campaign ", err);
        return res
            .status(500)
            .json({ error: true, message: "Lỗi khi lấy danh sách Record." });
    }
}

export async function getHealthRecordParentDetails(req, res) {
    const { health_record_id } = req.body;
    try {
        if (!health_record_id) {
            return res
                .status(400)
                .json({ error: true, message: "Không nhận được ID Health Record." });
        }

        const rs = await query(`SELECT * FROM HealthRecord WHERE id = $1`, [
            health_record_id,
        ]);

        const result = rs.rows;

        if (result.length === 0) {
            return res
                .status(400)
                .json({ error: true, message: "Không lấy được Details." });
        } else {
            return res.status(200).json({ error: false, data: result });
        }
    } catch (err) {
        console.error("❌ Error creating Campaign ", err);
        return res
            .status(500)
            .json({ error: true, message: "Lỗi khi tạo record." });
    }
}

export async function getSpecialRecordParent(req, res) {
    const { id } = req.params;

    if (!id) {
        return res
            .status(400)
            .json({ error: true, message: "Không Nhận được ID Student." });
    }

    try {
        const check_student = await query(`SELECT * FROM student WHERE id = $1`, [
            id,
        ]);

        //Check ID Student có tồn tại không
        if (check_student.rowCount === 0) {
            return res
                .status(400)
                .json({ error: true, message: "Student ID không tồn tại." });
        }

        const rs = await query(
            `SELECT ser.register_id, ser.spe_exam_id ,sel.name AS exam_name , ser.is_checked,ser.status
        FROM specialistExamRecord ser
        JOIN CheckupRegister cr ON ser.register_id = cr.id
        JOIN SpecialistExamList sel ON ser.spe_exam_id = sel.id
        WHERE cr.student_id = $1`,
            [id]
        );

        if (rs.rowCount === 0) {
            return res
                .status(400)
                .json({ error: true, message: "Không tồn tại  Health Record." });
        }

        const result = rs.rows;

        return res.status(200).json({ error: false, data: result });
    } catch (err) {
        console.error("❌ Error creating Campaign ", err);
        return res
            .status(500)
            .json({ error: true, message: "Lỗi khi lấy danh sách special record." });
    }
}

export async function getSpecialRecordParentDetails(req, res) {
    const { register_id, spe_exam_id } = req.body;

    try {
        if (!register_id || !spe_exam_id) {
            return res
                .status(400)
                .json({
                    error: true,
                    message: "Không nhận được Register ID và Specail Exam ID.",
                });
        }

        const rs = await query(
            `SELECT * FROM specialistexamrecord WHERE register_id=$1 AND spe_exam_id = $2`,
            [register_id, spe_exam_id]
        );

        const result = rs.rows;

        if (result.length === 0) {
            return res
                .status(400)
                .json({ error: true, message: "Không lấy được Details." });
        } else {
            return res.status(200).json({ error: false, data: result });
        }
    } catch (err) {
        console.error("❌ Error creating Campaign ", err);
        return res
            .status(500)
            .json({ error: true, message: "Lỗi khi lấy Special Record Detail." });
    }
}

//Student xem HealthRecord của mình cần truyền vào student_id và camaign_id
export async function getHealthRecordStudent(req, res) {
    const { student_id, campaign_id } = req.params;

    try {
        //Lấy register_id từ student id
        const result = await query(
            "SELECT * FROM checkupregister WHERE student_id = $1 and campaign_id = $2",
            [student_id, campaign_id]
        );

        const rs = result.rows[0];
        console.log(rs);
        if (!rs) {
            return res
                .status(400)
                .json({ error: true, message: "Không tìm thấy health record." });
        }

        if (rs.length === 0) {
            return res
                .status(400)
                .json({ error: true, message: "Không tìm thấy Register." });
        }

        //Lấy Health Record từ Student
        const result_check_healthrecord = await query(
            "SELECT * FROM healthrecord WHERE register_id = $1",
            [rs.id]
        );

        const data = result_check_healthrecord.rows;

        if (data.length === 0) {
            return res
                .status(200)
                .json({
                    error: false,
                    message: "Không tìm thấy Health Record của Student.",
                });
        } else {
            return res.status(200).json({ error: false, data });
        }
    } catch (err) {
        console.error("❌ Error creating Campaign ", err);
        return res
            .status(500)
            .json({ error: true, message: "Lỗi khi xem Health Record." });
    }
}

export async function findHealthRecordByStudentName(params) {
    try {
    } catch (err) {
        console.error("❌ Error creating Campaign ", err);
        return res
            .status(500)
            .json({ error: true, message: "Lỗi khi xem Health Record." });
    }
}

//Cần truyền vào student_id và campaign_id
export async function UpdateCheckinHealthRecord(req, res) {
    const { student_id, campaign_id } = req.body;

    try {
        if (!student_id || !campaign_id) {
            return res
                .status(400)
                .json({
                    error: true,
                    message: "Không nhận được Student ID or Campaign ID.",
                });
        }

        const checkStudent = await query("SELECT * FROM student WHERE id = $1", [
            student_id,
        ]);

        if (checkStudent.rowCount === 0) {
            return res
                .status(400)
                .json({ error: true, message: "Student ID không tồn tại." });
        }

        const checkCampaign = await query(
            "SELECT * FROM checkupcampaign WHERE id = $1",
            [campaign_id]
        );

        if (checkCampaign.rowCount === 0) {
            return res
                .status(400)
                .json({ error: true, message: "Campaign ID không tồn tại." });
        }

        // Tìm ID của HealthRecord
        const result = await query(
            "SELECT hr.* FROM HealthRecord hr JOIN CheckupRegister cr ON hr.register_id = cr.id WHERE cr.student_id =$1 AND cr.campaign_id = $2 ",
            [student_id, campaign_id]
        );

        const result_health_record = result.rows;

        if (result_health_record.length === 0) {
            return res
                .status(400)
                .json({ error: true, message: "Không tìm thấy Health Record ." });
        }

        //Update is_checkin cho HealthRecord

        const result_update = await query(
            "UPDATE healthrecord SET is_checked = $1 WHERE id = $2",
            [true, result_health_record[0].id]
        );

        if (result_update.rowCount === 0) {
            return res
                .status(400)
                .json({ error: true, message: "Cập nhật Health Record thất bại." });
        }

        return res
            .status(200)
            .json({ error: false, message: "Checkin thành công." });
    } catch (err) {
        console.error("❌ Error creating Campaign ", err);
        return res.status(500).json({ error: true, message: "Lỗi khi Check-in." });
    }
}

//Check in khám chuyên khoa
export async function UpdateCheckinSpecialRecord(req, res) {
    const { student_id, campaign_id, spe_exam_id } = req.body;
    try {
        if (!student_id || !campaign_id || !spe_exam_id) {
            return res
                .status(400)
                .json({
                    error: true,
                    message:
                        "Không nhận được Student ID or Campaign ID or Special List Exam ID.",
                });
        }

        const checkStudent = await query("SELECT * FROM student WHERE id = $1", [
            student_id,
        ]);

        if (checkStudent.rowCount === 0) {
            return res
                .status(400)
                .json({ error: true, message: "Student ID không tồn tại." });
        }

        const checkCampaign = await query(
            "SELECT * FROM checkupcampaign WHERE id = $1",
            [campaign_id]
        );

        if (checkCampaign.rowCount === 0) {
            return res
                .status(400)
                .json({ error: true, message: "Campaign ID không tồn tại." });
        }

        const checkSpecialExam = await query(
            "SELECT * FROM specialistexamlist WHERE id = $1",
            [spe_exam_id]
        );

        if (checkSpecialExam.rowCount === 0) {
            return res
                .status(400)
                .json({ error: true, message: "Special List Exam ID không tồn tại." });
        }

        //Lấy SpecialListExamRecord

        const result = await query(
            `SELECT ser.*
            FROM specialistExamRecord ser
            JOIN CheckupRegister cr ON ser.register_id = cr.id
            WHERE cr.student_id = $1 AND cr.campaign_id = $2 AND ser.spe_exam_id = $3`,
            [student_id, campaign_id, spe_exam_id]
        );

        const result_check = result.rows;

        if (result_check.length === 0) {
            return res
                .status(400)
                .json({ error: true, message: "Không tìm thấy Record ." });
        }

        console.log(result_check);
        //Check-in

        const result_update = await query(
            "UPDATE specialistexamrecord SET is_checked = $1 WHERE register_id = $2 AND spe_exam_id = $3",
            [true, result_check[0].register_id, spe_exam_id]
        );

        if (result_update.rowCount === 0) {
            return res
                .status(400)
                .json({ error: true, message: "Cập nhật Health Record thất bại." });
        }

        return res
            .status(200)
            .json({ error: false, message: "Checkin thành công." });
    } catch (err) {
        console.error("❌ Error creating Campaign ", err);
        return res
            .status(500)
            .json({ error: true, message: "Lỗi khi Lỗi khi Check-in." });
    }
}

//Lấy danh sách Student tham gia vào Campaign với Status ON-GOING
export async function getListStudentByCampaignAccept(req, res) {
    const { id } = req.params;

    try {
        if (!id) {
            return res
                .status(400)
                .json({ error: true, message: "Không nhận đươc Campaign ID." });
        }

        const result_check_campaign = await query(
            "SELECT * FROM checkupcampaign WHERE id = $1",
            [id]
        );

        if (result_check_campaign.rowCount === 0) {
            return res
                .status(400)
                .json({ error: true, message: "Campaign ID không tồn tại." });
        }

        const result = await query(
            `SELECT s.id AS student_id ,cr.id AS register_id, s.email, s.name, s.dob,s.gender,s.phone_number,s.address
    FROM Student s
    JOIN CheckupRegister cr ON s.id = cr.student_id
    WHERE cr.campaign_id = $1
`,
            [id]
        );

        const rs = result.rows;

        if (rs.length === 0) {
            return res
                .status(400)
                .json({ error: true, message: "Không Tìm thấy Danh Sách Student." });
        }
    } catch (err) {
        console.error("❌ Error creating Campaign ", err);
        return res
            .status(500)
            .json({ error: true, message: "Lỗi khi Lỗi khi Check-in." });
    }
}

export async function startCampaig(req, res) {
    const { id } = req.params;

    try {
        if (!id) {
            return res
                .status(400)
                .json({ error: true, message: "Không lấy được ID." });
        }

        const check = await query(`SELECT * FROM checkupcampaign WHERE id = $1`, [
            id,
        ]);

        if (check.rowCount === 0) {
            return res
                .status(400)
                .json({ error: true, message: "Campaign ID không tồn tại." });
        }

        // Update status On-going cho CheckUp campaign

        const rs = await query(
            `UPDATE checkupcampaign SET status = $1 WHERE id = $2`,
            ["ONGOING", id]
        );

        if (rs.rowCount === 0) {
            return res
                .status(400)
                .json({ error: true, message: "Start Campaign không thành công." });
        } else {
            return res
                .status(200)
                .json({ error: false, message: "Start Campaign thành công" });
        }
    } catch (err) {
        console.error("❌ Error creating Campaign ", err);
        return res
            .status(500)
            .json({ error: true, message: "Lỗi khi Start Campaign" });
    }
}

export async function finishCampaign(req, res) {
    const { id } = req.params;

    try {
        if (!id) {
            return res
                .status(400)
                .json({ error: true, message: "Không lấy được ID." });
        }

        const check = await query(`SELECT * FROM checkupcampaign WHERE id = $1`, [
            id,
        ]);

        if (check.rowCount === 0) {
            return res
                .status(400)
                .json({ error: true, message: "Campaign ID không tồn tại." });
        }

        // Update status On-going cho CheckUp campaign

        const rs = await query(
            `UPDATE checkupcampaign SET status = $1 WHERE id = $2`,
            ["DONE", id]
        );

        if (rs.rowCount === 0) {
            return res
                .status(400)
                .json({ error: true, message: "Finish Campaign không thành công." });
        } else {
            return res
                .status(200)
                .json({ error: false, message: "Finish Campaign thành công" });
        }
    } catch (err) {
        console.error("❌ Error creating Campaign ", err);
        return res
            .status(500)
            .json({ error: true, message: "Lỗi khi Start Campaign" });
    }
}

export async function getCampaignDetail(req, res) {
    const { id } = req.params;

    try {
        // Kiểm tra ID hợp lệ
        if (!id || isNaN(id)) {
            return res.status(400).json({
                error: true,
                message: "ID chiến dịch không hợp lệ."
            });
        }

        // Kiểm tra chiến dịch tồn tại
        const check = await query(`SELECT * FROM checkupcampaign WHERE id = $1`, [id]);
        if (check.rowCount === 0) {
            return res.status(404).json({
                error: true,
                message: "Chiến dịch không tồn tại."
            });
        }

        // Lấy chi tiết chiến dịch và xét nghiệm chuyên môn
        const rs = await query(
            `SELECT 
                c.id AS campaign_id, 
                c.name AS campaign_name, 
                c.description AS campaign_des,
                c.location AS campaign_location, 
                c.start_date, 
                c.end_date,
                sel.id AS sel_id, 
                sel.name AS spe_name, 
                sel.description AS sel_des
            FROM checkupcampaign c
            LEFT JOIN campaigncontainspeexam cp ON cp.campaign_id = c.id
            LEFT JOIN specialistexamlist sel ON sel.id = cp.specialist_exam_id
            WHERE c.id = $1`,
            [id]
        );

        // Định dạng dữ liệu trả về
        const campaign = {
            campaign_id: check.rows[0].id,
            campaign_name: check.rows[0].name,
            campaign_des: check.rows[0].description || null,
            campaign_location: check.rows[0].location || null,
            start_date: check.rows[0].start_date,
            end_date: check.rows[0].end_date,
            specialist_exams: rs.rows
                .filter(row => row.sel_id) // Lọc các hàng có xét nghiệm
                .map(row => ({
                    id: row.sel_id,
                    name: row.spe_name,
                    description: row.sel_des || null
                }))
        };

        return res.status(200).json({
            error: false,
            message: "Lấy chi tiết chiến dịch thành công.",
            data: campaign
        });

    } catch (err) {
        console.error("❌ Error fetching Campaign details: ", err);
        return res.status(500).json({
            error: true,
            message: "Lỗi server khi lấy chi tiết chiến dịch."
        });
    }
}

export async function getRegisterID(req, res) {
    const { student_id, campaign_id } = req.params;
    console.log(campaign_id);

    try {
        if (!student_id || !campaign_id) {
            return res.status(400).json({
                error: true,
                message: "Không nhận được Student ID or Campaign ID.",
            });
        }

        const check_student = await query(
            `SELECT * FROM student
                WHERE id = $1`,
            [student_id]
        );

        if (check_student.rowCount === 0) {
            return res
                .status(400)
                .json({ error: true, message: "Student ID không tồn tại" });
        }

        const check_campaign = await query(
            `SELECT * FROM checkupcampaign
                WHERE id = $1`,
            [campaign_id]
        );

        if (check_campaign.rowCount === 0) {
            return res
                .status(400)
                .json({ error: true, message: "Campaign ID không tồn tại" });
        }

        const rs = await query(
            `SELECT id
             FROM checkupregister
             WHERE student_id = $1
             AND campaign_id= $2`,
            [student_id, campaign_id]
        );

        if (rs.rowCount === 0) {
            return res
                .status(200)
                .json({ error: true, message: "Không tìm thấy Register ID" });
        } else {
            return res.status(200).json({ error: true, data: rs.rows[0] });
        }
    } catch (err) {
        console.error("❌ Error creating Campaign ", err);
        return res
            .status(500)
            .json({ error: true, message: "Lỗi khi lấy Campaign details" });
    }
}