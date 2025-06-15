import { query } from "../config/database.js";
import { getSupabaseProfileByUUID } from "./users.controller.js"

export async function getInfoOfGrades(req, res) {
      try {
            const result = await query(`
      select * from grade
    `);
            return res.status(200).json({ error: false, data: result.rows });
      } catch (error) {
            console.error("Error fetching classes:", error);  // Sửa lại log cho đúng nội dung
            return res.status(500).json({ error: true, message: "Internal server error" });
      }
}

export async function getClassesInfoOfGradeByID(req, res) {
      const { id } = req.params;

      if (!id) {
            return res.status(400).json({ error: true, message: "Missing class ID" });
      }

      try {
            // Lấy thông tin lớp và khối
            const classInfoResult = await query(
                  `
                  SELECT 
                  c.id AS class_id, 
                  c.name AS class_name, 
                  g.id AS grade_id,
                  g.name AS grade_name
                  FROM class c 
                  JOIN grade g ON c.grade_id = g.id 
                  WHERE c.id = $1
                  `,
                  [id]
            );

            if (classInfoResult.rowCount === 0) {
                  return res.status(404).json({ error: true, message: "Class not found" });
            }

            const classInfo = classInfoResult.rows[0];

            // Lấy danh sách học sinh trong lớp
            const studentsResult = await query(
                  `
                  SELECT id, supabase_uid
                  FROM student
                  WHERE class_id = $1
                  `,
                  [id]
            );

            const students = studentsResult.rows;
            classInfo.student_number = students.length;

            // Gọi Supabase để lấy thêm thông tin profile từng học sinh
            const profilePromises = students.map((student) =>
                  getSupabaseProfileByUUID(student.supabase_uid)
            );

            const profiles = await Promise.all(profilePromises);

            // Gộp profile vào danh sách học sinh
            classInfo.students = students.map((student, index) => ({
                  ...student,
                  profile: profiles[index] ?? null,
            }));

            return res.status(200).json({
                  error: false,
                  message: "Class info retrieved successfully",
                  data: classInfo,
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

export async function getInfoOfClassByID(req, res) {
      const { id } = req.params;

      if (!id) {
            return res.status(400).json({ error: true, message: "Missing class ID" });
      }

      try {
            // Lấy thông tin lớp và khối
            const classInfoResult = await query(
                  `
                  SELECT 
                  c.id AS class_id, 
                  c.name AS class_name, 
                  g.id AS grade_id,
                  g.name AS grade_name
                  FROM class c 
                  JOIN grade g ON c.grade_id = g.id 
                  WHERE c.id = $1
                  `,
                  [id]
            );

            if (classInfoResult.rowCount === 0) {
                  return res.status(404).json({ error: true, message: "Class not found" });
            }

            const classInfo = classInfoResult.rows[0];

            // Lấy danh sách học sinh trong lớp
            const studentsResult = await query(
                  `
                  SELECT id, supabase_uid
                  FROM student
                  WHERE class_id = $1
                  `,
                  [id]
            );

            const students = studentsResult.rows;
            classInfo.student_number = students.length;

            // Gọi Supabase để lấy thêm thông tin profile từng học sinh
            const profilePromises = students.map((student) =>
                  getSupabaseProfileByUUID(student.supabase_uid)
            );

            const profiles = await Promise.all(profilePromises);

            // Gộp profile vào danh sách học sinh
            classInfo.students = students.map((student, index) => ({
                  ...student,
                  profile: profiles[index] ?? null,
            }));

            return res.status(200).json({
                  error: false,
                  message: "Class info retrieved successfully",
                  data: classInfo,
            });
      } catch (error) {
            console.error("Error fetching class info:", error);
            return res.status(500).json({
                  error: true,
                  message: "Internal server error",
            });
      }
}

