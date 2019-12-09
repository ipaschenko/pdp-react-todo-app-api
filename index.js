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

let dbReactTodo;

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(jwtCheck);

app.post('/list', async(req, res) => {
  const user = req.user.sub;
  const data = req.body;
  console.log({...data, user});

  try {
    console.log({...data, user, done: false, createdAt: new Date().getTime()});
    await dbReactTodo.collection('tasks').insertOne({...data, user, done: false, createdAt: new Date().getTime()});
    res.send('Task was saved to database');
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }

});


app.get('/list', async(req, res) => {
  const user = req.user.sub;
  console.log(user);
  let data = await dbReactTodo.collection('tasks').find().toArray();
  res.send(data);
});


mongoClient.connect(dbConfig.uri, dbConfig.options, (err, db)   => {
  if(err) {
    console.log('Error occurred while connecting to MongoDB Atlas...', err);
  }

  dbReactTodo = db.db('reactTodo');
  console.log('Connected...');

  //TODO move to config
  const port = 5000;

  app.listen(port, () => console.log('Server started on 5000 port'));
});





