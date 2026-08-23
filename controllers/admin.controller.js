const imageUploadService = require("../services/imageUpload.service");
const Image = require("../models/image");
const Category = require("../models/category");
const slugify = require("slugify");

class AdminController {

    async uploadImage(req, res) {
        try {

            const image = await imageUploadService.upload(req);

            return res.redirect(`/image/${image.slug}`);

        } catch (err) {

            console.error(err);

            return res.status(500).send(err.message);

        }
    }

    async dashboard(req, res) {

        try {

            const [
                totalImages,
                totalCategories,
                totalViews,
                totalCopies,
                recentImages,
                recentCategories
            ] = await Promise.all([

                Image.countDocuments(),

                Category.countDocuments(),


                Image.aggregate([
                    {
                        $group: {
                            _id: null,
                            total: { $sum: "$stats.views" }
                        }
                    }
                ]),

                Image.aggregate([
                    {
                        $group: {
                            _id: null,
                            total: { $sum: "$stats.promptCopies" }
                        }
                    }
                ]),

                Image.find()
                    .populate("category")
                    .sort({ createdAt: -1 })
                    .limit(10)

                ,

                Category.find()
                    .sort({ createdAt: -1 })
                    .limit(10)

            ]);

            console.log("Total Images:", totalImages);

            res.render("admin/dashboard", {

                stats: {
                    totalImages,
                    totalCategories,
                    totalViews: totalViews[0]?.total || 0,
                    totalCopies: totalCopies[0]?.total || 0
                },

                recentImages,
                recentCategories

            });

        } catch (err) {

            console.error(err);

            res.status(500).send(err.message);

        }
    }

    async editPromptPage(req, res) {

    try {

        const image = await Image.findById(req.params.id)
            .populate("category");

        if (!image) {

            return res.status(404).send("Prompt not found");

        }

        const categories = await Category.find()
            .sort({ name: 1 });

        res.render("admin/edit-prompt", {

            image,
            categories

        });

    } catch (err) {

        console.error(err);

        res.status(500).send(err.message);

    }

}

async updatePrompt(req, res) {

    try {

        const {
            title,
            description,
            prompt,
            category
        } = req.body;

        await Image.findByIdAndUpdate(

            req.params.id,

            {
                title,
                description,
                prompt,
                category
            }

        );

        return res.redirect("/admin");

    } catch (err) {

        console.error(err);

        res.status(500).send(err.message);

    }

}

async deletePrompt(req, res) {

    try {

        const image = await Image.findById(req.params.id);

        if (!image) {
            return res.redirect("/admin/dashboard");
        }

        // We'll delete the image from Supabase in the next step

        await Image.findByIdAndDelete(req.params.id);

        res.redirect("/admin");

    } catch (err) {

        console.error(err);

        res.status(500).send(err.message);

    }

}

async editCategoryPage(req, res) {

    try {

        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).send("Category not found");
        }

        res.render("admin/edit-category", {
            category
        });

    } catch (err) {

        console.error(err);
        res.status(500).send(err.message);

    }

}

async updateCategory(req, res) {

    try {

        const { name } = req.body;

        const slug = slugify(name, {
            lower: true,
            strict: true
        });

        // Prevent duplicate category names/slugs
        const existing = await Category.findOne({
            slug,
            _id: { $ne: req.params.id }
        });

        if (existing) {
            return res.status(400).send("Category already exists.");
        }

        await Category.findByIdAndUpdate(
            req.params.id,
            {
                name,
                slug
            }
        );

        return res.redirect("/admin");

    } catch (err) {

        console.error(err);

        return res.status(500).send(err.message);

    }

}

async deleteCategory(req, res) {

    try {

        const totalImages = await Image.countDocuments({
            category: req.params.id
        });

        if (totalImages > 0) {

            return res.status(400).send(
                "This category contains prompts. Delete or move them first."
            );

        }

        await Category.findByIdAndDelete(req.params.id);

        return res.redirect("/admin");

    } catch (err) {

        console.error(err);

        return res.status(500).send(err.message);

    }

}

}



module.exports = new AdminController();