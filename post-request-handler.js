var http = require('http');
var utilities = require('./utilities.js');

var actions = {
    'POST': function(request, response, body) {
        
            var options = {
                hostname: '176.126.244.22',
                port: 80,
                path: '/CloudProj/getEmpInfo.php',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
              };
        
            var req = http.request(options, function(res) {
                console.log('Status: ' + res.statusCode);
                console.log('Headers: ' + JSON.stringify(res.headers));
                res.setEncoding('utf8');
                res.on('data', function (innerBody) {
                    // Make new web request to MBR to submit all info

                    var options = {
                        hostname: 'mbr-niekirk.azurewebsites.net',
                        port: 80,
                        path: '/submitEmployment',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        }
                      };
                    
                    var mbrReq = http.request(options, function(mbrRes) {
                        console.log('Status: ' + mbrRes.statusCode);
                        console.log('Headers: ' + JSON.stringify(mbrRes.headers));
                        mbrRes.setEncoding('utf8');
                        mbrRes.on('data', function (body) {
                        });


                        response.writeHead(200, {"Content-Type": "text/html"});
                        response.end("<font color='green'>Employment details submitted to MBR successfully!</font>");
                    });

                    mbrReq.on('error', function(e) {
                        console.log('problem with request: ' + e.message);
                    });
                      // write data to request body
                  
                    console.log(innerBody);
                    mbrReq.end(innerBody);

                });
              });
            req.on('error', function(e) {
              console.log('problem with request: ' + e.message);
            });
            // write data to request body
        
            console.log(body);
            req.end(body);
        
          }
};

module.exports = function(request, response, body) {
  var action = actions[request.method];
  if (action) action(request, response, body);
  else utilities.sendResponse(response, 'Not Found', 404);
};