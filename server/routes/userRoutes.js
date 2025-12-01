const router = require('express').Router();
const userController = require('../controllers/userController');
const {checkFields} = require("../middleware/checkFields");
const {checkAuth} = require("../middleware/checkAuth");
// Register User
router.post('/register', checkFields, userController.registerUser);
// Get All Users
router.get('/', checkAuth, userController.getUsers);

module.exports = router;