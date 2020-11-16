const express = require('express');
const router = express.Router() ;
const otpController = require('../controllers/otp_controller');

router.post('/', otpController.generate);
router.post('/verify-otp',otpController.verify);
module.exports = router; 