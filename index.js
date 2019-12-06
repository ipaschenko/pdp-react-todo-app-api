const express = require('express');
const router = express.Router();
const app = express();

const mongoClient = require('mongodb').MongoClient;

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





