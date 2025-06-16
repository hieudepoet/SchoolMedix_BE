import { supabaseAdmin } from "../config/supabase.js";
import { query } from "../config/database.js";
import { sendWelcomeEmail } from "../services/email/index.js";


/**
 * profile_img_url will be anonymous by default when create user
 * @param { email, name, age, gender, dob, address, phone_number } req 
 * @param { auth.user object } res 
 * @returns 
 */
export async function createNurse(req, res) {
      const { email, name, age, gender, dob, address, phone_number } = req.body;
      const profile_img_url = process.env.DEFAULT_AVATAR_URL;
      const role = 'nurse';

      if (!email) return res.status(400).json({ error: true, message: "Thiếu email." });
      if (!name) return res.status(400).json({ error: true, message: "Thiếu họ và tên." });
      if (!age) return res.status(400).json({ error: true, message: "Thiếu tuổi." });
      if (!gender || (gender !== "Nam" && gender !== "Nữ"))
            return res.status(400).json({ error: true, message: "Giới tính phải là 'Nam' hoặc 'Nữ'." });
      if (!dob) return res.status(400).json({ error: true, message: "Thiếu ngày sinh." });
      if (!address) return res.status(400).json({ error: true, message: "Thiếu địa chỉ." });
      if (!phone_number) return res.status(400).json({ error: true, message: "Thiếu số điện thoại." });

      const password = generateRandomPassword();

      const { data, error } = await supabaseAdmin.createUser({
            email,
            password,
            app_metadata: { role },
            user_metadata: { name, age, gender, dob, address, phone_number, profile_img_url },
            email_confirm: true
      });

      if (error) {
            console.error(`❌ Error creating ${role}:`, error.message);
            return res.status(400).json({ error: true, message: `Tạo ${role} thất bại: ${error.message}` });
      }

      console.log("✅ Created nurse:", data.user);

      try {
            await sendWelcomeEmail(email, name, role, password);
      } catch (err) {
            console.warn("⚠️ Email sending failed:", err.message);
      }

      return res.status(201).json({
            error: false,
            message: "Tạo tài khoản y tá thành công",
            data: data.user
      });
}

/**
 * profile_img_url will be anonymous by default when create user
 * @param { email, name, age, gender, dob, address, phone_number } req 
 * @param { auth.user object } res 
 * @returns 
 */
export async function createAdmin(req, res) {
      const { email, name, age, gender, dob, address, phone_number } = req.body;
      const profile_img_url = process.env.DEFAULT_AVATAR_URL;
      const role = 'admin';

      if (!email) return res.status(400).json({ error: true, message: "Thiếu email." });
      if (!name) return res.status(400).json({ error: true, message: "Thiếu họ và tên." });
      if (!age) return res.status(400).json({ error: true, message: "Thiếu tuổi." });
      if (!gender || (gender !== "Nam" && gender !== "Nữ"))
            return res.status(400).json({ error: true, message: "Giới tính phải là 'Nam' hoặc 'Nữ'." });
      if (!dob) return res.status(400).json({ error: true, message: "Thiếu ngày sinh." });
      if (!address) return res.status(400).json({ error: true, message: "Thiếu địa chỉ." });
      if (!phone_number) return res.status(400).json({ error: true, message: "Thiếu số điện thoại." });

      const password = generateRandomPassword();

      const { data, error } = await supabaseAdmin.createUser({
            email,
            password,
            app_metadata: { role },
            user_metadata: { name, age, gender, dob, address, phone_number, profile_img_url },
            email_confirm: true
      });

      if (error) {
            console.error(`❌ Error creating ${role}:`, error.message);
            return res.status(400).json({ error: true, message: `Tạo ${role} thất bại: ${error.message}` });
      }

      console.log("✅ Created admin:", data.user);

      try {
            await sendWelcomeEmail(email, name, role, password);
      } catch (err) {
            console.warn("⚠️ Email sending failed:", err.message);
            res.return(400).json({ error: true, message: `Tạo ${role} thành công nhưng gửi mail thất bại` });
      }

      return res.status(201).json({
            error: false,
            message: "Tạo tài khoản admin thành công",
            data: data.user
      });
}




/**
 * Lấy danh sách học sinh là con của một phụ huynh, kèm theo thông tin lớp, khối và profile Supabase
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
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
                  return res.status(404).json({ error: true, message: "Không tìm thấy học sinh nào ứng với ID phụ huynh này" });
            }

            // Gắn profile từ Supabase
            const studentsWithProfiles = await Promise.all(
                  result.rows.map(async (student) => {
                        const profile = await getSupabaseProfileByUUID(student.supabase_uid);
                        return {
                              ...student,
                              profile
                        };
                  })
            );

            return res.status(200).json({
                  error: false,
                  message: "Lấy danh sách học sinh thành công",
                  data: studentsWithProfiles
            });
      } catch (err) {
            console.error("Lỗi khi lấy thông tin học sinh:", err);
            return res.status(500).json({ error: true, message: "Lỗi server khi lấy học sinh" });
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
                  return res.status(404).json({ error: false, message: "Không tìm thấy học sinh với ID này" });
            }

            const studentData = result.rows[0];

            // Lấy thông tin hồ sơ từ Supabase Auth
            const [studentProfile, momProfile, dadProfile] = await Promise.all([
                  getSupabaseProfileByUUID(studentData.supabase_student_id),
                  getSupabaseProfileByUUID(studentData.supabase_mom_uid),
                  getSupabaseProfileByUUID(studentData.supabase_dad_uid)
            ]);

            const fullData = {
                  ...studentData,
                  student_profile: studentProfile,
                  mom_profile: momProfile,
                  dad_profile: dadProfile
            };

            return res.status(200).json({ error: false, message: "Lấy thông tin học sinh thành công", data: fullData });

      } catch (err) {
            console.error("Lỗi khi lấy thông tin học sinh:", err);
            return res.status(500).json({ error: true, message: "Lỗi server khi lấy học sinh" });
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
            return res.status(400).json({ error: true, message: "Thiếu supabase UUID học sinh" });
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
                  return res.status(404).json({ error: false, message: "Không tìm thấy học sinh với UUID này" });
            }

            const studentData = result.rows[0];

            // Lấy thông tin hồ sơ từ Supabase Auth
            const [studentProfile, momProfile, dadProfile] = await Promise.all([
                  getSupabaseProfileByUUID(studentData.supabase_student_id),
                  getSupabaseProfileByUUID(studentData.supabase_mom_uid),
                  getSupabaseProfileByUUID(studentData.supabase_dad_uid)
            ]);

            const fullData = {
                  ...studentData,
                  student_profile: studentProfile,
                  mom_profile: momProfile,
                  dad_profile: dadProfile
            };

            return res.status(200).json({ error: false, message: "Lấy thông tin học sinh thành công", data: fullData });

      } catch (err) {
            console.error("Lỗi khi lấy thông tin học sinh:", err);
            return res.status(500).json({ error: true, message: "Lỗi server khi lấy học sinh" });
      }
}


function generateRandomPassword() {
      const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const lowercase = 'abcdefghijklmnopqrstuvwxyz';
      const numbers = '0123456789';
      const special = '!#$%';

      const allChars = uppercase + lowercase + numbers + special;
      const getRandom = (chars) => chars[Math.floor(Math.random() * chars.length)];

      let password = [
            getRandom(uppercase),
            getRandom(lowercase),
            getRandom(numbers),
            getRandom(special),
      ];

      for (let i = 0; i < 4; i++) {
            password.push(getRandom(allChars));
      }

      return password.sort(() => Math.random() - 0.5).join('');
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