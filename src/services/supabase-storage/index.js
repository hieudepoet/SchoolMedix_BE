import { supabaseAdmin } from "../../config/supabase.js";

export async function uploadFileToSupabaseStorage(file, bucket, path) {
      const { data, error } = await supabaseAdmin.storage
            .from(bucket)
            .upload(path, file, {
                  cacheControl: '3600',
                  upsert: true
            });

      if (error) {
            throw new Error(`Lỗi upload file: ${error.message}`);
      }

      const { data: publicUrlData } = supabaseAdmin
            .storage
            .from(bucket)
            .getPublicUrl(path);

      return publicUrlData.publicUrl;
}
