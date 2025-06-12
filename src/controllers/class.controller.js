import { query } from "../config/database.js";


export async function getInfoOfClasses(req, res) {
      try {
            const result = await query(`
      SELECT 
        c.id AS class_id, 
        c.name AS class_name, 
        g.name AS grade_name 
      FROM class c 
      JOIN grade g ON c.grade_id = g.id
    `);
            return res.status(200).json({ error: false, data: result.rows });
      } catch (error) {
            console.error("Error fetching classes:", error);  // Sửa lại log cho đúng nội dung
            return res.status(500).json({ error: true, message: "Internal server error" });
      }
}

export async function getInfoOfClassByID(req, res) {
      const { id } = req.params;
      if (!id) {
            res.status(400).json({ error: true, message: "ko co id" });
      }
      try {
            const result = await query("select c.id, c.name as class_name, g.name as grade_name from class c join grade g on c.grade_id = g.id where c.id = $1", [id]);
            return res.status(200).json({ error: false, data: result.rows });
      } catch (error) {
            console.error("Error fetching diseases:", error);
            return res.status(500).json({ error: true, message: "Internal server error" });
      }
}


