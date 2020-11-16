const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 5500;

//dbPasss: xyx12345, userName team09   dbName: apartmentHunt;

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://team09:xyx12345@cluster0.sppky.mongodb.net/apartmentHunt?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  console.log('db connected');
  const bookingCollection = client.db("apartmentHunt").collection("bookings");
  app.post('/bookings', (req, res) => {

  });
  
  const apartmentCollection = client.db("apartmentHunt").collection("apartments");
  app.post('/addHouse', (req, res) => {

  });

});


app.get('/', (req, res) => {
  res.send('Apartment Hunt Server')
});


app.listen(port);