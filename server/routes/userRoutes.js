const router = require('express').Router();
const controller = require('../controllers/userController');
const {checkFields} = require("../middleware/checkFields");
const {checkAuth} = require("../middleware/checkAuth");
// Register User
router.post('/register', checkFields, controller.registerUser);
// Get All Users
router.get('/', checkAuth, controller.getUsers);
// Get single user
router.get("/:user_id", checkAuth, controller.getUser)
module.exports = router;