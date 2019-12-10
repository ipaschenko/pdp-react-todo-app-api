const authConfig = require('./authConfig');
const dbConfig = require('./dbConfig');

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const mongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
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
    await dbReactTodo.collection('tasks').insertOne({...data, user, done: false, createdAt: new Date().getTime()});
    res.send('Task was saved to database');
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }

});


app.get('/list', async(req, res) => {
  const user = req.user.sub;
  let data = await dbReactTodo.collection('tasks').find({user}).toArray();
  res.send(data);
});

app.delete('/list/:id', async(req, res) => {
  try {
    const user = req.user.sub;
    await dbReactTodo.collection('tasks').deleteOne({user, _id: ObjectID(req.params.id)});
    res.send({success: 'Task was deleted'});  
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

app.patch('/list/:id', async(req, res) => {
  try {
    const user = req.user.sub;
    await dbReactTodo.collection('tasks')
      .findOneAndUpdate({user, _id: ObjectID(req.params.id)}, {$set: {...req.body}});
    res.send({success: 'Task was done'});
  } catch (e) {
    res.status(500).send(e);
  }
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





