const jwt = require('jsonwebtoken');

const createJwtToken = ({payload}) => {
    console.log("payload", payload);
   return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    });
}

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET)

const attachCookiesToResponse = (res, refreshToken, user) => {
    const accessTokenJwt = createJwtToken({payload: {user}})
    const refreshTokenJwt = createJwtToken({payload: {user, refreshToken}})

    const oneDay = 1000 * 60 * 60 * 24;
    const longerExp = 1000 * 60 * 60 * 24 * 30;

    res.cookie("accessToken", accessTokenJwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        expires: new Date(Date.now() + oneDay),
    })

    res.cookie("refreshToken", refreshTokenJwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        expires: new Date(Date.now() + longerExp),
    })

}

module.exports = {
    isTokenValid,
    createJwtToken,
    attachCookiesToResponse
};