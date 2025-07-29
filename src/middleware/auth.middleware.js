import { supabaseAdmin } from "../config/supabase.js";

export function verifyAndAuthorize(allowedRoles = []) {
    return async (req, res, next) => {
        try {
            const token =
                req.headers.authorization?.replace("Bearer ", "") || req.query.token;

            if (!token) {
                return res.status(401).json({ error: "Missing access token" });
            }

            const { data, error } = await supabaseAdmin.getUser(token);

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
