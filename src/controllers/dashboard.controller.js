import { query } from "../config/database.js";
import { getProfileOfStudentByUUID } from "../services/index.js";

// Cái này dùng cho tạo record mà không đăng ký tiêm qua campaign
export async function getSummary(req, res) {
  try {
    // Execute all queries concurrently for better performance
    const [
      totalStudentsResult,
      healthyStudentsResult,
      recentAccidentsResult,
      monitoredCasesResult,
    ] = await Promise.all([
      query("SELECT COUNT(*) AS total FROM student"),
      query(`
        SELECT COUNT(*) AS total 
        FROM student s
        WHERE NOT EXISTS (
          SELECT 1
          FROM disease_record dr 
          WHERE dr.student_id = s.id 
          AND dr.status = 'UNDER_TREATMENT'
        )
      `),
      query(`
        SELECT COUNT(*) AS total 
        FROM daily_health_record
        WHERE detect_time >= date_trunc('week', CURRENT_DATE)
        AND detect_time < date_trunc('week', CURRENT_DATE) + INTERVAL '7 days'
      `),
      query(`
        SELECT COUNT(*) AS total
        FROM disease_record
        WHERE status = 'UNDER_TREATMENT'
      `),
    ]);

    // Extract the total count from each query result
    const data = {
      totalStudents: parseInt(totalStudentsResult.rows[0].total, 10),
      healthyStudents: parseInt(healthyStudentsResult.rows[0].total, 10),
      recentAccidents: parseInt(recentAccidentsResult.rows[0].total, 10),
      monitoredCases: parseInt(monitoredCasesResult.rows[0].total, 10),
    };

    return res.status(200).json({
      error: false,
      message: "Fetching data succesfully",
      data: data,
    });
  } catch (error) {
    console.error("Error fetching summary stats:", error.message);
    return res.status(500).json({
      error: true,
      message: "Failed to fetch summary statistics: " + error.message,
    });
  }
}
export async function getAccidentStats(req, res) {}

export async function getDiseaseStats(req, res) {}

export async function getHealthStats(req, res) {}

export async function getMedicalPlans(req, res) {}

export async function getHealthStatsByGradeID(req, res) {}
