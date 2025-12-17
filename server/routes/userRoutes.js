const router = require('express').Router();
const controller = require('../controllers/userController');
const {checkFields} = require("../middleware/checkFields");
const {checkAuth} = require("../middleware/checkAuth");
router.post('/register', checkFields, controller.registerUser);
router.get('/', checkAuth, controller.getUsers);
router.get("/:user_id", checkAuth, controller.getUser)
module.exports = router;