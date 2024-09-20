const sendEmail = require('./sendEmail');

const sendVerificationEmail = async ({email, token, origin, name}) => {
    const text = `Hello ${name},\n\nPlease verify your email by clicking the link: ${origin}/user/verify-email/${token}&email=${email}\n\nThanks`;
    return sendEmail({
        to: email,
        subject: 'Verify your email',
        text,
        html: `<h1>Hello ${name}</h1><p>Please verify your email by clicking the link: <a href="${origin}/verify-email/${token}">Verify Email</a></p><p>Thanks</p>`
    })
}

module.exports = sendVerificationEmail;