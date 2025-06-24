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

        return res.status(200).json({
            error: false,
            data: rs,
        });

    } catch (err) {
        console.error("❌ Error creating Campaign ", err);
        return res
            .status(500)
            .json({ error: true, message: "Lỗi khi lấy SpecialistExam." });
    }

}


export async function createSpecialistExam(req, res) {
    const { name, description } = req.body;

    try {

        if (!name || !description) {
            return res
                .status(400)
                .json({ error: true, message: "Không Nhận được name or description" });
        }

        const rs = await query(`INSERT INTO SpecialistExamList 
            (name,description) 
            VALUES ($1,$2)`
            , [name, description]);

        if (rs.rowCount === 0) {
            return res
                .status(400)
                .json({ error: true, message: "Tạo mới Specialist Exam không thành công" });
        }

        return res.status(200).json({
            error: false,
            message: "Tạo mới Specialis Exam thành công!",

        });



    } catch (err) {
        console.error("❌ Error creating Campaign ", err);
        return res
            .status(500)
            .json({ error: true, message: "Lỗi khi lấy SpecialistExam." });
    }



}


export async function updateSpecialExam(req, res) {

    const { id } = req.params;
    const { name, description } = req.body;

    try {

        if (!id || !name || !description) {
            return res
                .status(400)
                .json({ error: true, message: "Không Nhận được ID or name or description" });
        }

        const check = await query(`SELECT * FROM specialistexamlist
             WHERE id = $1`
            , [id]);

        if (check.rowCount === 0) {
            return res
                .status(400)
                .json({ error: true, message: "Không Nhận tồn tại Special Exam" });
        }

        const rs = await query(`UPDATE specialistexamlist 
            SET name = $1,description = $2 
            WHERE id = $3`
            , [name, description, id]);

        if (rs.rowCount===0){
            return res
                .status(400)
                .json({ error: true, message: "Update không thành công" });
        }

        return res.status(200).json({
            error: false,
            message: "Update thành công !",

        });




    } catch (err) {
        console.error("❌ Error creating Campaign ", err);
        return res
            .status(500)
            .json({ error: true, message: "Lỗi khi lấy SpecialistExam." });
    }
}


export async function getSpecialExam(req,res) {
   const { id } = req.params;
    try{
         if (!id ) {
            return res
                .status(400)
                .json({ error: true, message: "Không Nhận được ID " });
        }

        const check = await query(`SELECT * FROM specialistexamlist
             WHERE id = $1`
            , [id]);
        const rs = check.rows;

        if (check.rowCount === 0) {
            return res
                .status(400)
                .json({ error: true, message: "Không Nhận tồn tại Special Exam" });
        }

        return res.status(200).json({
            error: false,
            data:rs
           

        });




    }catch (err) {
        console.error("❌ Error creating Campaign ", err);
        return res
            .status(500)
            .json({ error: true, message: "Lỗi khi lấy SpecialistExam." });
    }
}
