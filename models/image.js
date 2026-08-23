const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            index: true,
            lowercase: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        image: {
            url: {
                type: String,
                required: true
            },

            width: {
                type: Number,
                required: true
            },

            height: {
                type: Number,
                required: true
            },

            size: {
                type: Number,
                required: true
            },

            format: {
                type: String,
                default: "webp"
            }
        },

        prompt: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
            index: true
        },

        tags: [
            {
                type: String,
                lowercase: true,
                trim: true,
                index: true
            }
        ],

        seo: {
            title: {
                type: String,
                trim: true
            },

            description: {
                type: String,
                trim: true
            },

            alt: {
                type: String,
                trim: true
            }
        },

        stats: {
            views: {
                type: Number,
                default: 0
            },

            promptCopies: {
                type: Number,
                default: 0
            },

            lastViewedAt: {
                type: Date
            },

            lastCopiedAt: {
                type: Date
            }
        },

        status: {
            type: String,
            enum: ["draft", "published", "archived"],
            default: "draft",
            index: true
        },

        isFeatured: {
            type: Boolean,
            default: false,
            index: true
        }
    },
    {
        timestamps: true
    }
);

// Compound indexes for faster queries
imageSchema.index({ category: 1, status: 1 });
imageSchema.index({ status: 1, createdAt: -1 });
imageSchema.index({ slug: 1 });
imageSchema.index({ title: "text", description: "text", tags: "text" });

module.exports = mongoose.model("Image", imageSchema);