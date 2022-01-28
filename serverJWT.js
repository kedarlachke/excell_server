require('dotenv').config()
// Import section


const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const morgan = require('morgan');
const http = require('http');
const cookieParser= require('cookie-parser');
var expressSessionPassportCleanup = require('express-session-passport-cleanup');
//const passportConfig = require('./passportController/passportController');
//const passportConfigJWT = require('./passportController/passportControllerJWT');
const router = require('./router/router');
var path=require('path');
var proxy = require('express-http-proxy');

var whitelist = [
'http://localhost:8080',
'http://localhost:8081', 
'http://evil.com/']





//const MONGO_URI='mongodb://rvp0001:rvp0001@ds217452.mlab.com:17452/auth'
//const MONGO_URI='mongodb://localhost/auth'

const MONGO_URI=process.env.MONGO_URI;
mongoose.connect(MONGO_URI);
mongoose.Promise = global.Promise;

// const models = require('./models');

import express from 'express';
import cors from 'cors';
import bodyparser from 'body-parser';
import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';
import sysDateTime from './services/dateTimeServices';
import multer from 'multer';
import documentsServices from './services/documentsServices';
import { me } from './passportController/passportControllerJWT'

// Importing types
import typeDefs from './graphQL/types';
//IMPORTING ENV vARIABLE




// Make executable schema
let graphQLSchema = buildSchema(typeDefs);
//Importing resolvers
import resolvers from './graphQL/resolvers';
//const resolvers ='';

//Import Additional for Authentication


// Set the port number
const PORT = process.env.MOMOAPIPORT;

// Initialize the app
const server = express();





//APP SETUP
server.use(morgan('combined'));
//server.use(bodyparser.json({ type: '*/*' }));
//server.use(cookieParser('aaabbbccc'));

// server.use(session({
//   resave: false,
//   saveUninitialized: true,
//   secret: 'aaabbbccc',
//   store: new MongoStore({
//     url: MONGO_URI,
//     autoReconnect: true
//   })
// }));




server.use('/md', proxy('http://81.4.102.11:4466/',''));

server.use(expressSessionPassportCleanup);
server.use(passport.initialize());
// server.use(passport.session());



var myLogger = function (req, res, next) {
  console.log('LOGGED')
  next()
}


var corsOptions = {
  origin: function (origin, callback) {

    console.log('origin start');
    console.log(origin);
    console.log(whitelist.indexOf(origin));
    console.log('origin end');
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      console.log(origin);
      callback(new Error('Not allowed by CORS'))
    }
  },

  credentials: true
}


// var corsOptions = function(req, callback) {
//   var corsOptions, origin = req.header('Origin');
//   console.log("Origin: ", origin);

//   var originIsWhitelisted = whitelist.indexOf(origin) !== -1
//   if (originIsWhitelisted) {
//       corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
//   } else {
//       corsOptions = { origin: false } // disable CORS for this request
//   }
//   callback(originIsWhitelisted ? null : new Error('WARNING: CORS Origin Not Allowed'), corsOptions) // callback expects two parameters: error and options

// }



//Restrict the client-origin for security reasons.
//server.use('*', cors({ origin: 'http://localhost:3000' }));



server.use(cors());

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// simple middleware function
server.use((req, res, next)=>{
  console.log("Request received at : " + sysDateTime.sysdate_yyyymmdd() + "  "+ sysDateTime.systime_hh24mmss());  
  next();
});

server.get('*', me, function(req, res,next) {
 next();
});

server.post('*', me, function(req, res,next) {
  next();
 });

// server.use(myLogger);

// Use multer middleware to read the files from multipart-request
// Use memory storage
server.use(multer({
  storage: multer.memoryStorage()
}).any());


// service to download file
server.get('/excellinv/download', async (request, response) => {

  /* //Donwlaod file from disk
  let bufferedData = fileSystem.readFileSync("timon-icon.png");
  let fileContents = Buffer.from(bufferedData, "binary");
  response.download("timon-icon.png"); */

  console.log('YYYYYY YYYYYY')
  // Get the document from database
  let document = await documentsServices.downloadDocument(request);
  
  if(Object.keys(document).length == 0)
  {
    response.status(404);
    response.send("The requested resource not found.");
  }
  else
  {

      // Get document buffer
      let bufferedData = document.document;
      let fileContents = await Buffer.from(bufferedData, "binary");

      console.log("Downloading file : " + document.documentName);

      // Set response header 
      response.setHeader("Content-disposition", "attachment; filename="+document.documentName);
      response.setHeader("Content-type", document.documentType);
      response.setHeader("Content-Length", document.documentSize);
      
      // Set respose body
      response.send(fileContents);
      //response.send(bufferedData);

  }

});


/* // The GraphQL endpoint
server.use('/excellinv', graphqlHTTP({
  schema : graphQLSchema,
  rootValue : resolvers,
  graphiql : true
})); */

// New GraphQL endpoint [ Send request and reponse in context ]
server.use('/excellinv',graphqlHTTP( (request, response) => ({
  schema: graphQLSchema,
  rootValue: resolvers,
  graphiql: true,
  context: { request, response }
})));  


//router(server);
//server.use(express.static(path.join(__dirname,"public")));
server.use(express.static('public'));



server.get('*', function(req, res){
  res.sendFile('index.html', { root: 'public' });
});


// Start the server

server.listen(PORT,process.env.SERVERIP, () => {
  console.log(`GraphQL Server is now running on http://${process.env.SERVERIP}:${PORT}/excellinv`);
  console.log(`Go to http://${process.env.SERVERIP}:${PORT}/excellinv to run queries!`);
  console.log('------------------------------------------------------');
});

