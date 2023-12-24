const assyncHandler = require('express-async-handler');
const User = require('../models/usersModels');
const bcrypt = require('bcrypt');
const nodeMailer = require('nodemailer');
const MailDev = require('maildev');
const jwt = require('jsonwebtoken');

// Controller get API
const maildev = new MailDev();

maildev.on('new', function (email) {
  // We got a new email!
});

var smtpConfig = {
  service: 'gmail',
  auth: {
    user: 'gabis.fist.ndiaye@gmail.com',
    pass: 'bhjuhxixrhwhaalw',
  },
};
var transporter = nodeMailer.createTransport(smtpConfig);

const userReisters = assyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;
  if (!userName || !email || !password) {
    res.status(400);
    throw new Error('Toutes les valeurs sont obligatoire');
  }
  const avalaibleUser = await User.findOne({ email });
  if (avalaibleUser) {
    res.status(400);
    throw new Error(`Email allready existe`);
  }
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      ...req.body,
      password: hashPassword,
    });
    if (user) {
      res.status(200);
      verificationEmail(user, res);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const updateUser = assyncHandler(async (req, res) => {
  const user = User.findOne({ _id: req.params.id });
  if (user) {
    try {
      await user.updateOne({
        ...req.body,
      });
      res.status(200).send({ message: 'value' });
    } catch (eror) {}
  } else {
    res.status(500).send({ message: "L'utilisateur n'existe pas!" });
  }
});

const userActivation = assyncHandler(async (req, res) => {
  const { email } = req.user;
  const user = await User.findOne({ email });
  if (user) {
    try {
      await User.updateOne({
        active_user: true,
      });
      res.status(200).send({ message: 'Utilisateur Activé' });
    } catch (error) {
      console.log(error);
      res.status(500);
      throw new Error(error);
    }
  }
});

const verificationEmail = assyncHandler(async (user, res, next) => {
  const accessToken = jwt.sign(
    {
      user: { userName: user.userName, email: user.email, _id: user.id },
    },
    process.env.ENCRYPTION_SECRET,
    {
      expiresIn: '30m',
    }
  );
  const url = 'http://localhost:3333?token=' + accessToken;
  const info = await transporter.sendMail({
    from: 'gabis.fist.ndiaye@gmail.com', // sender address
    to: user?.email, // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: `<b>Hello ${user?.userName} ${user?.lastName}</b>
               <b>Pour Activer votre email veuiller clicker sur le lien ci dessous:</b>
               <b> <a href="${url}">Visit W3Schools.com!</a></b> `, // html body
  });
  if (!info) {
    res.status(500);
    throw new Error('erro');
  }
  res.status(200).send('Message envoyé');
});
const currentUser = assyncHandler(async (req, res) => {
  res.status(200).json({ message: 'current user' });
});

const resetPassword = assyncHandler(async (req, res) => {
  const { newPassWord } = req.body;
  const { email } = req.user;
  const user = await User.findOne({ email });
  console.log(user);
  const hashPassword = await bcrypt.hash(newPassWord, 10);
  if (user) {
    if (!(await bcrypt.compare(newPassWord, user.password))) {
      try {
        await user.updateOne({
          password: hashPassword,
        });
        res.status(200).send({ message: 'Mot de passe reseted' });
      } catch (eror) {}
    } else {
      res
        .status(500)
        .send({ message: 'Veuillez utiliser un mot de passe different' });
    }
  } else {
    res.status(500).send({ message: `l'utilisateur n'existe pas` });
  }
});

const DesactivateOrDeleteCompte = assyncHandler(async (req, res) => {
  const { email } = req.user;
  const user = await User.findOne({ email });
  if (user && user.active_user) {
    try {
      await user.updateOne({
        active_user: false,
      });
      res.status(200).send({ message: 'User Deleted' });
    } catch (error) {
      res.status(500);
      throw new Error(error);
    }
  } else if (user) {
    try {
      await user.deleteOne();
      res.status(200).send({ message: 'User Deleted' });
    } catch (error) {
      res.status(500);
      throw new Error(error);
    }
  }
});

const userLogin = assyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if ((!email, !password)) {
    res.status(400);
    res.json({ message: 'Email et mot de pass obligatoire ' });
  }
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: { userName: user.userName, email: user.email, _id: user.id },
      },
      process.env.ENCRYPTION_SECRET,
      {
        expiresIn: '30m',
      }
    );

    res.status(200).json({
      _id: user.id,
      accessToken,
    });
  } else {
    res.status(401);
    throw new Error('UnAuthorized users');
  }
});

module.exports = {
  userReisters,
  updateUser,
  userActivation,
  resetPassword,
  userLogin,
  currentUser,
  DesactivateOrDeleteCompte,
};
