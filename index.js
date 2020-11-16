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

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://team09:xyx12345@cluster0.sppky.mongodb.net/apartmentHunt?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  console.log('db connected');
  const bookingCollection = client.db("apartmentHunt").collection("bookings");
  app.post('/bookings', (req, res) => {

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
      }).catch(function (error) {
        // Handle error
      });
  })

});


app.get('/', (req, res) => {
  res.send('Apartment Hunt Server')
});


app.listen(process.env.PORT || port);