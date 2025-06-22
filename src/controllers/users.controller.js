import { supabaseAdmin } from "../config/supabase.js";
import { query } from "../config/database.js";
import {
      createNewAdmin, createNewNurse, createNewParent, createNewStudent, getProfileOfAdminByID, getProfileOfNurseByID, getProfileOfParentByID, getProfileOfStudentByID,
      getAllAdmins,
      getAllNurses,
      getAllParents,
      getAllStudents,
      linkParentsAndStudents,
      removeDadByStudentId,
      removeMomByStudentId

} from "../services/index.js";

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

export async function getAdminProfileByID(req, res) {
      const { admin_id } = req.params;

      if (!admin_id) {
            return res
                  .status(400)
                  .json({ error: true, message: "Thiếu admin id!" });
      }

      try {
            const admin = await getProfileOfAdminByID(admin_id);
            if (!admin) {
                  return res
                        .status(404)
                        .json({ error: true, message: "Không tìm thấy admin!" });
            }

            return res
                  .status(200)
                  .json({ error: false, data: admin });
      } catch (err) {
            console.error("Lỗi khi lấy thông tin admin:", err);
            return res
                  .status(500)
                  .json({ error: true, message: "Lỗi server!" });
      }
}

export async function getNurseProfileByID(req, res) {
      const { nurse_id } = req.params;

      if (!nurse_id) {
            return res
                  .status(400)
                  .json({ error: true, message: "Thiếu nurse id!" });
      }

      try {
            const nurse = await getProfileOfNurseByID(nurse_id);
            if (!nurse) {
                  return res
                        .status(404)
                        .json({ error: true, message: "Không tìm thấy nurse!" });
            }

            return res
                  .status(200)
                  .json({ error: false, data: nurse });
      } catch (err) {
            console.error("Lỗi khi lấy thông tin nurse:", err);
            return res
                  .status(500)
                  .json({ error: true, message: "Lỗi server!" });
      }
}

export async function getParentProfileByID(req, res) {
      const { parent_id } = req.params;

      if (!parent_id) {
            return res
                  .status(400)
                  .json({ error: true, message: "Thiếu parent id!" });
      }

      try {
            const parent = await getProfileOfParentByID(parent_id);
            if (!parent) {
                  return res
                        .status(404)
                        .json({ error: true, message: "Không tìm thấy phụ huynh!" });
            }

            return res
                  .status(200)
                  .json({ error: false, data: parent });
      } catch (err) {
            console.error("Lỗi khi lấy thông tin phụ huynh:", err);
            return res
                  .status(500)
                  .json({ error: true, message: "Lỗi server!" });
      }
}

export async function getStudentProfileByID(req, res) {
      const { student_id } = req.params;

      if (!student_id) {
            return res.status(400).json({ error: true, message: "Thiếu ID học sinh" });
      }

      try {
            // Lấy thông tin liên kết
            const student = await getProfileOfStudentByID(student_id);

            if (!student) {
                  return res
                        .status(404)
                        .json({ error: false, message: "Không tìm thấy học sinh với ID này" });
            }

            return res.status(200).json({
                  error: false,
                  message: "Lấy thông tin học sinh thành công",
                  data: student,
            });
      } catch (err) {
            console.error("Lỗi khi lấy thông tin học sinh:", err);
            return res
                  .status(500)
                  .json({ error: true, message: "Lỗi server khi lấy học sinh" });
      }
}

export async function listAdmins(req, res) {
      try {
            const admins = await getAllAdmins();
            res.status(200).json({ error: false, data: admins });
      } catch (err) {
            console.error("Lỗi khi lấy danh sách quản trị viên:", err);
            res.status(500).json({ error: true, message: "Lỗi máy chủ" });
      }
}

export async function listNurses(req, res) {
      try {
            const nurses = await getAllNurses();
            res.status(200).json({ error: false, data: nurses });
      } catch (err) {
            console.error("Lỗi khi lấy danh sách y tá:", err);
            res.status(500).json({ error: true, message: "Lỗi máy chủ" });
      }
}

export async function listParents(req, res) {
      try {
            const parents = await getAllParents();
            res.status(200).json({ error: false, data: parents });
      } catch (err) {
            console.error("Lỗi khi lấy danh sách phụ huynh:", err);
            res.status(500).json({ error: true, message: "Lỗi máy chủ" });
      }
}

export async function listStudents(req, res) {
      try {
            const students = await getAllStudents();
            res.status(200).json({ error: false, data: students });
      } catch (err) {
            console.error("Lỗi khi lấy danh sách học sinh:", err);
            res.status(500).json({ error: true, message: "Lỗi máy chủ" });
      }
}

export async function assignParents(req, res) {
      const { mom_id, dad_id, student_ids } = req.body;

      try {
            const updated = await linkParentsAndStudents(mom_id, dad_id, student_ids);
            res.status(200).json({ error: false, data: updated });
      } catch (err) {
            console.error("Lỗi khi liên kết phụ huynh và học sinh:", err);
            res.status(500).json({ error: true, message: `Lỗi máy chủ: ${err}` });
      }
}


export async function removeMomFromStudent(req, res) {
      const { student_id } = req.params;
      if (!student_id) {
            return res.status(400).json({ error: true, message: "Thiếu student_id" });
      }

      try {
            const result = await removeMomByStudentId(student_id);
            if (result.rowCount === 0) {
                  return res.status(404).json({ error: true, message: "Không tìm thấy học sinh" });
            }

            return res.status(200).json({
                  error: false,
                  message: "Đã xoá mom_id khỏi học sinh",
                  data: result
            });
      } catch (err) {
            console.error("Lỗi khi xoá mom:", err);
            return res.status(500).json({ error: true, message: "Lỗi máy chủ" });
      }
}

export async function removeDadFromStudent(req, res) {
      const { student_id } = req.params;
      if (!student_id) {
            return res.status(400).json({ error: true, message: "Thiếu student_id" });
      }

      try {
            const result = await removeDadByStudentId(student_id);
            if (result.rowCount === 0) {
                  return res.status(404).json({ error: true, message: "Không tìm thấy học sinh" });
            }

            return res.status(200).json({
                  error: false,
                  message: "Đã xoá dad_id khỏi học sinh",
                  data: result
            });
      } catch (err) {
            console.error("Lỗi khi xoá dad:", err);
            return res.status(500).json({ error: true, message: "Lỗi máy chủ" });
      }
}

export async function handleLogIn(req, res) {

}

export async function handleLogOut(req, res) {
      
}

export async function handleUpdatePassword(req, res) {

}


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

export async function getSupabaseProfileByUUID(uid) {
      try {
            const { data, error } = await supabaseAdmin.getUserById(uid);
            if (error || !data?.user) return null;
            return data.user.user_metadata;
      } catch {
            return null;
      }
}



