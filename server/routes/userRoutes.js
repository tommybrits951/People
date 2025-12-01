const router = require('express').Router();
const userController = require('../controllers/userController');
const {checkFields} = require("../middleware/checkFields");

// Register User
router.post('/register', checkFields, userController.registerUser);
// Get All Users
router.get('/', userController.getUsers);

module.exports = router;