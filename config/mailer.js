const nodemailer = require('nodemailer')


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'diegolautaro16@gmail.com',
        pass: 'aquidhbyfbceehov',
    }
})

transporter.verify(() => {
    console.log('Ready for send emails')
})

module.exports = transporter