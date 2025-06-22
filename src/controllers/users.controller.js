import { supabaseAdmin } from "../config/supabase.js";
import multer from "multer";

import {
      createNewAdmin, createNewNurse, createNewParent, createNewStudent, getProfileOfAdminByID, getProfileOfNurseByID, getProfileOfParentByID, getProfileOfStudentByID,
      getAllAdmins,
      getAllNurses,
      getAllParents,
      getAllStudents,
      getAllStudentsByClassID,
      getAllStudentsByGradeID,
      linkParentsAndStudents,
      removeDadByStudentId,
      removeMomByStudentId,
      signInWithPassAndEmail,
      confirmEmailFor,
      unconfirmEmailFor,
      editUserProfileByAdmin,
      uploadFileToSupabaseStorage,
      getProfileByUUID

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

export async function getUserProfileByUUID(req, res) {
      const { supabase_uid, role } = req.params;

      if (!supabase_uid) {
            return res.status(400).json({ error: true, message: "Thiếu supabase_uid!" });
      }

      try {
            const profile = await getProfileByUUID(role, supabase_uid);

            if (!profile) {
                  return res.status(404).json({ error: true, message: "Không tìm thấy hồ sơ." });
            }

            return res.status(200).json({ error: false, data: profile });
      } catch (err) {
            console.error("Lỗi khi lấy thông tin user:", err);
            return res.status(500).json({ error: true, message: "Lỗi server!" });
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


export async function listStudentsByClass(req, res) {
      const { class_id } = req.params;

      if (!class_id) {
            return res.status(400).json({ error: true, message: "Thiếu id lớp." });
      }

      try {
            const students = await getAllStudentsByClassID(class_id);
            res.status(200).json({ error: false, data: students });
      } catch (err) {
            console.error("Lỗi khi lấy danh sách học sinh theo lớp:", err);
            res.status(500).json({ error: true, message: "Lỗi máy chủ" });
      }
}

export async function listStudentsByGrade(req, res) {
      const { grade_id } = req.params;

      if (!grade_id) {
            return res.status(400).json({ error: true, message: "Thiếu id khối." });
      }

      try {
            const students = await getAllStudentsByGradeID(grade_id);
            res.status(200).json({ error: false, data: students });
      } catch (err) {
            console.error("Lỗi khi lấy danh sách học sinh theo khối:", err);
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

export async function editUserInfoByAdmin(req, res) {
      const { id, role, updates } = req.body;

      if (!id) {
            return res.status(400).json({
                  error: true,
                  message: "Thiếu ID người dùng."
            });
      }

      if (!role) {
            return res.status(400).json({
                  error: true,
                  message: "Thiếu vai trò người dùng (admin, nurse, parent, student)."
            });
      }

      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
            return res.status(400).json({
                  error: true,
                  message: "Trường 'updates' phải là một object chứa thông tin cần cập nhật."
            });
      }

      if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                  error: true,
                  message: "Không có trường nào để cập nhật."
            });
      }

      // khoong cho cập nhật supabase_uid, tự động sinh khi tạo mới tài khoản với email
      if (updates?.supabase_uid) {
            return res.status(400).json({
                  error: true,
                  message: "Không thể cập nhật trực tiếp supabase_uid (tự động sinh khi tạo mới tài khoản)."
            });
      }

      try {
            // nếu profile chưa đăng ký tài khoản mà cập nhật mới email thì sẽ tạo mới tài khoản (gửi qua mail acc + pass) rồi gắn supabase_uid vào user_profile
            // nếu profile đăng ký tài khoản rồi mà cập nhật email mới thì gửi lại
            const result = await editUserProfileByAdmin(id, role, updates);

            if (!result) {
                  return res.status(404).json({ error: true, message: "Không tìm thấy người dùng." });
            }

            return res.status(200).json({
                  error: false,
                  message: "Cập nhật thành công.",
                  data: result
            });

      } catch (err) {
            console.error("Lỗi khi cập nhật thông tin người dùng:", err);
            return res.status(500).json({ error: true, message: `Lỗi máy chủ: ${err}}` });
      }
}

export async function handleUploadProfileImg(req, res) {
      const upload = multer({ storage: multer.memoryStorage() }).single('image');

      upload(req, res, async function (err) {
            if (err) {
                  return res.status(500).json({ error: true, message: 'Lỗi khi xử lý file.' });
            }

            const file = req.file;

            if (!file) {
                  return res.status(400).json({ error: true, message: 'Không có file ảnh nào được upload.' });
            }

            try {
                  const fileName = `${Date.now()}-${file.originalname}`;

                  const publicUrl = await uploadFileToSupabaseStorage(file, "avatars", fileName);

                  return res.status(200).json({
                        error: false,
                        message: "Upload ảnh thành công",
                        profile_img_url: publicUrl,
                  });

            } catch (err) {
                  console.log(err);
                  return res.status(500).json({
                        error: true,
                        message: `Lỗi hệ thống: ${err.message || err}`,
                  });
            }
      });
}


export async function handleLogIn(req, res) {
      const { email, password } = req.body;

      if (!email || !password) {
            return res.status(400).json({
                  error: true,
                  message: "Vui lòng nhập email và mật khẩu.",
            });
      }

      try {
            const result = await signInWithPassAndEmail(email, password);

            const { role, supabase_uid, profile } = result.user;
            const id = profile?.id;

            if (!id || !role || !supabase_uid) {
                  return res.status(400).json({
                        error: true,
                        message: "Không thể xác định thông tin người dùng.",
                  });
            }

            // Đánh dấu đã xác thực email ở bảng ứng với role
            await confirmEmailFor(role, supabase_uid, id);

            return res.status(200).json({
                  error: false,
                  message: "Đăng nhập thành công",
                  data: result,
            });
      } catch (err) {
            console.error("Login failed:", err);
            return res.status(500).json({
                  error: true,
                  message: err.message || "Đăng nhập thất bại.",
            });
      }
}


export async function handleLogOut(req, res) {

}

export async function handleUpdatePassword(req, res) {

}





