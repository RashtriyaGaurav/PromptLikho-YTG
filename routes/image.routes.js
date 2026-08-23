const express = require("express");
const router = express.Router();

const imageController = require("../controllers/image.controller");

router.get("/:slug", imageController.show);

module.exports = router;