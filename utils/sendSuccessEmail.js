const sendEmail = require('./sendEmail');

const sendSuccessEmail = async ({email, origin, name}) => {
    return sendEmail({
        to: email,
        subject: 'Your account has now been verified',
        html: `<h1>Hello ${name}</h1><p>Your account has now been verified.</p><p>Thanks</p>`
    })
}

module.exports = sendSuccessEmail;