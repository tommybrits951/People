const router = require('express').Router()
const controller = require("../controllers/postController")
const {checkAuth} = require("../middleware/checkAuth")


router.post("/", checkAuth, controller.post)
router.get("/", checkAuth, controller.getPosts)

module.exports = router