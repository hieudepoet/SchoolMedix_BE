import { query } from "../config/database.js";


export async function getALLSpeciaListExamRecord(req, res) {

    try {

        const result = await query(`SELECT * FROM specialistexamlist`);

        const rs = result.rows;

        if (result.rowCount === 0) {
            return res
                .status(400)
                .json({ error: true, message: "Không tìm thấy Specialist Exam" });
        }

        return res
            .status(200)
            .json({ error: false, message: "Get Specialist Exam thành công" });





    } catch (err) {
        console.error("❌ Error creating Campaign ", err);
        return res
            .status(500)
            .json({ error: true, message: "Lỗi khi lấy SpecialistExam." });
    }

}