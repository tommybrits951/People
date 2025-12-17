const router = require("express").Router()
const controller = require("../controllers/commentController")
const {checkAuth} = require("../middleware/checkAuth")

router.post("/:post_id", checkAuth, controller.createComment)
router.get("/:post_id", checkAuth, controller.getComments)

module.exports = router