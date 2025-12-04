const router = require("express").Router()
const controller = require("../controllers/authController")


router.post("/", controller.login)
router.get("/", controller.refresh)
router.get("/decode", controller.decode)
module.exports = router