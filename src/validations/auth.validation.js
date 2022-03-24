const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const { password } = require('./custom.validation');

const register = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        displayName: Joi.string(),
        dob: Joi.date()
            .format('DD/MM/YYYY')
            .max(new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 18))
            .message('Age Should be Greater than 18')
            .raw()
            .required(),
        privacy: Joi.string().required(),
        deviceToken: Joi.string()
    }),
};

const login = {
    body: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required(),
        deviceToken: Joi.string(),
    }),
};

const refreshTokens = {
    body: Joi.object().keys({
        refreshToken: Joi.string().required(),
    }),
};

const forgotPassword = {
    body: Joi.object().keys({
        email: Joi.string().email().required(),
    }),
};

const resetPassword = {
    query: Joi.object().keys({
        token: Joi.string().required(),
    }),
    body: Joi.object().keys({
        password: Joi.string().required().custom(password),
    }),
};

const logout = {
    body: Joi.object().keys({
        refreshToken: Joi.string().required(),
    }),
};

const changePassword = {
    body: Joi.object().keys({
        password: Joi.string().required(),
    }),
};

const updateUserInfo = {
    body: Joi.object().keys({
        displayName: Joi.string(),
        profileImage: Joi.string(),
    }),
};

module.exports = {
    register,
    login,
    refreshTokens,
    forgotPassword,
    resetPassword,
    logout,
    changePassword,
    updateUserInfo
};
