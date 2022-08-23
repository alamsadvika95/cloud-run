const express = require("express");
const app = express();
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const multer = require('multer');
const db = require("./config/db");
const redis = require('redis');
const http = require('http');
const fetch = require('node-fetch');

const User = require("./config/User");
const Product = require("./config/Product");
const { response } = require("express");

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

client.on("error", function(error) {
  console.error(error);
});

client.set("key", "alam", redis.print);

const redisHost = process.env.REDIS_HOST;
console.log("🚀 ~ file: index.js ~ line 27 ~ redisHost", redisHost)
const redisPort = process.env.REDIS_PORT;
console.log("🚀 ~ file: index.js ~ line 29 ~ redisPort", redisPort)
const port = process.env.PORT;
console.log("🚀 ~ file: index.js ~ line 31 ~ port", port)
const databaseHost = process.env.DATABASE_HOST;
console.log("🚀 ~ file: index.js ~ line 33 ~ databaseHost", databaseHost)
const databaseName = process.env.DATABASE_NAME;
console.log("🚀 ~ file: index.js ~ line 35 ~ databaseName", databaseName)



//dotenv
dotenv.config();

//Configuration for Port 
app.listen(process.env.PORT, () => {
  console.log( `Backend server is running on port ${process.env.PORT}`);
});

//database connection 
db.authenticate().then(() =>
  console.log("berhasil terkoneksi dengan database")
);

// Create File Storage
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, '/mnt/data');
  },
  filename: (req, file, cb) => {
      cb(null, new Date().getTime() + '-' + file.originalname)
  }
});

//Create filter image yang akan diupload
const fileFilter = (req, file, cb) => {
  if(
      file.mimetype === 'image/png' || 
      file.mimetype === 'image/jpg' || 
      file.mimetype === 'image/jpeg'
  ){
      cb(null, true);
  } else {
      cb(null, false);
  }
} 

//upload image
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'))
app.use(bodyParser.json());

//api routes
//------------------------------------------------------------------------------------------------------------------------
//Testing Product

app.get('/', (req, res) => {
  fetch('https://httpbin.org/get', {
  method: 'GET',
  // body: JSON.stringify({
  //   id: 1,
  //   title: 'fun',
  //   body: 'bar',
  //   userId: 1,
  // }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
  })
  // Parse JSON data
  .then((response) => response.json())
  
  // Send the response
  .then((json) => res.json(json.origin))
  .catch(err => console.log(err))
});

app.get('/testing', (req, res) => {
  res.send('Testing hello word from version 2');
});

app.get('/testing2', (req, res) => {
    res.send('Testing hello word from version 2');
});
app.post("/product", async (req, res) => {
  try{
    const name = req.body.name;
    const description = req.body.description;
    const image = req.body.image;

    const newProduct = new Product({
      name,
      description,
      image
    });

    await newProduct.save();
    res.json(newProduct);
  }catch(err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

app.get("/products", async (req, res) => {
  try {
    const getAllProduct = await Product.findAll({});

    res.json(getAllProduct);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

app.get("/product/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // Check the redis store for the data first
    client.get(id, async (err, dataProduct) => {
      if (dataProduct) {
        return res.status(200).send({
          error: false,
          message: `Data for the product with id ${id} from the cache`,
          data: JSON.parse(dataProduct)
        })
      } else { // When the data is not found in the cache then we can make request to the server
  
          const dataProduct = await Product.findOne({
            where: { id: id }
          });
  
          // save the record in the cache for subsequent request
          client.setex(id, 1440, JSON.stringify(dataProduct));
  
          // return the result to the client
          return res.status(200).send({
            error: false,
            message: `Recipe for ${id} from the server`,
            data: dataProduct
          });
      }
    }) 
  } catch (error) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

app.delete("/product/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const deleteProduct = await Product.destroy({
      where: { id: id }
    });

    await deleteProduct;

    res.json("Product berhasil di hapus");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});



//-----------------------------------------------------------------------------------------------------------------------
