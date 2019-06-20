const express = require('express')
const bodyParser = require('body-parser')
const { User, File, userFileMapping  } = require('./sequelize')
const routeUsers = require('./routes/users');
const routeFiles = require('./routes/files');
const routeUserFileMapping = require('./routes/users-files-mappings');


const app = express()
const router = express.Router();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

// app.use('/user', router);
// app.use('/user', routeUsers);
app.use(routeUsers);
app.use(routeFiles);
app.use(routeUserFileMapping);
// create a user
// app.post('/api/users', (req, res) => {
//     console.log(req.body)
//     User.create(req.body)
//         .then(user => res.json(user))
// })
// // get all users
// router.get('/api/users', (req, res) => {
//     console.log('User', User);
//     console.log('true');
//     // console.log('Users...', Users);
//     // console.log(Users === router);
//     User.find().then(users => res.json(users))
// })

// router.get('/api/comeOn', (req, res) => {
//     console.log('User', User);
//     console.log('router...', router);
//     console.log('comeOn...');
//     // console.log(Users === router);
//     User.findAll().then(users => res.json(users))
// })


const port = 3000
app.listen(port, () => {
    console.log(`Running on http://localhost:${port}`)
})