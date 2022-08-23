const functions = require('@google-cloud/functions-framework');
const escapeHtml = require('escape-html');
const mysql = require('mysql2');

functions.http('helloHttp', (req, res) => {
  const pool = mysql.createPool({
    connectionLimit : 1,
    host : '10.122.0.5',
    port : 3306, 
    user : 'root',
    password : 'Sadvikaalam98_',
    database : 'testing'
  });

  const name = escapeHtml(req.body.name);
  const description = escapeHtml(req.body.description);
  const image = escapeHtml(req.body.image);

  // pool.query('SELECT * FROM product', function ( error, results ) {
  //   console.log(error);
  //   console.log(results);
  //   res.status(200).send(results);
  // });
  pool.query(`INSERT INTO product2 (name, description, image) VALUES ("${name}", "${description}", "${image}")`, function ( error, results ) {
    console.log(error);
    console.log(results);
    res.status(200).send(results);
  });
});

app.get('/', (req, res) => {
  const name = req.body.name;
  const description = req.body.description;
  const image = req.body.image;

  const data = JSON.stringify({
    name: name,
    description: description,
    image: image
  });

  const options = {
    hostname: '127.0.0.1',
    port: 5000,
    path: '/product2',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  };

  const reqp = http.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`);
  
    res.on('data', d => {
      process.stdout.write(d);
    });
  });

  reqp.on('error', error => {
    console.error(error);
  });
  
  reqp.write(data);
  reqp.end();
  res.json(res);

});

// {
//   "name": "mig",
//   "version": "1.0.0",
//   "dependencies": {
//     "node-fetch": "^2.6.7"
//   }
// }

const fetch = require('node-fetch');

exports.helloWorld = (req, res) => {

  var payload = querystring.stringify({
    "cat": cat
  });

  console.log("Payload : " + payload);

  const backend_url="http://10.34.56.22/ords/api_admin/profiling/indexing/?" + payload;

  console.log("Payload : " + backend_url);

  fetch(backend_url, {
    method: 'GET',
    // body: JSON.stringify({
    //   id: 1,
    //   title: 'fun',
    //   body: 'bar',
    //   userId: 1,
    // }),
    headers: {
      'Content-Length': Buffer.byteLength(payload)
    },
  })
  // Parse JSON data
  .then((response) => response.json())
  
  // Showing response
  .then((json) => res.send(json))
  .catch(err => console.log(err))
};

// REDIS_HOST = 127.0.0.1
// REDIS_PORT = 6379