const sendEmail = require('./sendEmail');

const sendOtpEmail = async ({email, token, origin, name}) => {
    const text = `Hello ${name},\n\nPlease verify your email by clicking the link: ${origin}/user/verify-email/${token}&email=${email}\n\nThanks`;
    return sendEmail({
        to: email,
        subject: 'Resend OTP',
        text,
        html: `<h1>Hello ${name}</h1><p>Thank you for signing up to our eccomerce platform. To take full advantage of our services, please verify your account by using this token below: ${token}</p><p>Thanks</p>`
    })
}

module.exports = sendOtpEmail;