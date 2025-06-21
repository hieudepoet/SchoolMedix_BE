import { supabaseAdmin } from "../config/supabase.js";
import { query } from "../config/database.js";
import { createNewAdmin, createNewNurse, createNewParent, createNewStudent } from "../services/index.js";

export async function createAdmin(req, res) {
  try {
    const {
      email,
      name,
      dob,
      gender,
      address,
      phone_number,
      profile_img_url,
    } = req.body;

    // Validate bắt buộc
    if (!name) {
      return res.status(400).json({ error: true, message: "Thiếu họ và tên." });
    }
    if (!dob) {
      return res.status(400).json({ error: true, message: "Thiếu ngày sinh." });
    }
    if (!gender || (gender !== "Nam" && gender !== "Nữ")) {
      return res.status(400).json({
        error: true,
        message: "Giới tính phải là 'Nam' hoặc 'Nữ'.",
      });
    }
    if (!address) {
      return res.status(400).json({ error: true, message: "Thiếu địa chỉ." });
    }

    const newAdmin = await createNewAdmin(
      email,
      name,
      dob,
      gender,
      address,
      phone_number,
      profile_img_url || process.env.DEFAULT_AVATAR_URL
    );

    return res.status(201).json({
      error: false,
      message: "Tạo tài khoản admin thành công",
      data: newAdmin,
    });
  } catch (err) {
    console.error("❌ Lỗi khi tạo admin:", err.message);
    return res.status(500).json({
      error: true,
      message: err.message
    });
  }
}

export async function createNurse(req, res) {
  try {
    const {
      email,
      name,
      dob,
      gender,
      address,
      phone_number,
      profile_img_url,
    } = req.body;

    // Validate bắt buộc
    if (!name) {
      return res.status(400).json({ error: true, message: "Thiếu họ và tên." });
    }
    if (!dob) {
      return res.status(400).json({ error: true, message: "Thiếu ngày sinh." });
    }
    if (!gender || (gender !== "Nam" && gender !== "Nữ")) {
      return res.status(400).json({
        error: true,
        message: "Giới tính phải là 'Nam' hoặc 'Nữ'.",
      });
    }
    if (!address) {
      return res.status(400).json({ error: true, message: "Thiếu địa chỉ." });
    }

    const newNurse = await createNewNurse(
      email,
      name,
      dob,
      gender,
      address,
      phone_number,
      profile_img_url
    );

    return res.status(201).json({
      error: false,
      message: "Tạo tài khoản nurse thành công",
      data: newNurse,
    });
  } catch (err) {
    console.error("❌ Lỗi khi tạo nurse:", err.message);
    return res.status(500).json({
      error: true,
      message: err.message
    });
  }
}

export async function createParent(req, res) {
  try {
    const {
      email,
      name,
      dob,
      gender,
      address,
      phone_number,
      profile_img_url,
    } = req.body;

    // Validate bắt buộc
    if (!name) {
      return res.status(400).json({ error: true, message: "Thiếu họ và tên." });
    }
    if (!dob) {
      return res.status(400).json({ error: true, message: "Thiếu ngày sinh." });
    }
    if (!gender || (gender !== "Nam" && gender !== "Nữ")) {
      return res.status(400).json({
        error: true,
        message: "Giới tính phải là 'Nam' hoặc 'Nữ'.",
      });
    }
    if (!address) {
      return res.status(400).json({ error: true, message: "Thiếu địa chỉ." });
    }

    const newNurse = await createNewParent(
      email,
      name,
      dob,
      gender,
      address,
      phone_number,
      profile_img_url
    );

    return res.status(201).json({
      error: false,
      message: "Tạo tài khoản parent thành công",
      data: newNurse,
    });
  } catch (err) {
    console.error("❌ Lỗi khi tạo parent:", err.message);
    return res.status(500).json({
      error: true,
      message: err.message
    });
  }
}

export async function createStudent(req, res) {
  try {
    const {
      email,
      name,
      dob,
      gender,
      address,
      phone_number,
      profile_img_url,
      class_id,
      year_of_enrollment,
      mom_id,
      dad_id
    } = req.body;

    // Validate bắt buộc
    if (!name) {
      return res.status(400).json({ error: true, message: "Thiếu họ và tên." });
    }
    if (!dob) {
      return res.status(400).json({ error: true, message: "Thiếu ngày sinh." });
    }
    if (!gender || (gender !== "Nam" && gender !== "Nữ")) {
      return res.status(400).json({
        error: true,
        message: "Giới tính phải là 'Nam' hoặc 'Nữ'.",
      });
    }
    if (!address) {
      return res.status(400).json({ error: true, message: "Thiếu địa chỉ." });
    }
    if (!year_of_enrollment) {
      return res.status(400).json({ error: true, message: "Thiếu năm bắt đầu niên khóa." });
    }
    if (!class_id) {
      return res.status(400).json({ error: true, message: "Thiếu id lớp." });
    }


    const newStudent = await createNewStudent(
      email,
      name,
      dob,
      gender,
      address,
      phone_number,
      profile_img_url,
      class_id,
      year_of_enrollment,
      mom_id,
      dad_id
    );

    return res.status(201).json({
      error: false,
      message: "Tạo tài khoản student thành công",
      data: newStudent,
    });
  } catch (err) {
    console.error("❌ Lỗi khi tạo student:", err.message);
    return res.status(500).json({
      error: true,
      message: err.message
    });
  }
}



export async function getChildrenProfilesOfAParent(req, res) {
  const { parent_id } = req.params;

  if (!parent_id) {
    return res.status(400).json({ error: true, message: "Thiếu ID bố/mẹ" });
  }

  try {
    // Lấy học sinh kèm thông tin lớp và khối
    const result = await query(
      `SELECT 
          a.*, 
          b.name as class_name, 
          b.grade_id, 
          c.name as grade_name 
        FROM student a
        JOIN class b ON a.class_id = b.id
        JOIN grade c ON b.grade_id = c.id
        WHERE a.mom_id = $1 OR a.dad_id = $1`,
      [parent_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: true,
        message: "Không tìm thấy học sinh nào ứng với ID phụ huynh này",
      });
    }

    // Gắn profile từ Supabase
    const studentsWithProfiles = await Promise.all(
      result.rows.map(async (student) => {
        const profile = await getSupabaseProfileByUUID(student.supabase_uid);
        return {
          ...student,
          profile,
        };
      })
    );

    return res.status(200).json({
      error: false,
      message: "Lấy danh sách học sinh thành công",
      data: studentsWithProfiles,
    });
  } catch (err) {
    console.error("Lỗi khi lấy thông tin học sinh:", err);
    return res
      .status(500)
      .json({ error: true, message: "Lỗi server khi lấy học sinh" });
  }
}

/**
 *
 * return all relates to this student
 *
 * @param {student_id} req
 * @param {*} res
 * @returns
 */
export async function getStudentProfileByID(req, res) {
  const { student_id } = req.params;

  if (!student_id) {
    return res.status(400).json({ error: true, message: "Thiếu ID học sinh" });
  }

  try {
    // Lấy thông tin liên kết
    const result = await query(
      `SELECT a.id, a.supabase_uid as supabase_student_id, class_id, b.name as class_name, grade_id, c.name as grade_name, mom_id, d.supabase_uid as supabase_mom_uid, dad_id, e.supabase_uid as supabase_dad_uid
                  FROM student a
                  JOIN class b ON a.class_id = b.id
                  JOIN grade c ON b.grade_id = c.id
                  LEFT JOIN parent d ON a.mom_id = d.id
                  LEFT JOIN parent e ON a.dad_id = e.id
                  WHERE a.id = $1`,
      [student_id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: false, message: "Không tìm thấy học sinh với ID này" });
    }

    const studentData = result.rows[0];

    // Lấy thông tin hồ sơ từ Supabase Auth
    const [studentProfile, momProfile, dadProfile] = await Promise.all([
      getSupabaseProfileByUUID(studentData.supabase_student_id),
      getSupabaseProfileByUUID(studentData.supabase_mom_uid),
      getSupabaseProfileByUUID(studentData.supabase_dad_uid),
    ]);

    const fullData = {
      ...studentData,
      student_profile: studentProfile,
      mom_profile: momProfile,
      dad_profile: dadProfile,
    };

    return res.status(200).json({
      error: false,
      message: "Lấy thông tin học sinh thành công",
      data: fullData,
    });
  } catch (err) {
    console.error("Lỗi khi lấy thông tin học sinh:", err);
    return res
      .status(500)
      .json({ error: true, message: "Lỗi server khi lấy học sinh" });
  }
}

/**
 *
 * return all relates to this student
 * but entry needs to have a supabase_student_uid and check if app_metadata have role is student, if not, return error
 *
 * @param {supabase_student_uid} req
 * @param {*} res
 * @returns
 */
export async function getStudentProfileByUUID(req, res) {
  const { supabase_student_uid } = req.params;

  if (!supabase_student_uid) {
    return res
      .status(400)
      .json({ error: true, message: "Thiếu supabase UUID học sinh" });
  }

  try {
    // Lấy thông tin liên kết
    const result = await query(
      `SELECT a.id, a.supabase_uid as supabase_student_id, class_id, b.name as class_name, grade_id, c.name as grade_name, mom_id, d.supabase_uid as supabase_mom_uid, dad_id, e.supabase_uid as supabase_dad_uid
                  FROM student a
                  JOIN class b ON a.class_id = b.id
                  JOIN grade c ON b.grade_id = c.id
                  LEFT JOIN parent d ON a.mom_id = d.id
                  LEFT JOIN parent e ON a.dad_id = e.id
                  WHERE a.supabase_uid = $1`,
      [supabase_student_uid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: false,
        message: "Không tìm thấy học sinh với UUID này",
      });
    }

    const studentData = result.rows[0];

    // Lấy thông tin hồ sơ từ Supabase Auth
    const [studentProfile, momProfile, dadProfile] = await Promise.all([
      getSupabaseProfileByUUID(studentData.supabase_student_id),
      getSupabaseProfileByUUID(studentData.supabase_mom_uid),
      getSupabaseProfileByUUID(studentData.supabase_dad_uid),
    ]);

    const fullData = {
      ...studentData,
      student_profile: studentProfile,
      mom_profile: momProfile,
      dad_profile: dadProfile,
    };

    return res.status(200).json({
      error: false,
      message: "Lấy thông tin học sinh thành công",
      data: fullData,
    });
  } catch (err) {
    console.error("Lỗi khi lấy thông tin học sinh:", err);
    return res
      .status(500)
      .json({ error: true, message: "Lỗi server khi lấy học sinh" });
  }
}

/**
 * Không tìm thấy thì trả về null
 *
 * @param {*} uid
 * @returns
 */
export async function getSupabaseProfileByUUID(uid) {
  try {
    const { data, error } = await supabaseAdmin.getUserById(uid);
    if (error || !data?.user) return null;
    return data.user.user_metadata;
  } catch {
    return null;
  }
}
