const sendEmail = require('./sendEmail');

const sendVerificationEmail = async ({email, token, origin, name}) => {
    return sendEmail({
        to: email,
        subject: 'Verify your email',
        html: `<h1>Hello ${name}</h1> <p>Thank you for signing up to our eccomerce platform. To take full advantage of our services, please verify your account by using this token below: ${token}</p><p>Thanks</p>`
    })
}

module.exports = sendVerificationEmail;