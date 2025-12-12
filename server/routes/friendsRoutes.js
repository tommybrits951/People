const controller = require("../controllers/friendsController")
const router = require("express").Router()
const {checkAuth} = require("../middleware/checkAuth")

router.post("/request", checkAuth, controller.sendRequest)
router.get("/", checkAuth, controller.getFriendsList)
router.get("/pending", checkAuth, controller.getPendingRequests)
router.put("/accept/:friend_id", checkAuth, controller.acceptRequest)
router.delete("/reject/:friend_id", checkAuth, controller.rejectRequest)
router.get("/status/:user_id", checkAuth, controller.getFriendStatus)

module.exports = router;
