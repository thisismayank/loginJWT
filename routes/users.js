'use strict';

const express = require('express');
const app = express();
const router = express.Router();

const cors = require('cors');
const authUtils = require('../utils/122-auth-utils');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secretKey';

const { User, Blog, Tag} = require('../sequelize');
const models = require('../models/index');
const emailUtils = require('../utils/133-email-utils');

router.use(cors());

router.post('/fetchUsers', (req, res) => {
    // console.log('User', User);
    // console.log('router...', router);
    // console.log('Users...', Users);
    // console.log(Users === router);
   
    User.findAll().then(users => res.json(users))
})
// router.use(function timeLog (req, res, next) {
//     // console.log('Time: ', Date.now())
//     next()
//   })
  // define the home page route
//   router.get('/', function (req, res) {
//     //   console.log(models.Users.f;
//     res.send('Birds home page')
//   })

// router.get('/api/users', (req, res)=>{
//     console.log('inside get');
//     User.find()
//     .then(user=>{
//         console.log('inside then block of get');
//         res.send({status: true, data: user});
//         return user;
//     })
// })

router.post('/login', (req, res)=>{
    User.findOne({
        where: {
            userCode: req.body.userCode,
            isActive: true
        }
    })
    .then((user, err) => {
        if(err) {
            res.status(401).send('Wrong Username or password');
        }

        if (authUtils.comparePassword(req.body.password, user.dataValues.password)) {
            if(user.otp) {
                res.status(401).send({success: false, message: 'go to the link sent in the email to activate account'});
            }
            let token = jwt.sign(user.dataValues, SECRET_KEY);
            res.json({token: token});
        } else {
            // console.log('else');
            res.status(401).send('Wrong Username or password');
        }
    });
});

router.post('/generateOTP', (req, res) => {
    let email = req.body.email;
    let otp = {
        otp:authUtils.generateOTP()
    };
    User.findOne({
        where: {
            email: email,
            isActive: true
        }
    })
    .then(user=>{
        user.dataValues.otp = otp.otp;
        return user.save()
    })
        .then(data=>{
        let text = `Go to ${body.url}/verifyOTP and enter ${otp.otp}`;        
        let emailUtility = emailUtils.sendEmail(data.dataValues.email, text);
            emailUtility.transporter.sendMail(emailUtility.mailOptions, (err, data)=>{
                if(err) {
                    res.status(400).send('email not sent');
                } else {
                    res.status(200).send('Email generated and sent, check email for otp');
                }
            });
        });
})

router.post('/verifyOTP', (req, res)=>{
    User.findOne({
        where: {
            userCode: req.body.userCode,
            otp: req.body.otp,
            isActive: true
        }
    })
    .then((user, err) => {
        if(err) {
            res.status(401).send('Wrong Usercode');
        }
        res.status(200).send('User authenticated');
    });
});

router.post('/signup', (req, res)=>{

    let body = req.body;
    let otp;
    User.findOne({
        where: {
         userCode: body.userCode.toString(),
         email: body.email.toString(),
         isActive: true   
        }
    })
    .then((user, err) => {
        if(user) {
            res.status(400).send('User already exists');
        }
        otp = authUtils.generateOTP();
        let data = {
            firstName: body.firstName ? body.firstName.toString(): null,
            lastName: body.lastName ? body.lastName.toString(): null,
            email: body.email ? body.email.toString() : null,
            password: body.password ? authUtils.hashPassword(body.password).toString():null,
            userCode: body.userCode ? body.userCode.toString(): null,
            isActive: true,
            dob: body.dob ? body.dob : null,
            otp: otp,
            loginRetryCount: 0
        };
       return User.create(data)
    })
        .then((user) => {
            if(!user) {
                res.status(400).send('User not created');
            }
            let text = `Go to ${body.url}/verifyOTP and enter ${otp}`;
            let emailUtility = emailUtils.sendEmail(123,123);
            emailUtility.transporter.sendMail(emailUtility.mailOptions, (err, data)=>{
                if(err) {
                    res.status(400).send('User not created');
                } else {
                    res.status(200).send('User created, check email for otp');
                }
            });
        });
});

// router.post('/logout', (req, res)=>{

//     let userId = jwt.verify(JSON.parse(req.body.token), SECRET_KEY).id;

//     User.findOne({
//         where: {
//          userCode: body.userCode.toString(),
//          email: body.email.toString(),
//          isActive: true   
//         }
//     })
//     .then((user, err) => {
//         if(user) {
//             res.status(400).send('User already exists');
//         }
//         let data = {
//             firstName: body.firstName ? body.firstName.toString(): null,
//             lastName: body.lastName ? body.lastName.toString(): null,
//             email: body.email ? body.email.toString() : null,
//             password: body.password ? authUtils.hashPassword(body.password).toString():null,
//             userCode: body.userCode ? body.userCode.toString(): null,
//             isActive: true,
//             dob: body.dob ? body.dob : null,
//             otp: body.otp ? body.otp : null,
//             loginRetryCount: 0
//         };
//        return User.create(data)
//     })
//         .then((user) => {
//             if(!user) {
//                 res.status(400).send('User not created');
//             }
//             res.status(200).send('User created successfully');
//         });
// });

router.put('/updatePassword', (req, res)=>{
    let userCode = jwt.verify(JSON.parse(req.body.token), SECRET_KEY).userCode;

    let body = req.body;
    // let otp = authUtils.generateOTP()
        let data = {
            password: authUtils.hashPassword(body.password).toString()
        };

        return User.update(data, {
            where: {
                userCode: userCode
            } 
        })
        .then((user) => {
            if(!user) {
                res.status(400).send('Password not updated');
            }
            res.status(200).send('Password updated successfully');
        });
});

router.put('/updateEmail', (req, res)=>{
    let userCode = jwt.verify(JSON.parse(req.body.token), SECRET_KEY).userCode;

    let body = req.body;
        let data = {
            email: email.toString()
        };

        return User.update(data, {
            where: {
                userCode: userCode
            } 
        })
        .then((user) => {
            if(!user) {
                res.status(400).send('Email not updated');
            }
            res.status(200).send('Email updated successfully');
        });
});

module.exports = router