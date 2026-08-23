const express = require("express");
const router = express.Router();

const homeController = require("../controllers/home.controller");

router.get("/", homeController.index);

router.get("/api/images", homeController.loadMore);

module.exports = router;