const authConfig = require('./authConfig');
const dbConfig = require('./dbConfig');

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const mongoClient = require('mongodb').MongoClient;
const app = express();
const router = express.Router();

const jwtCheck = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`,
  }),
  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithms: ['RS256']
});

let dbTest;

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(jwtCheck);

app.post('/list', async(req, res) => {
  const user = req.user;
  console.log(user);

  const data = req.body;
  console.log(data);
  res.send(data);
});


app.get('/list', async(req, res) => {
  const user = req.user;
  console.log(user);
  let data = await dbTest.collection('test').find().toArray();
  // console.log(req.headers);
  // console.log(data);
  res.send(data);
});


mongoClient.connect(dbConfig.uri, dbConfig.options, (err, db)   => {
  if(err) {
    console.log('Error occurred while connecting to MongoDB Atlas...', err);
  }

  dbTest = db.db('test');
  console.log('Connected...');

  //TODO move to config
  const port = 5000;

  app.listen(port, () => console.log('Server started on 5000 port'));
});





