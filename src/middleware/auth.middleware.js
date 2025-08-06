import { supabaseAdmin, admin } from "../config/supabase.js";
import { getProfileByUUID } from "../services/users/userDao.js";

export function verifyAndAuthorize(allowedRoles = []) {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization?.replace("Bearer ", "") || req.query.token;

            if (!token) {
                return res.status(401).json({ error: "Missing access token" });
            }

            const { data, error } = await admin.auth.getUser(token);

            if (error || !data?.user) {
                console.error("Auth Error:", error);
                return res.status(401).json({ error: "Invalid or expired token" });
            }

            const user = data.user;
            const role = user.app_metadata?.role;

            if (!role || (allowedRoles.length > 0 && !allowedRoles.includes(role))) {
                return res
                    .status(403)
                    .json({ error: "Access denied. Unauthorized role." });
            }

            req.user = user;
            next();
        } catch (err) {
            console.error("verifyAndAuthorize error:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
    };
}

export function isParentOfStudentOrStudent() {
    return async (req, res, next) => {
        try {
            const user = req.user;
            const role = user.app_metadata?.role;
            const supabase_uid = user?.id;

            if (role === "admin" || role === "nurse") {
                return next();
            }

            const retrieved_user = await getProfileByUUID(role, supabase_uid);

            const { student_id, id } = req.params;

            if (role === "parent") {
                const students = retrieved_user.students;
                const found = students.some(student => student.id === student_id || student.id === id);
                if (!found) {
                    return res.status(403).json({ error: "Student is not your child" });
                }

            } else if (role === "student") {
                if (retrieved_user.id !== student_id && retrieved_user.id !== id) {
                    return res.status(403).json({ error: "You can only access your own data" });
                }
            }

            next();
        } catch (err) {
            console.error("isParentOfStudentOrStudent error:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
    };
}