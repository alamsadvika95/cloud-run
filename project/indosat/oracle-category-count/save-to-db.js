var mysql = require('mysql');
var uuid = require('uuid/v1');

// DB Config
var con = mysql.createPool({
    host     : '10.45.213.3',
    port     : '3306',
    user     : 'drdb',
    password : 'bRW6V8aUSz',
    database : 'apimanager'
});

function saveToDb(transData) {
    console.log('Trans Data : ' + JSON.stringify(transData));
    
    con.getConnection(function (err, connection) {
        if (err) {
          console.log("Connection error");
          
          throw err;
        }
    
        var sql = "INSERT INTO apimanager.trans_subscriber_profile SET ?";
        connection.query(sql, transData, function (error, results, fields) {
            if (error) {
                console.log(transData.profile_id + ' Error execute query: ' + error);
            } else {
                if (results.affectedRows > 0) {
                    console.log(transData.profile_id + ' Insert success');
                    
                    result = results.affectedRows;
                } else {
                    console.log(transData.profile_id + ' Insert failed');
                }
            }
        });
    
        connection.release();
    });
}

module.exports = saveToDb;