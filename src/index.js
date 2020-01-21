const bodyParser = require('body-parser');
const express = require('express');
const jwksRsa = require("jwks-rsa");
const cors = require('cors');
const jwt = require("express-jwt");
const mongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const dbConfig = require('./dbConfig');
const listRoutes = require('./routes/list');

const router = express.Router();
const app = express();

const jwtCheck = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${process.env.AUTH_CONFIG_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: process.env.AUTH_CONFIG_AUDIENCE,
  issuer: `${process.env.AUTH_CONFIG_DOMAIN}/`,
  algorithms: ['RS256']
});

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(jwtCheck);
app.use('/', router);

mongoClient.connect(process.env.DB_URI, dbConfig.options, (err, db)   => {
  if(err) {
    console.log('Error occurred while connecting to MongoDB Atlas...', err);
  }
  const taskCollection = db.db('reactTodo').collection('task');
  console.log('Connected...');
  listRoutes(router, taskCollection);
  const port = process.env.PORT || 5000;
  app.set('port', port);
  app.listen(app.get('port'), () => console.log(`Server started on ${port} port`));
});
