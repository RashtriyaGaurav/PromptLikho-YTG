const path = require("path");
const crypto = require("crypto");

const Image = require("../models/image");
const Category = require("../models/category");

const imageService = require("./image.service");
const uploadService = require("./upload.service");
const geminiService = require("./gemini.service");

class ImageUploadService {

    async upload(req) {

        const { sendNotification } = req.body;

        // Validate uploaded image
        imageService.validateImage(req.file);

        // Optimize image
        const processed = await imageService.processImage(req.file.buffer);

        // Find category
        const category = await Category.findById(req.body.category);

        if (!category) {
            throw new Error("Category not found.");
        }

        // Create unique filename
        const fileName =
            `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.webp`;

        const now = new Date();

        const filePath = path.posix.join(
            category.slug,
            String(now.getFullYear()),
            String(now.getMonth() + 1).padStart(2, "0"),
            fileName
        );

        // Upload image
        const imageUrl = await uploadService.uploadImage(
            processed.buffer,
            filePath
        );

        // Generate AI metadata
        const metadata = await geminiService.generateMetadata(
            req.body.prompt,
            category.name
        );

        // Save to MongoDB
        const image = await Image.create({

            title: metadata.title,

            slug: metadata.slug,

            description: metadata.description,

            image: {
                url: imageUrl,
                width: processed.width,
                height: processed.height,
                size: processed.size,
                format: processed.format
            },

            prompt: req.body.prompt,

            category: category._id,

            tags: metadata.tags,

            seo: {
                title: metadata.seoTitle,
                description: metadata.seoDescription,
                alt: metadata.altText
            },

            status: "published"

        });

return image;
    }

}

module.exports = new ImageUploadService();