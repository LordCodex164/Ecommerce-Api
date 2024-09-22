const nodemailer = require("nodemailer")
const nodemailerConfig = require("./nodemailer.config")

const sendEmail = async ({to, subject, text, html}) => {
   try {
    const testAccount = await nodemailer.createTestAccount();
    console.log("testAccount", testAccount)
    const nodemailerTransporter = nodemailer.createTransport(nodemailerConfig)
    const info = await nodemailerTransporter.sendMail({
        from: '"LordCodex164" <adenirandaniel565@gmail.com>',
        to,
        text,
        subject,
        html
    })
    console.log("info", info)
    return info
   } catch (error) {
      throw new Error(error.message)
   }
}

module.exports = sendEmail;