'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Users = require('./routes/users');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/users', Users);

const port = 3000;
    app.listen(port, () => {
        console.log('App listening on port 3000!');
});
