const controller = require("../controllers/friendsController")
const router = require("express").Router()
const {checkAuth} = require("../middleware/checkAuth")

router.post("/send", controller.sendRequest)
router.get("/", checkAuth, controller.getFriendsList)

module.exports = router;
