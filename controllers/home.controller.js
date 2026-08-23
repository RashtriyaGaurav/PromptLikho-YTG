const Image = require("../models/image");
const Category = require("../models/category");

class HomeController {

  async index(req, res) {
    try {

        const { category } = req.query;

        let query = { status: "published" };
        let sort = { createdAt: -1 };

        if (category && category !== "trending") {
            const categoryDoc = await Category.findOne({
                name: new RegExp(`^${category}$`, "i")
            });

            query.category = categoryDoc ? categoryDoc._id : null;
        }

        if (category === "trending") {
            sort = { "stats.views": -1 };
        }

        const images = await Image.find(query)
            .populate("category")
            .sort(sort)
            .limit(20);      // 👈 only first 20

        res.render("home/index", {
            images,
            selectedCategory: category || ""
        });

    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
}

async loadMore(req, res) {

    try {

        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;

        const { category } = req.query;

        let query = { status: "published" };
        let sort = { createdAt: -1 };

        if (category && category !== "trending") {

            const categoryDoc = await Category.findOne({
                name: new RegExp(`^${category}$`, "i")
            });

            query.category = categoryDoc ? categoryDoc._id : null;
        }

        if (category === "trending") {
            sort = { "stats.views": -1 };
        }

        const images = await Image.find(query)
            .populate("category")
            .sort(sort)
            .skip(skip)
            .limit(limit);

        res.json({
            images,
            hasMore: images.length === limit
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

}

}

module.exports = new HomeController();