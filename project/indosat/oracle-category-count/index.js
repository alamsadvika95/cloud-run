/**
* Created by Fikri on 05/07/21
*/

var http = require('http');
var https = require('https');
//var apigee = require('apigee-access');
var querystring = require('querystring');
const saveToDb = require('./save-to-db');

console.log('node.js application has started');

// Create server
exports.server = (req, resp) => {
  // Get app variable
  //var env = apigee.getVariable(req, 'environment.name');
  //var appId = apigee.getVariable(req, 'app.id');
  //var developerAppName = apigee.getVariable(req, 'app.name');
  //var callbackUrl = apigee.getVariable(req, 'app.callbackUrl');

  // Get request variable
  //var transId = apigee.getVariable(req, 'subsProf.transId');
  //var cat = apigee.getVariable(req, 'subsProf.category');
  //var label = apigee.getVariable(req, 'subsProf.label');

  var cat = req.body.category;
  var label = req.body.label;
  
  if (cat && label) {
    cat = cat.toUpperCase();
    var categoryList = '/|AGE|BALANCE|DEVICE_TYPE|GENDER|KABUPATEN|OS_NAME|OS_VERSION|PROPINSI|STATUS|SUBSCRIBERTYPE|TENURE|/';
    var pattern = new RegExp('^' + categoryList);
    var validCategory = pattern.test(cat);
    
    if (validCategory) {
        var data = {
          cat: cat,
          label: label
        };
        
        queryOracle(data, resp);
    } else {
        var response = {
          status: -15,
          message: 'Category Not Found',
        };
    
        resp.writeHead(400);
        resp.end(JSON.stringify(response));        
    }
  } else {
    var response = {
      status: -15,
      message: 'Category Not Found',
    };

    resp.writeHead(400);
    resp.end(JSON.stringify(response));    
  }
};

function queryOracle(data, resp) {
  var payload = JSON.stringify({
    "xcat": data.cat,
    "xlabel": data.label
  });

  console.log("Payload : " + payload);

  // Construct request options
  console.log('Setup request to backend');
  var options = {
    host: "10.34.56.22",
    port: "8080",
    path: "/ords/api_admin/profiling/querynumber",
    method: "POST",
    headers: {
      'Content-Length': Buffer.byteLength(payload),
      'Content-Type': 'application/json'
    }
  };

  // Send request
  var reqToBackend = http.request(options, function(res) {
    console.log('Response Status : ' + res.statusCode);
    console.log('Response Headers : ' + JSON.stringify(res.headers));

    var body = '';
    res.on('data', function (chunk) {
      console.log('Response Body : ' + chunk);

      body += chunk;
    });

    res.on('end', function () {
      if (res && res.statusCode == 200) {
        var bodyResp = JSON.parse(body);

        if (bodyResp) {
          var response = {
            category: data.cat,
            label: data.label,
            quantity: parseInt(bodyResp.quantity),
          };

          resp.end(JSON.stringify(response));

          // Construct trans data
          var transData = {
            
          };

          // Save to db
          saveToDb(transData);
        } else {
            var response = {
              status: -15,
              message: 'Category Not Found',
            };
    
            resp.writeHead(res.statusCode);
            resp.end(JSON.stringify(response));
        }
      } else {
        var response = {
          status: -99,
          message: 'Server error',
        };

        resp.writeHead(res.statusCode);
        resp.end(JSON.stringify(response));

        // Construct trans data
        var transData = {
          
        };

        // Save to db
        saveToDb(transData);
      }
    });
  });

  reqToBackend.on('socket', function (socket) {
    socket.setTimeout(10000);
    socket.on('timeout', function () {
      reqToBackend.abort();
    });
  });

  reqToBackend.on('error', function (e) {
    if (e.code === 'ECONNRESET') {
    //   console.log(data.transId + ' Timeout occurs');

      var response = {
        status: -99,
        message: 'Server error timeout',
      };

      resp.writeHead(500);
      resp.end(JSON.stringify(response));
    }

    // console.log(data.transId + ' ' + data.msisdnDecrypted + ' Request to server error occured : ' + e.message);

    var response = {
      status: -99,
      message: 'Server error',
    };

    resp.writeHead(500);
    resp.end(JSON.stringify(response));
  });

  // Write data to request body
  reqToBackend.write(payload);
  reqToBackend.end();
}