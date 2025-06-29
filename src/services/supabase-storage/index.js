import { admin } from "../../config/supabase.js";


export async function uploadFileToSupabaseStorage(file, bucket, path) {
      const { data, error } = await admin.storage
            .from(bucket)
            .upload(path, file.buffer, {
                  cacheControl: '3600',
                  upsert: true,
                  contentType: file.mimetype,
            });

      if (error) throw new Error(`Lỗi upload file: ${error.message}`);

      const { data: publicUrlData } = admin
            .storage
            .from(bucket)
            .getPublicUrl(path);

      return publicUrlData.publicUrl;
}
