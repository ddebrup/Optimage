const express = require('express')
const router = express.Router();
const usersController = require('../controllers/users_controller');

router.post('/',usersController.signIn);

module.exports = router ;