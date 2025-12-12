const router = require("express").Router()
const controller = require("../controllers/authController")


router.post("/", controller.login)
router.get("/", controller.refresh)
router.get("/decode", controller.decode)
router.post("/logout", controller.logout)
module.exports = router