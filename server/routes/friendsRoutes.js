const controller = require("../controllers/friendsController")
const router = require("express").Router()
const {checkAuth} = require("../middleware/checkAuth")

router.post("/send", controller.sendRequest)


module.exports = router;
