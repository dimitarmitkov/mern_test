global.__basedir = __dirname;

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
// const utils = require('./utils');
// const { server: { port, cors: corsConfig }} = require('./config');
const api = require('./api');
const tapLog = require('./utils/tap-log');
const globalErrorHandler = require('./global-error-handler');
const passport = require("passport");
const { server: { port, cors: corsConfig }, database } = require('./config');
const session = require('express-session');



const app = express();

app.use(cors({
  origin: corsConfig.urls,
  credentials: corsConfig.credentials,
  exposedHeaders: corsConfig.exposedHeaders
}));

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.resolve(__basedir, 'static/public')));
// app.use(express.static(path.resolve(__basedir, 'viewer')));

api.connect('/api/v1', app);

app.use('*', function (req, res) {
  // res.sendFile(path.resolve(__dirname, 'viewer', 'index.html'));
  res.sendFile(path.resolve(__dirname, 'static/public', 'index.html'));

});

app.use(globalErrorHandler);

function appListen() {
  return new Promise((resolve, reject) => {
    app.listen(port, function () { resolve(); })
  });
}

appListen().then(tapLog(`Server is listening on :${port}`))
    .catch(error => console.log(`Server Error: ${error.message}`));

