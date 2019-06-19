'use strict';

const express = require('express');
const app = express();
const router = express.Router();

const cors = require('cors');
const authUtils = require('../utils/122-auth-utils');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secretKey';

const { User, File} = require('../sequelize');
const models = require('../models/index');

router.use(cors());

router.get('/fetchFiles', (req, res) => {
    File.findAll()
    .then((files,err) => {
        if(err) {
            res.status(401).send('files not found');
        }
        res.json(files);
    });
});
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
            let token = jwt.sign(user.dataValues, SECRET_KEY);
            res.json({token: token});
        } else {
            console.log('else');
            res.status(401).send('Wrong Username or password');
        }
    });
});

router.post('/signup', (req, res)=>{

    let body = req.body;
    User.findOne({
        where: {
         userCode: body.userCode.toString(),
         isActive: true   
        }
    })
    .then((user, err) => {
        if(user) {
            res.status(400).send('User already exists');
        }
        let data = {
            firstName: body.firstName ? body.firstName.toString(): null,
            lastName: body.lastName ? body.lastName.toString(): null,
            email: body.email ? body.email.toString() : null,
            password: body.password ? authUtils.hashPassword(body.password).toString():null,
            userCode: body.userCode ? body.userCode.toString(): null,
            isActive: true,
            dob: body.dob ? body.dob : null,
            otp: body.otp ? body.otp : null,
            loginRetryCount: 0
        };
       return User.create(data)
    })
        .then((user) => {
            if(!user) {
                res.status(400).send('User not created');
            }
            res.status(200).send('User created successfully');
        });
});

module.exports = router