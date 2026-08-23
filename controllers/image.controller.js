const Image = require("../models/image");

class ImageController {

    async show(req, res) {

        try {

            const image = await Image.findOne({
                slug: req.params.slug,
                status: "published"
            }).populate("category");

            if (!image) {
                return res.status(404).render("error", {
                    message: "Image not found."
                });
            }

            // Increase view count
            image.stats.views += 1;
            image.stats.lastViewedAt = new Date();

            await image.save();

            res.render("image/show", {
                image
            });

        } catch (err) {

            console.error(err);

            res.status(500).send(err.message);

        }

    }

}

module.exports = new ImageController();