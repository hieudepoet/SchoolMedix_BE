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
      previousAccidentsResult,
      newCasesResult,
      processingDrugResult,
      pendingDrugResult,
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
      query(`
        SELECT COUNT(*) AS total 
        FROM daily_health_record
        WHERE detect_time >= date_trunc('week', CURRENT_DATE - INTERVAL '7 days')
        AND detect_time < date_trunc('week', CURRENT_DATE)
      `),
      query(`
        SELECT COUNT(*) AS total
        FROM disease_record
        WHERE created_at >= date_trunc('week', CURRENT_DATE)
        AND created_at < date_trunc('week', CURRENT_DATE) + INTERVAL '7 days'
        AND status = 'UNDER_TREATMENT'
      `),
      query(`
        SELECT COUNT(*) AS total
        FROM SendDrugRequest 
        WHERE status = 'RECEIVED'    
      `),
      query(`
        SELECT COUNT(*) AS total
        FROM SendDrugRequest 
        WHERE status = 'PROCESSING'    
      `),
    ]);

    // Extract the total count from each query result
    const data = {
      totalStudents: parseInt(totalStudentsResult.rows[0]?.total || 0, 10),
      healthyStudents: parseInt(healthyStudentsResult.rows[0]?.total || 0, 10),
      recentAccidents: parseInt(recentAccidentsResult.rows[0]?.total || 0, 10),
      monitoredCases: parseInt(monitoredCasesResult.rows[0]?.total || 0, 10),
      previousAccidents: parseInt(
        previousAccidentsResult.rows[0]?.total || 0,
        10
      ),
      newCases: parseInt(newCasesResult.rows[0]?.total || 0, 10),
      proccessingDrug: parseInt(processingDrugResult.rows[0]?.total, 10) || 0,
      pendingDrug: parseInt(pendingDrugResult.rows[0]?.total || 0, 10),
      percent:
        parseInt(totalStudentsResult.rows[0]?.total || 0, 10) > 0
          ? Number(
              (
                (parseInt(healthyStudentsResult.rows[0]?.total || 0, 10) /
                  parseInt(totalStudentsResult.rows[0]?.total || 0, 10)) *
                100
              ).toFixed(2)
            )
          : 0,
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

export async function getAccidentStats(req, res) {
  try {
    // Set date range to last 30 days
    const end = new Date();
    end.setHours(0, 0, 0, 0); // Start of the day to exclude time
    const start = new Date();
    start.setDate(end.getDate() - 30);
    start.setHours(0, 0, 0, 0); // Start of the day to exclude time

    // Query to get accident counts grouped by date and status
    const queryText = `
      SELECT 
        TO_CHAR(DATE(detect_time), 'YYYY-MM-DD') AS date,
        status,
        COUNT(*) AS total
      FROM daily_health_record
      WHERE detect_time >= $1 AND detect_time <= $2
      GROUP BY DATE(detect_time), status
      ORDER BY DATE(detect_time), status
    `;
    const queryParams = [start, end];
    const result = await query(queryText, queryParams);

    // Process data for chart
    const dates = [...new Set(result.rows.map((row) => row.date))].sort();
    const chartData = dates.map((date) => {
      const mildRow = result.rows.find(
        (row) => row.date === date && row.status === "MILD"
      );
      const seriousRow = result.rows.find(
        (row) => row.date === date && row.status === "SERIOUS"
      );

      return {
        date: date,
        minor: parseInt(mildRow?.total || 0, 10),
        serious: parseInt(seriousRow?.total || 0, 10),
      };
    });

    const maxCases = Math.max(
      ...chartData.map((item) => item.minor + item.serious),
      0
    );

    return res.status(200).json({
      error: false,
      message: "Fetching successfully",
      data: chartData,
      maxAccidentCases: maxCases,
    });
  } catch (error) {
    console.error("Error fetching accident chart data:", error);
    return res.status(500).json({
      error: true,
      message: "Failed to fetch accident chart data: " + error.message,
      data: null,
    });
  }
}

export async function getDiseaseStats(req, res) {
  try {
    // Get optional diseaseId from query parameters
    const { diseaseId } = req.query;

    // Get current year and ensure at least 5 years are covered
    const currentYear = new Date().getFullYear();
    const minYear = currentYear - 4; // At least 5 years (current year + 4 previous)

    // Query to get disease counts grouped by year
    let queryText = `
      SELECT 
        EXTRACT(YEAR FROM detect_date)::TEXT AS date,
        COUNT(*) AS total
      FROM disease_record
      WHERE status = 'UNDER_TREATMENT'
    `;
    const queryParams = [];

    if (diseaseId) {
      queryText += ` AND disease_id = $1`;
      queryParams.push(parseInt(diseaseId, 10));
    }

    queryText += ` GROUP BY EXTRACT(YEAR FROM detect_date) ORDER BY EXTRACT(YEAR FROM detect_date)`;

    const result = await query(queryText, queryParams);

    // Query to get available diseases with records
    const diseasesQuery = `
      SELECT DISTINCT d.id, d.name
      FROM disease d
      INNER JOIN disease_record dr ON d.id = dr.disease_id
      ORDER BY d.name
    `;
    const diseasesResult = await query(diseasesQuery, []);

    // Generate all years from minYear to currentYear
    const allYears = Array.from({ length: currentYear - minYear + 1 }, (_, i) =>
      (minYear + i).toString()
    );

    // Process data for chart
    const chartData = allYears.map((year) => ({
      date: year,
      cases: parseInt(
        result.rows.find((row) => row.date === year)?.total || 0,
        10
      ),
    }));

    // Calculate maxCases
    const maxCases = Math.max(...chartData.map((item) => item.cases), 0);

    return res.status(200).json({
      data: chartData,
      maxCases,
      availableDiseases: diseasesResult.rows.map((row) => ({
        id: row.id,
        name: row.name,
      })),
    });
  } catch (error) {
    console.error("Error fetching disease stats:", error);
    return res.status(500).json({
      error: true,
      message: "Failed to fetch disease stats: " + error.message,
      data: null,
    });
  }
}

export async function getHealthStats(req, res) {}

export async function getMedicalPlans(req, res) {
  try {
    // Truy vấn gộp từ CheckupCampaign và vaccination_campaign
    const queryText = `
      SELECT 
        ROW_NUMBER() OVER (ORDER BY date DESC) AS serial_id,
        combined.*
      FROM (
        SELECT 
          id AS checkup_id,
		  NULL AS vaccination_id,
          name AS name,
          start_date AS date,
          CAST(status as varchar) as status
        FROM CheckupCampaign
        UNION ALL
        SELECT 
		  NULL AS checkup_id,
          id AS vaccination_id,
          title AS name,
          start_date AS date,
          status
        FROM vaccination_campaign
      ) AS combined
      ORDER BY date DESC
    `;
    const result = await query(queryText, []);

    // Định dạng dữ liệu trả về
    const plans = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      date: row.date ? row.date.toISOString().split("T")[0] : "N/A",
      status: row.status,
      vaccaination_id: row.vaccination_id || null,
      checkup_id: row.checkup_id || null,
    }));

    return res.status(200).json({
      data: plans,
      error: false,
      message: "Fetching data successfully",
    });
  } catch (error) {
    console.error("Error fetching upcoming plans:", error);
    return res.status(500).json({
      error: true,
      message: "Không thể tải dữ liệu kế hoạch y tế: " + error.message,
      data: null,
    });
  }
}

export async function getHealthStatsByGradeID(req, res) {
  try {
    const { grade_id } = req.params;

    // Tìm đợt khám gần nhất với status = 'COMPLETED'
    const latestCampaignQuery = `
      SELECT id, name, TO_CHAR(DATE(end_date), 'YYYY-MM-DD') AS date
      FROM CheckupCampaign
      WHERE status = 'DONE'
      ORDER BY start_date DESC
      LIMIT 1
    `;
    const latestCampaignResult = await query(latestCampaignQuery, []);

    if (!latestCampaignResult.rows.length) {
      return res.status(200).json({
        data: {
          error: false,
          message: "No campaigns found",
          data: {
            checkupName: "N/A",
            latestCheckupDate: "N/A",
            totalChecked: 0,
            totalStudents: 0,
            maleCount: 0,
            femaleCount: 0,
            maleHeightAvg: null,
            maleWeightAvg: null,
            femaleHeightAvg: null,
            femaleWeightAvg: null,
          },
        },
      });
    }

    const {
      id: campaignId,
      name: checkupName,
      date: latestCheckupDate,
    } = latestCampaignResult.rows[0];

    // Truy vấn dữ liệu từ lần khám gần nhất
    let queryText = `
        SELECT 
            COUNT(DISTINCT CASE WHEN hr.is_checked = TRUE THEN cr.id END) AS total_checked,
            (
                SELECT COUNT(*) 
                FROM Student s1
                JOIN Class c1 ON c1.id = s1.class_id 
                JOIN Grade g1 ON g1.id = c1.grade_id 
                WHERE ${grade_id ? "g1.id = $2" : "1=1"}
            ) AS total_students,
            COUNT(DISTINCT CASE WHEN s.isMale = TRUE AND hr.is_checked = TRUE THEN cr.id END) AS male_count,

            -- Số nữ đã khám
            COUNT(DISTINCT CASE WHEN s.isMale = FALSE AND hr.is_checked = TRUE THEN cr.id END) AS female_count,

            -- Trung bình chiều cao/ cân nặng của nam
            AVG(CASE WHEN s.isMale = TRUE AND hr.is_checked = TRUE THEN CAST(NULLIF(hr.height, '') AS FLOAT) END) AS male_height_avg,
            AVG(CASE WHEN s.isMale = TRUE AND hr.is_checked = TRUE THEN CAST(NULLIF(hr.weight, '') AS FLOAT) END) AS male_weight_avg,

            -- Trung bình chiều cao/ cân nặng của nữ
            AVG(CASE WHEN s.isMale = FALSE AND hr.is_checked = TRUE THEN CAST(NULLIF(hr.height, '') AS FLOAT) END) AS female_height_avg,
            AVG(CASE WHEN s.isMale = FALSE AND hr.is_checked = TRUE THEN CAST(NULLIF(hr.weight, '') AS FLOAT) END) AS female_weight_avg
        FROM CheckupCampaign cc
        LEFT JOIN CheckupRegister cr ON cr.campaign_id = cc.id 
        LEFT JOIN HealthRecord hr ON hr.register_id = cr.id AND hr.status = 'DONE'
        LEFT JOIN Student s ON cr.student_id = s.id
        LEFT JOIN Class c ON s.class_id = c.id
        LEFT JOIN Grade g ON c.grade_id = g.id
        WHERE cc.id = $1
    `;
    const queryParams = [campaignId];
    if (grade_id) {
      queryText += ` AND ${grade_id ? "g.id = $2" : "1=1"}`;
      queryParams.push(grade_id);
    }

    const result = await query(queryText, queryParams);

    // Query danh sách khối lớp
    const gradesQuery = `
        SELECT * FROM Grade
        ORDER BY id
    `;
    const gradesResult = await query(gradesQuery, []);

    // Định dạng dữ liệu trả về
    const data = result.rows[0]
      ? {
          checkupName: checkupName || "N/A",
          latestCheckupDate: latestCheckupDate || "N/A",
          totalChecked: parseInt(result.rows[0].total_checked, 10) || 0,
          totalStudents: parseInt(result.rows[0].total_students, 10) || 0,
          maleCount: parseInt(result.rows[0].male_count, 10) || 0,
          femaleCount: parseInt(result.rows[0].female_count, 10) || 0,
          maleHeightAvg: result.rows[0].male_height_avg
            ? parseFloat(result.rows[0].male_height_avg.toFixed(1))
            : null,
          maleWeightAvg: result.rows[0].male_weight_avg
            ? parseFloat(result.rows[0].male_weight_avg.toFixed(1))
            : null,
          femaleHeightAvg: result.rows[0].female_height_avg
            ? parseFloat(result.rows[0].female_height_avg.toFixed(1))
            : null,
          femaleWeightAvg: result.rows[0].female_weight_avg
            ? parseFloat(result.rows[0].female_weight_avg.toFixed(1))
            : null,
          grades: gradesResult.rows.map((row) => ({
            id: row.id,
            name: row.name,
          })),
        }
      : {};

    return res
      .status(200)
      .json({
        data: data,
        error: false,
        message: "Fetching data successfully",
      });
  } catch (error) {
    console.error("Error fetching height-weight stats:", error);
    return res.status(500).json({
      error: true,
      message: "Không thể tải dữ liệu chiều cao cân nặng: " + error.message,
      data: null,
    });
  }
}
