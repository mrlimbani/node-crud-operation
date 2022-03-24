const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');

const register = catchAsync(async (req, res) => {
    console.log('req.body==>',req.body);
    const user = await userService.createUser(req.body);
    const tokens = await tokenService.generateAuthTokens(user);
    res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req,res) => {
    const { email, password, deviceToken } = req.body;
    const user = await authService.loginUserWithEmailAndPassword(req.body.email,req.body.password);
    const tokens = await tokenService.generateAuthTokens(user);
    if (deviceToken) {
        user.deviceToken = deviceToken;
        if (deviceToken) await userService.updateUserById(user._id, user);
    }
    let emailsend;
    if(!!user && !!tokens){
        console.log('Email sent succesfully');
        emailsend = await emailService.sendEmail(user.email,'Login Succesfully','You are login succesfully..!!');
    }
    res.send({ user, tokens, emailsend });
});

const userInfo = catchAsync(async (req,res) => {
    const authHeader = req.headers.authorization || '';
    let token = '';
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7, authHeader.length);
    }
    const userObj = await userService.getUserById(req.user._id);
    const tokens = await tokenService.getAuthTokens(req.user, token);
    res.send({ user: userObj, tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
    const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
    await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
    res.status(httpStatus.NO_CONTENT).send();

});

const resetPassword = catchAsync(async (req, res) => {
    await authService.resetPassword(req.query.token, req.body.password);
    res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
    const tokens = await authService.refreshAuth(req.body.refreshToken);
    res.send({ ...tokens });
});

const logout = catchAsync(async (req, res) => {
    await tokenService.invalidateToken(req.body.refreshToken);
    res.send({ success: true });
});

const changePassword = catchAsync(async (req, res) => {
    const user = await userService.updateUserById(req.user._id, req.body);
    res.send({ user });
});

const updateUserInfo = catchAsync(async (req, res) => {
    const user = await userService.updateUserById(req.user._id, req.body);
    res.send({ user });
});

module.exports = {
    register,login,userInfo,forgotPassword,resetPassword,refreshTokens,logout,
    changePassword,updateUserInfo
};