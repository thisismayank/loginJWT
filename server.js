'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const models = require('./models');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const port = 3000;

models.sequelize.sync()
.then(() => {
    app.listen(port, () => {
        console.log('App listening on port 3000!');
    });
})
