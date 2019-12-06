const express = require('express');
const router = express.Router();
const app = express();

const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const mongoClient = require('mongodb').MongoClient;

const jwtCheck = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "react-notepad.eu.auth0.com/.well-known/jwks.json"
  }),
  audience: 'http://localhost:5000',
  issuer: "react-notepad.eu.auth0.com/",
  algorithms: ['RS256']
});

//TODO move to config
const uri = "mongodb+srv://reactTodo:reactTodo@cluster0-lufki.mongodb.net/test?retryWrites=true&w=majority";
const dbOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

let dbTest;

app.get('/', async(req, res) => {
  let data = await dbTest.collection('test').find().toArray();
  console.log(data);
  res.send(data);
});


mongoClient.connect(uri, dbOptions, (err, db)   => {
  if(err) {
    console.log('Error occurred while connecting to MongoDB Atlas...', err);
  }

  dbTest = db.db('test');
  console.log('Connected...');

  //TODO move to config
  const port = 5000;

  app.listen(port, () => console.log('Server started on 5000 port'));
});


// require('./routes/test')(router, dbTest);





