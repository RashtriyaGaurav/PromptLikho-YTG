const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");
const upload = require("../middlewares/upload.middleware");
const Category = require("../models/category");


router.get("/", adminController.dashboard);

router.get(
    "/prompts/:id/edit",
    adminController.editPromptPage
);

router.post(
    "/prompts/:id/edit",
    adminController.updatePrompt
);

router.post(
    "/prompts/:id/delete",
    adminController.deletePrompt
);

router.get(
    "/categories/:id/edit",
    adminController.editCategoryPage
);

router.post(
    "/categories/:id/edit",
    adminController.updateCategory
);

router.post(
    "/categories/:id/delete",
    adminController.deleteCategory
);

router.get("/upload", async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true }).sort({ name: 1 });

        res.render("admin/upload", {
            categories
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post(
    "/upload",
    upload.single("image"),
    adminController.uploadImage
);

module.exports = router;