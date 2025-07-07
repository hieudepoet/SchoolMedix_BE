import { query } from "../config/database.js";
import { admin } from "../config/supabase.js";

const BUCKET = process.env.SUPABASE_BUCKET || "blog-images";

export async function uploadImgSupabase(req, res) {
    try {
        const files = req.files;

        if (!files || !files.length) {
            return res
                .status(400)
                .json({ error: true, message: "Không nhận được Img." });
        }
        const urls = [];
        for (const file of files) {
            const ext = file.originalname.split('.').pop();
            const filename = `img_${Date.now()}_${Math.floor(Math.random() * 10000)}.${ext}`;
            const { data, error } = await admin.storage
                .from(BUCKET)
                .upload(filename, file.buffer, {
                    contentType: file.mimetype,
                    upsert: false
                });
            if (error) {
                return res.status(500).json({ error: true, details: error.message });
            }
            const { data: publicUrlData } = admin.storage.from(BUCKET).getPublicUrl(filename);
            urls.push(publicUrlData.publicUrl);
        }
        return res.json({ urls });
    } catch (err) {
        console.error("❌ Error fetching full record:", err);
        return res.status(500).json({ error: true, message: "Lỗi khi lưu ảnh vào Supabase!." });
    }
}


export async function createBlog(req, res) {

    const { title,
        content,
        thumbnail_url,
        blog_type_id,
    } = req.body;

    try {

        if (!title ||
            !content ||
            !thumbnail_url ||
            !blog_type_id
        ) {
            return res
                .status(400)
                .json({ error: true, message: "Không nhận được thông tin Blog." });
        }

        const rs = await query(` INSERT INTO blog (title, content, thumbnail_url, blog_type_id)
                                 VALUES ($1, $2, $3, $4) RETURNING *`, [title, content, thumbnail_url, blog_type_id]);

        if (!rs.rows[0]) {
            return res
                .status(400)
                .json({ error: true, message: "Tạo mới Blog không thành công." });
        }

        return res
            .status(200)
            .json({ error: false, message: "Tạo mới Blog thành công.", blog: rs.rows[0] });





    } catch (err) {
        console.error("❌ Error fetching full record:", err);
        return res.status(500).json({ error: true, message: "Lỗi khi tạo mới Blog." });
    }
}

export async function updateBlog(req, res) {

    const { id } = req.params;

    const {
        title,
        content,
        thumbnail_url,
        blog_type_id
    } = req.body;

    try {

        if (!title ||
            !content ||
            !thumbnail_url ||
            !blog_type_id
        ) {
            return res
                .status(400)
                .json({ error: true, message: "Không nhận được thông tin." });
        }

        const rs = await query(`UPDATE blog 
                             SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP ,thumbnail_url = $3, blog_type_id = $4
                             WHERE id = $5 
                             RETURNING * `, [title, content, thumbnail_url, blog_type_id, id]);

        if (!rs.rows[0]) {
            return res
                .status(400)
                .json({ error: true, message: "Update không thành công." });
        }

        return res
            .status(200)
            .json({ error: false, message: "Update Blog thành công.", blog: rs.rows[0] });

    } catch (err) {
        console.error("❌ Error fetching full record:", err);
        return res.status(500).json({ error: true, message: "Lỗi khi Update Blog." });
    }
}

export async function deleteBlog(req, res) {
    const { id } = req.params;

    try {

        if (!id) {
            return res
                .status(400)
                .json({ error: true, message: "Không nhận được thông tin." });
        }
        const check = await query(`SELECT * FROM blog 
                                   WHERE id = $1`,
            [id]);

        if (check.rowCount === 0) {
            return res
                .status(400)
                .json({ error: true, message: "Blog ID không tồn tại." });
        }

        const rs = await query(`UPDATE blog
                                SET is_deleted = $1 
                                WHERE id = $2`,
            [true, id]);

        if (rs.rowCount === 0) {
            return res
                .status(400)
                .json({ error: true, message: "Deleted Blog không thành công" });
        }

        return res
            .status(200)
            .json({ error: false, message: "Deleted Blog thành công.", blog: rs.rows[0] });


    } catch (err) {
        console.error("❌ Error fetching full record:", err);
        return res.status(500).json({ error: true, message: "Lỗi khi Delete Blog." });
    }
}

export async function getAllBlog(req,res) {
    
    try{
        const rs = await query (`SELECT * FROM blog`);
        if(rs.rowCount === 0){
            return res
                .status(400)
                .json({ error: true, message: "Lấy Blog không thành công" });
        }

        return res
            .status(200)
            .json({ error: false, message: "Lấy dữ liệu thành công.", blog: rs.rows });

    } catch (err) {
        console.error("❌ Error fetching full record:", err);
        return res.status(500).json({ error: true, message: "Lỗi khi lấy tất cả Blog." });
    }
}