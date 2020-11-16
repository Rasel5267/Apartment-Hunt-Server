const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');


const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('apartmentImage'));
app.use(fileUpload());

const port = 5500;

//dbPasss: xyx12345, userName team09   dbName: apartmentHunt;
//Nihal mongoDB => user:apartmentHuntUser, pass: abcd1234, DB-Name: apartmentHunt;

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://apartmentHuntUser:abcd1234@cluster0.pf9xm.mongodb.net/apartmentHunt?retryWrites=true&w=majority";
// const uri = "mongodb+srv://team09:xyx12345@cluster0.sppky.mongodb.net/apartmentHunt?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  console.log('db connected');
  const bookingCollection = client.db("apartmentHunt").collection("bookings");

  app.post('/addBooking', (req, res) => {
    console.log(req);
    const name = req.body.name;
    const number = req.body.number;
    const email = req.body.email;
    const message = req.body.message;
    const house = req.body.house;
    const price = req.body.price;
    const status = req.body.status;

    bookingCollection.insertOne({ name, number, email, message, house, price, status })
      .then(result => {
        res.send(result.insertedCount > 0)
      })
      .catch(error => {
        console.log(error);
      });
  });

  app.get('/bookings', (req, res) => {
    bookingCollection.find({ email: req.query.email })
      .toArray((err, docs) => {
        res.send(docs)
      })
  });

  app.get('/allBookings', (req, res) => {
    bookingCollection.find({})
      .toArray((err, docs) => res.send(docs));
  });

  const apartmentCollection = client.db("apartmentHunt").collection("apartments");

  app.post('/addNewApartment', (req, res) => {
    console.log(req);
    const file = req.files.file;
    const title = req.body.title;
    const price = req.body.price;
    const location = req.body.location;
    const bedroom = req.body.bedroom;
    const bathroom = req.body.bathroom;

    const newImg = file.data;
    const encImg = newImg.toString('base64');

    const image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, 'base64')
    };

    apartmentCollection.insertOne({ title, price, location, bedroom, bathroom, image })
      .then(result => {
        res.send(result.insertedCount > 0)
      })
      .catch(error => {
        console.log(error);
      });
  });

  app.get('/apartments', (req, res) => {
    apartmentCollection.find({})
      .toArray((err, docs) => res.send(docs));
  });

});


app.get('/', (req, res) => {
  res.send('Apartment Hunt Server')
});


app.listen(process.env.PORT || port);