const mongoose = require('mongoose');
const appConfig = require('../config/appConfig')
require("../model/User");
require("../model/Book");

mongoose.connect(appConfig.db.uri, {
    useNewUrlParser: true,
})