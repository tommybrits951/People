const router = require("express").Router()
const controller = require("../controllers/commentController")

router.post("/", controller.createComment)
router.get("/:post_id", controller.getComments)

module.exports = router