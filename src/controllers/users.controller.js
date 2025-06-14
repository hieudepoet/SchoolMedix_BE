import { supabaseAdmin } from "../config/supabase.js";
import { query } from "../config/database.js";
import { sendWelcomeEmail } from "../services/email/index.js";


/**
 * profile_img_url will be anonymous by default when create user
 * @param {role, email, name, age, gender, dob, address, phone_number} req 
 * @param {auth.user object} res 
 * @returns 
 */
export async function createNewUserWithRole(req, res) {
      const { role, email, name, age, gender, dob, address, phone_number } = req.body;
      const profile_img_url = "https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg";

      // check if role is in admin, parent, nurse, student
      if (!['admin', 'parent', 'nurse', 'student'].includes(user.role)) {
            return res.status(400).json({ error: true, message: "Role phải là admin, nurse, student hoặc parent. Không thể tạo mới user!" });
      }

      if (!email) {
            return res.status(400).json({ error: true, message: "Thiếu email." });
      }
      if (!name) {
            return res.status(400).json({ error: true, message: "Thiếu email." });
      }
      if (!age) {
            return res.status(400).json({ error: true, message: "Thiếu email." });
      }
      if (!gender) {
            return res.status(400).json({ error: true, message: "Thiếu email." });
      }
      if (!dob) {
            return res.status(400).json({ error: true, message: "Thiếu email." });
      }
      if (!address) {
            return res.status(400).json({ error: true, message: "Thiếu email." });
      }
      if (!phone_number) {
            return res.status(400).json({ error: true, message: "Thiếu email." });
      }

      const password = generateRandomPassword();

      const { data, error } = await supabaseAdmin.createUser({
            email,
            password,
            app_metadata: { role },
            user_metadata: { name },
            email_confirm: true
      });

      if (error) {
            console.error(`❌ Error creating ${role}:`, error.message);
            return res.status(400).json({ error: true, message: `Tạo ${role} thất bại: ${error.message}` });
      }

      console.log("✅ Created parent:", data.user);
      const id = data.user.id;

      try {
            const result = await query(
                  "INSERT INTO parent (id, name, email) VALUES ($1, $2, $3) RETURNING *",
                  [id, name, email]
            );
            res.status(201).json({
                  error: false,
                  message: "Tạo phụ huynh thành công",
                  data: result.rows[0]
            });
      } catch (err) {
            console.error("❌ Database insert error:", err);
            return res.status(500).json({ error: true, message: "Lỗi khi lưu vào cơ sở dữ liệu" });
      }

      try {
            await sendWelcomeEmail(email, name, role, password);
      } catch (err) {
            console.warn("⚠️ Email sending failed:", err.message);
      }
}

/**
 * 
 * @param {parent_id} req 
 * @param {student array} res 
 * @returns 
 */
export async function getChildrenIDsOfAParent(req, res) {
      const { parent_id } = req.params;

      if (!parent_id) {
            return res.status(400).json({ error: true, message: "Thiếu ID bố/mẹ" });
      }

      try {
            // đầu tiên lấy tất cả các con mà có mom_id hoặc dad_id như trên (trong db chỉ lưu mỗi thông tin class_id, mom_id, dad_id thôi, qutrong là user_metadata lưu trên supbase)
            const result = await query(
                  "SELECT * FROM student WHERE mom_id = $1 OR dad_id = $1",
                  [parent_id]
            );

            // tiếp theo lấy user_metadata trên supabase thông qua trường supabase_uid của bảng student

            if (result.rows.length === 0) {
                  return res.status(404).json({ error: true, message: "Không tìm thấy học sinh nào ứng với ID phụ huynh này" });
            }

            // cuối cùng trả về mảng 

            return res.status(200).json({ error: false, message: "Lấy danh sách học sinh thành công", data: result.rows });
      } catch (err) {
            console.error("Lỗi khi lấy thông tin học sinh:", err);
            return res.status(500).json({ error: true, message: "Lỗi server khi lấy học sinh" });
      }
}

/**
 * 
 * @param {student_id} req 
 * @param {*} res 
 * @returns 
 */
export async function getStudentByID(req, res) {
      const { student_id } = req.params;

      if (!student_id) {
            return res.status(400).json({ error: true, message: "Thiếu ID học sinh" });
      }

      try {
            const result = await query(
                  "SELECT * FROM student WHERE id = $1",
                  [student_id]
            );

            if (result.rows.length === 0) {
                  return res.status(404).json({ error: false, message: "Không tìm thấy học sinh với ID này" });
            }

            return res.status(200).json({ error: false, message: "Lấy thông tin học sinh thành công", data: result.rows[0] });
      } catch (err) {
            console.error("Lỗi khi lấy thông tin học sinh:", err);
            return res.status(500).json({ error: true, message: "Lỗi server khi lấy học sinh" });
      }
}


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export async function getParentByID(req, res) {
      const { parent_id } = req.params;

      if (!parent_id) {
            return res.status(400).json({ error: true, message: "Thiếu ID phụ huynh" });
      }

      try {
            const result = await query(
                  "SELECT * FROM parent WHERE id = $1",
                  [parent_id]
            );

            if (result.rows.length === 0) {
                  return res.status(404).json({ error: false, message: "Không tìm thấy phụ huynh với ID này" });
            }

            return res.status(200).json({ error: false, message: "Lấy thông tin phụ huynh thành công", data: result.rows[0] });
      } catch (err) {
            console.error("Lỗi khi lấy thông tin phụ huynh:", err);
            return res.status(500).json({ error: true, message: "Lỗi server khi lấy phụ huynh" });
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
