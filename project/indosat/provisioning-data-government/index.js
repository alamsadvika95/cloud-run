var http = require('http');
var https = require('https');
var mysql = require('mysql');
var moment = require('moment');
var uuid = require('uuid');

var pool = mysql.createPool({
  host     : '10.34.152.71',
  port      : '3306',
  user     : 'drdb',
  password : 'bRW6V8aUSz',
  database : 'apimanager',
  connectTimeout : 180000,
  acquireTimeout : 180000,
  connectionLimit : 1000
});

// Set http global setting
http.globalAgent.maxSockets = Infinity;
http.globalAgent.keepAlive = true;

exports.server = (req, resp) => {
  // Get variable
  var transId = req.body.dataReward.transId;
  var msisdn = req.body.dataReward.msisdn;
  var packageCode = req.body.dataReward.package;
  var packageValue = req.body.dataReward.packageValue;
  var internalTransId = req.body.dataReward.internalTransId;
  var internalStartTime = req.body.dataReward.internalStartTime;

  // Get sender name
  var partnerName = req.body.dataReward.sender ? req.body.dataReward.sender : req.body.app.SENDER_NAME ? req.body.app.SENDER_NAME : "APITest";
    
  // Get callback URL
  var callback = req.body.app.callbackUrl ? req.body.app.callbackUrl : "";
   
  // Get developer app name
  var appName = req.body.app.name;
  
  // Get quota and period
  var data = packageValue.split('|')[0];
  var period = packageValue.split('|')[1];
  
  // Get expiry date
  var expiryDate = moment().add(period, 'days').format('YYYY-MM-DD HH:mm:ss');
  
  // Get current date
  var now = moment();
  var currentTimestamp = now.format('YYYYMMDDHHMMSSsss');
  var currentISOFormat = now.format('YYYY-MM-DD HH:mm:ss');
  console.log('Current ISO format : ' + currentISOFormat);
  
  // Clean MSISDN fron all non-numeric character
  msisdn = msisdn.replace(/\D/g,'');
   
  // Convert MSISDN number to standard format
  if(msisdn.startsWith('0')) {
      msisdn = msisdn.replace(/^0/, "62");
  }
  
  console.log("MSISDN : " + msisdn);
  
  // Validate MSISDN
  var msisdnDecrypted = msisdn;
  var prefixNum = '/|62855|62856|62857|62858|62814|62815|62816|0855|0856|0857|0858|0814|0815|0816|/';
  var pattern = new RegExp('^' + prefixNum);
  var hasPrefix = pattern.test(msisdn);
  if(!hasPrefix) {
       // Validate MSISDN
       hasPrefix = pattern.test(msisdnDecrypted);
       if(!hasPrefix) {
           var response = {
               status : -16,
               message : "Invalid MSISDN"
           };
           
           // Return 
           resp.writeHead(400);
           resp.end(JSON.stringify(response));
           
           // Save to DB
           var transData = {
               id : uuid(),
               client_trans_id : transId,
               msisdn : msisdn,
               msisdn_plain : msisdnDecrypted,
               package_code : packageCode,
               data : data,
               expiry_period : period,
               created_date : currentISOFormat,
               expiry_date : expiryDate,
               client_name : partnerName,
               type : 'KUOTA_BANTUAN_BELAJAR',
               status : response.status,
               status_desc : response.message,
               callback : callback,
               developer_app_name : appName,
               trans_sdp : 0
           };
           saveToDb(transData);
       }
  }
  
  // Construct request
  var request = {
       internalStartTime : internalStartTime,
       internalTransId : internalTransId,
       currentTimestamp : currentTimestamp,
       currentISOFormat : currentISOFormat,
       transId : transId,
       msisdn : msisdn,
       msisdnDecrypted : msisdnDecrypted,
       packageCode : packageCode,
       data : data,
       period : period,
       expiryDate : expiryDate,
       partnerName : partnerName,
       callback : callback,
       appName : appName
  };
   
  // Submit to NGSSP
  submitReq(req, resp, request);
}

function submitReq(req, resp, request) {
  // Get OAG Access Token
  var oagAccessToken = req.body.private.credential_20;
//   var oagAccessToken = "YXBpZ3d1aWQxNTphcGlnd3VpZDE1";
  console.log('OAG Access Token : ' + oagAccessToken);
  
  var payload = JSON.stringify({
     "con:REQUEST" : {
       "@xmlns:con" : "http://indosatooredoo.com/ngssp/schemas/controller",
       "con:INTERNALSTARTTIME" : request.internalStartTime,
       "con:INTERNALTRANSID" : request.internalTransId,
       "con:CGI" : null,
       "con:CLIENTID" : "APGWALLET",
       "con:DATETIME" : request.currentTimestamp,
       "con:TRANSID" : request.internalTransId,
       "con:MSISDN" : request.msisdnDecrypted,
       "con:SERVICENAME" : request.packageCode,
       "con:ACTION" : "ADD",
       "con:SERVICEID" : null,
       "con:IMSI" : null,
       "con:SERVICETYPE" : null,
       "con:PARAM" : 234,
       "con:ATTRIBUTES" : {
           "KEY": {
                 "NAME": "string",
                 "VALUE": "string"
               }
       }
     }
   });
   
   console.log('Payload : ' + payload);
   
   var options = {
       host : 'oag.indosatooredoo.com',
       port : '5090',
       path : '/AsyncMainController1_auth',
       method : 'POST',
       headers : {
           'Authorization': 'Basic ' + oagAccessToken,
           'Content-Type': 'application/json',
           'Content-Length': Buffer.byteLength(payload),
           'Connection': 'Keep-Alive'
       }
   }
   
   // Set request agent
   var keepAliveAgent = new https.Agent({ keepAlive: true });
   options.agent = keepAliveAgent;
   
   var start = new Date();
   
   var response;
   var transData;
   
   // // Send Request
   var reqToBackend = https.request(options, function(res) {
       console.log('STATUS: ' + res.statusCode);
       console.log('HEADERS: ' + JSON.stringify(res.headers));
       var body = '';
       res.on('data', function(chunk) {
           console.log('BODY res: ' + chunk);
           body += chunk;
       });
       res.on('end', function()  {
           if(res && res.statusCode == 200) {
               var bodyResp = JSON.parse(body);
                                 
               // Construct Response
               response = {
                   msisdn : request.msisdn,
                   transid : request.transId,
                   status : bodyResp.RESPONSE.STATUS,
                   message : bodyResp.RESPONSE.DESC
               };
                  
               // Return 
               resp.end(JSON.stringify(response));
               
               var end = new Date() - start;
               console.info('Execution call backend time: %dms', end);
  
               // Save to DB
               transData = {
                   id : uuid(),
                   trans_id : bodyResp.RESPONSE.TID,
                   client_trans_id : request.transId,
                   msisdn : request.msisdn,
                   msisdn_plain : request.msisdnDecrypted,
                   package_code : request.packageCode,
                   data : request.data,
                   expiry_period : request.period,
                   created_date : request.currentISOFormat,
                   expiry_date : request.expiryDate,
                   client_name : request.partnerName,
                   type : 'KUOTA_BANTUAN_BELAJAR',
                   status : bodyResp.RESPONSE.STATUS,
                   status_desc : bodyResp.RESPONSE.DESC,
                   callback : request.callback,
                   developer_app_name : request.appName,
                   trans_sdp : 0
               };
               saveToDb(transData);
           } else {
               console.log('Server error occured : ' + body);
               response = {
                   status : -99,
                   message : "Internal server error"
               };
               resp.writeHead(500);
               resp.end(JSON.stringify(response));
               
               // Save to DB
               transData = {
                   id : uuid(),
                   client_trans_id : request.transId,
                   msisdn : request.msisdn,
                   msisdn_plain : request.msisdnDecrypted,
                   package_code : request.packageCode,
                   data : request.data,
                   expiry_period : request.period,
                   created_date : request.currentISOFormat,
                   expiry_date : request.expiryDate,
                   client_name : request.partnerName,
                   type : 'KUOTA_BANTUAN_BELAJAR',
                   status : response.status,
                   status_desc : response.message,
                   callback : request.callback,
                   developer_app_name : request.appName,
                   trans_sdp : 0
               };
               saveToDb(transData);
           }
       });
   });
   
   reqToBackend.on('error', function(e) {
       console.log('An error occured : ' + e.message);
       response = {
           status : -99,
           message : e.message
       };
       resp.writeHead(500);
       resp.end(JSON.stringify(response));
       
       // Save to DB
       transData = {
           id : uuid(),
           client_trans_id : request.transId,
           msisdn : request.msisdn,
           msisdn_plain : request.msisdnDecrypted,
           package_code : request.packageCode,
           data : request.data,
           expiry_period : request.period,
           created_date : request.currentISOFormat,
           expiry_date : request.expiryDate,
           client_name : request.partnerName,
           type : 'KUOTA_BANTUAN_BELAJAR',
           status : response.status,
           status_desc : response.message,
           callback : request.callback,
           developer_app_name : request.appName,
           trans_sdp : 0
       };
       saveToDb(transData);
   });
   
   // // Write data to request body
   reqToBackend.write(payload);
   reqToBackend.end();    
   setTimeout(function() {
       resp.end();    
   }, 300);
}

function saveToDb(transData) {
  // Insert data to db
  var insertDb = "INSERT INTO apimanager.trans_data_reward SET ?";
  console.log("Query Insert : " + insertDb);
  pool.getConnection(function(err, connection) {
      if(err) {
        console.log('Error connection');
        throw err;
      }
      console.log('Connected!');
      
      connection.query(insertDb, transData, function(error, results, fields) {
          if(error) {
              console.log('Error execute query');
              throw error;
          } else {
              console.log('Try inserting...');
              if(results.affectedRows > 0) {
                  console.log('Insert success');
              } else {
                  console.log('Insert failed');
              }
          }   
      });
     
      connection.release();
  });
}
