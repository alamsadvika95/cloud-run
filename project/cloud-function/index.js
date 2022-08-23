const functions = require('@google-cloud/functions-framework');
const escapeHtml = require('escape-html');
// const express = require("express");
// const app = express();
const db = require("./db");
const Product = require("./product");

// db.authenticate().then(() =>
//   console.log("berhasil terkoneksi dengan database")
// );

// app.listen( 5000, () => {
//   console.log( `Backend server is running on port 5000`);
// });

// HTTP Cloud Function.
functions.http('helloHttp', (req, res) => {
  const name = escapeHtml(req.query.name);
  const description = escapeHtml(req.query.description);
  const image = escapeHtml(req.query.image);

  const newProduct = new Product({
      name,
      description,
      image
    });

  newProduct.save();

  // res.send(`Hello ${escapeHtml(req.query.name || req.body.name || 'World')}!`);
  res.json(newProduct);

});