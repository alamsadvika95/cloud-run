const mysql = require('mysql2');

const testingMysql = ( req, res ) => {
  const pool = mysql.createPool({
    connectionLimit : 1,
    host : '127.0.0.1',
    port : 3306, 
    user : 'root',
    password : 'Sadvikaalam98_',
    database : 'testing'
  });

  // pool.query('SELECT * FROM Product', function ( error, results ) {
  //   console.log(error);
  //   console.log(results);
  //   res.status(200).send(results);
  // });
  const name = "alam";
  const description = "description";
  const image = "image";

  pool.query(`INSERT INTO product (name, description, image) VALUES ("${name}", "${description}", "${image}")`, function ( error, results ) {
    console.log(error);
    console.log(results);
    // res.status(200).send(results);
  });

}

testingMysql();

