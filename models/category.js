const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        description: {
            type: String,
            default: ""
        },

        stats: {
            totalImages: {
                type: Number,
                default: 0
            },

            totalViews: {
                type: Number,
                default: 0
            },

            totalPromptCopies: {
                type: Number,
                default: 0
            }
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Category", categorySchema);