var http = require('http');
var https = require('https');
var apigee = require('apigee-access');
var mysql = require('mysql');
var uuid = require('uuid/v1');
var moment = require('moment');

var con = mysql.createPool({
  host     : '10.34.152.71',
  port     : '3306',
  user     : 'drdb',
  password : 'bRW6V8aUSz',
  database : 'apimanager'
});

exports.server = (req, resp) => {
  var serviceBeTransId = req.body.servicebetransid;
  // serviceBeTransId.replace('+', '');
  var msisdn = req.body.msisdn;
  var time = req.body.time;
  var param = req.body.param;

  if(msisdn.startsWith('0')) {
    msisdn = msisdn.replace(/^0/, "62");
  }
  console.log('Service Be Trans Id : ' + serviceBeTransId);
  console.log('MSISDN : ' + msisdn);
  console.log('Time : ' + time);
  console.log('Param : ' + param);
  
  resp.end();
  
  // Get current datetime
  var datetime = moment().format('YYYYMMDDHHMMSS');
  var inputtime = moment().format('YYYY-MM-DD HH:mm:ss');
  
  con.getConnection(function(err, connection) {
      if(err) {
        console.log("Connection error");
        throw err;
      }
     
      console.log("Connection created");
      
      // Get trans_stk_advertising
      var getClientTransId = "SELECT msisdn, client_trans_id, callback_dr_url, callback_menu FROM apimanager.trans_stk_advertising WHERE service_be_trans_id = ?";
      connection.query(getClientTransId, serviceBeTransId, function(error, results, fields) {
      if(error) {
        console.log('Error execute query: ' + error);
      } else {
        if(results.length > 0) {
            var obj = results[0];
            
            console.log(obj);
            
            if(obj && obj.callback_menu) {
                var url = obj.callback_menu + "?TRANSID=" + obj.client_trans_id + "&MSISDN=" + obj.msisdn + "&DATETIME=" + datetime + "&USERINPUT=" + param;
                
                // URL validation
                var urlValidation = url.split("://");
                
                // Create request to callback_menu
                if(urlValidation[0] === 'http') {
                    http.get(url, function(res) {
                        console.log('Callback Menu URL : ' + url);
                        console.log("RESPONSE STATUS : " + res.statusCode);
                        console.log("RESPONSE HEADERS : " + JSON.stringify(res.headers));
                        
                        var body = '';
                        res.on('data', function(chunk) {
                            console.log("RESPONSE BODY : " + chunk);
                              body += chunk; 
                        });
                        
                        res.on('end', function() {
                            if(res && res.statusCode == 200)  {
                                console.log("Callback sent");
                            } else {
                                console.log("Server error occured : " + res.statusCode);
                            }
                            
                            var transData = [inputtime, param, body, res.statusCode, serviceBeTransId];
                                  
                                  saveToDb(transData);
                        });
                    }).on('error', function(err) {
                        console.log("Error sending request to callback : " + err);
                        
                        var transData = [inputtime, param, err.message, 999, serviceBeTransId];
                              
                              saveToDb(transData);
                    });
                } else {
                          // Set https url
                          var paths = urlValidation[1].split("/");
                          var subPath = "";

                          for(var i = 1; i < paths.length; i++) {
                              subPath += "/" + paths[i];
                          }
                          
                          var pathParts = paths[0].split(":");
                          var port = pathParts.length > 1 ? pathParts[1] : 443;
                          var fullPath = subPath;
                          
                          console.log('Callback Menu Url : ' + urlValidation[0] + '://' + pathParts[0] + '' + fullPath);
                          
                          // Set request to callback_menu
                          var options = {
                              host : pathParts[0],
                              path : fullPath,
                              port : port,
                              method : "GET",
                              rejectUnauthorized : false
                          };

                          var reqToBackend = https.request(options, function(res) {
                              console.log("RESPONSE STATUS : " + res.statusCode);
                        console.log("RESPONSE HEADERS : " + JSON.stringify(res.headers));
                        
                        var body = '';
                        res.on('data', function(chunk) {
                            console.log("RESPONSE BODY : " + chunk);
                              body += chunk; 
                        });
                        
                        res.on('end', function() {
                            if(res && res.statusCode == 200)  {
                                console.log("Callback sent");
                            } else {
                                console.log("Server error occured : " + res.statusCode);
                            }
                            
                            var transData = [inputtime, param, body, res.statusCode, serviceBeTransId];
                                  
                                  saveToDb(transData);
                        });
                          });
                          
                          reqToBackend.on('error', function(err) {
                        console.log("Error sending request to callback : " + err);
                              
                              var transData = [inputtime, param, err.message, 999, serviceBeTransId];
                              
                              saveToDb(transData);
                          });
                          
                          reqToBackend.end();
                      }
            } else {
                var transData = [inputtime, param, null, null, serviceBeTransId];
                                  
                      saveToDb(transData);
            }
        } else {
            console.log('Service Be Trans Id Not Found : ' + serviceBeTransId);
        }
      }
      });
    
    connection.release();
  });

}

function saveToDb(transData) {
  console.log(transData);
  var sql = "UPDATE apimanager.trans_stk_advertising SET user_input_time = ?, user_input = ?, callback_menu_resp = ?, callback_menu_resp_code = ? WHERE service_be_trans_id = ?";
  
  // Update menu on trans_stk_advertising
  con.query(sql, transData, function(error, results, fields) {
    if(error) {
      console.log('Error execute query: ' + error);
    } else {
      console.log('Start updating');
      if(results.affectedRows > 0) {
        console.log('Update success');
      } else {
        console.log('Update failed');
      }
    }
  });
}
