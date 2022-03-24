const express = require('express');
const auth = require('../../src/middlewares/auth');
const validate = require('../../src/middlewares/validate');
const authValidation = require('../../src/validations/auth.validation');
const authController = require('../../src/controllers/auth.controller');

const router = express.Router();

router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);
router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);

router.post('/logout', validate(authValidation.logout), authController.logout);

router.patch('/me', auth(), authController.userInfo);
router.post('/change-password', auth(), validate(authValidation.changePassword), authController.changePassword);
router.post('/update-info', auth(), validate(authValidation.updateUserInfo), authController.updateUserInfo);

module.exports = router;