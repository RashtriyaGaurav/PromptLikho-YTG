const sharp = require("sharp");

class ImageService {

    validateImage(file) {

        if (!file) {
            throw new Error("Image is required.");
        }

        const allowedMimeTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new Error("Only JPG, JPEG, PNG and WEBP images are allowed.");
        }

        const maxSize = 10 * 1024 * 1024; // 10MB

        if (file.size > maxSize) {
            throw new Error("Image size cannot exceed 10MB.");
        }

        return true;
    }

    async processImage(fileBuffer) {

    const transformer = sharp(fileBuffer)
        .rotate()
        .resize({
            width: 1280,
            withoutEnlargement: true
        })
        .webp({
            quality: 80
        });

    const { data, info } = await transformer.toBuffer({
        resolveWithObject: true
    });

    return {
        buffer: data,
        width: info.width,
        height: info.height,
        size: data.length,
        format: info.format
    };
}

}

module.exports = new ImageService();