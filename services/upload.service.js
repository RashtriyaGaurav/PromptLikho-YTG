const supabase = require("../config/supabase");

class UploadService {

    async uploadImage(buffer, filePath, mimeType = "image/webp") {

        const { error } = await supabase.storage
            .from(process.env.SUPABASE_BUCKET)
            .upload(filePath, buffer, {
                contentType: mimeType,
                upsert: false
            });

        if (error) {
            throw new Error(error.message);
        }

        const { data } = supabase.storage
            .from(process.env.SUPABASE_BUCKET)
            .getPublicUrl(filePath);

        return data.publicUrl;
    }

    async deleteImage(filePath) {

        const { error } = await supabase.storage
            .from(process.env.SUPABASE_BUCKET)
            .remove([filePath]);

        if (error) {
            throw new Error(error.message);
        }
    }

}

module.exports = new UploadService();