const assyncHandler = require('express-async-handler')
const User = require('../models/usersModels')
const bcrypt = require('bcrypt')
const nodeMailer = require('nodemailer')
const MailDev = require("maildev");
const jwt = require('jsonwebtoken');

// Controller get API 
const maildev = new MailDev();

maildev.on("new", function (email) {
    // We got a new email!
});
  
var smtpConfig = {
    service: "gmail",
    auth: {
        user: "gabis.fist.ndiaye@gmail.com",
        pass: 'bhjuhxixrhwhaalw',
    }
};
var transporter = nodeMailer.createTransport(smtpConfig);

const userReisters = assyncHandler(async (req, res) => {
    const { userName, email, password } = req.body
    if (!userName || !email || !password) {
        res.status(400);
        throw new Error('Toutes les valeurs sont obligatoire')
    }
    const avalaibleUser = await User.findOne({ email })
    if (avalaibleUser) {
        res.status(400)
        throw new Error(`Email allready existe`)
    }
    try {
            const hashPassword = await bcrypt.hash(password, 10)
            const user = await User.create({
                ...req.body,
                password: hashPassword
            })
            if (user) {
                res.status(200);
                verificationEmail(email, res);
            }
        } catch (error) {
            throw new Error(error)
        }
})


const verificationEmail = assyncHandler(async (email, res) => {
 
    const info = await transporter.sendMail({
        from: "gabis.fist.ndiaye@gmail.com", // sender address
        to: "gabis.fist.ndiaye@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    })
    console.log("Message sent: %s", info.messageId);
})
const currentUser = assyncHandler(async (req, res) => {
    res.status(200).json({ message: "current user" })
})

const resetPassword = assyncHandler(async(req, res) => {
    res.status(200).json({ message: "password succesfuly changed" })
})

const userLogin = assyncHandler(async(req, res) => {
    const {email, password} = req.body
    if (!email, !password) {
        res.status(400);
        res.json({message: 'Email et mot de pass obligatoire '})
    }
    const user = await User.findOne({ email });
    if (user && bcrypt.compare(password, user.password)) {
        const accessToken = jwt.sign({
           user : { userName: user.userName,
            email: user.email,
                _id: user.id
            }
        }, process.env.ENCRYPTION_SECRET, {
            expiresIn: '30m'
        })

        res.status(200).json({ 
            _id: user.id,
            accessToken
         })
    } else {
        res.status(401);
        throw new Error('UnAuthorized users');
    }
})




module.exports = {userReisters, resetPassword, userLogin, currentUser}