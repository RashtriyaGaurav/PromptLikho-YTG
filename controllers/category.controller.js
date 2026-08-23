const Category = require("../models/category");

class CategoryController {

    async index(req, res) {
        const categories = await Category.find().sort({ createdAt: -1 });

        res.render("admin/categories/index", {
            categories
        });
    }

    createPage(req, res) {
        res.render("admin/categories/create");
    }

    async create(req, res) {
        try {

            const name = req.body.name.trim();

            const slug = name
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^\w-]+/g, "");

            const exists = await Category.findOne({ slug });

            if (exists) {
                return res.send("Category already exists.");
            }

            await Category.create({
                name,
                slug
            });

            res.redirect("/admin/categories/new");

        } catch (err) {

            res.send(err.message);

        }
    }

}

module.exports = new CategoryController();