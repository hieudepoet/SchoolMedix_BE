import { query } from "../config/database.js";

export async function getInfoOfGrades(req, res) {
      try {
            const result = await query(`
      select * from grade
    `);
            return res.status(200).json({ error: false, data: result.rows });
      } catch (error) {
            console.error("Error fetching classes:", error);
            return res.status(500).json({ error: true, message: "Internal server error" });
      }
}

export async function getClassesInfoOfGradeByID(req, res) {
      const { grade_id } = req.params;

      if (!grade_id) {
            return res.status(400).json({ error: true, message: "Missing grade ID" });
      }

      try {
            const classInfoResult = await query(
                  `
      SELECT 
        g.id AS grade_id, 
        g.name AS grade_name, 
        c.id AS class_id, 
        c.name AS class_name 
      FROM grade g
      JOIN class c ON g.id = c.grade_id
      WHERE g.id = $1
      `,
                  [grade_id]
            );

            if (classInfoResult.rowCount === 0) {
                  return res.status(404).json({ error: true, message: "No classes found for this grade" });
            }

            const gradeInfo = {
                  grade_id: classInfoResult.rows[0].grade_id,
                  grade_name: classInfoResult.rows[0].grade_name,
                  classes: classInfoResult.rows.map(row => ({
                        class_id: row.class_id,
                        class_name: row.class_name,
                  })),
            };

            return res.status(200).json({
                  error: false,
                  message: "Classes retrieved successfully",
                  data: gradeInfo,
            });
      } catch (error) {
            console.error("Error fetching class info:", error);
            return res.status(500).json({
                  error: true,
                  message: "Internal server error",
            });
      }
}


export async function getInfoOfClasses(req, res) {
      try {
            const result = await query(`
      SELECT 
        c.id AS class_id, 
        c.name AS class_name, 
        c.grade_id,
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


export async function getClassInfoOfAStudent(req, res) {
      const { student_id } = req.params;

      try {
            const result = await query(`
                  SELECT 
                  c.*, 
                  g.*, 
                  COUNT(s2.id) AS total_students
                  FROM class c
                  JOIN student s1 ON s1.class_id = c.id AND s1.id = $1
                  JOIN grade g ON c.grade_id = g.id
                  LEFT JOIN student s2 ON s2.class_id = c.id
                  GROUP BY c.id, g.id, c.name, g.name
            `, [student_id]);

            return res.status(200).json({ error: false, data: result.rows[0] });
      } catch (error) {
            return res.status(500).json({ error: true, message: "Internal server error" });
      }
} 