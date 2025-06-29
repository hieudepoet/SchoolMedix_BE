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

export async function retrieveFileFromSupabaseStorage(bucket, path) {
      const { data, error } = await admin
            .storage
            .from(bucket)
            .download(path);

      if (error || !data) {
            throw new Error(`❌ Lỗi tải file: ${error?.message}`);
      }

      const arrayBuffer = await data.arrayBuffer(); // 👈 convert Blob → ArrayBuffer
      return Buffer.from(arrayBuffer);              // 👈 then ArrayBuffer → Buffer
}
