const express = require('express')
require('./db/mongoose')
const cookieParser = require("cookie-parser");
const appRouter = require("./route/appRoute");
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));
//call router
appRouter.setAppRouter(app);
module.exports = app
