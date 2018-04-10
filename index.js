var http = require('http');
var url = require('url');
var handleRequest = require('./request-handler.js');
var handlePostRequest = require('./post-request-handler.js');
var utilities = require('./utilities.js');

var routes = {
    '/': handleRequest
};

var server = http.createServer(function(request, response) {
    
    //response.writeHead(200, {"Content-Type": "text/html"});
    //response.end(html);

    var body = '';
    
    request.on('data', function (data) {
        body += data;
    });

    request.on('end', function() {

        console.log("BODY: " + body);
        
        var urlParts = url.parse(request.url);
        var route = routes[urlParts.pathname];
        
        if(route && request.method == "POST") {
            route(request, response, body);
        }
          
        if (route) route(request, response);
        else utilities.sendResponse(response, 'Not Found', 404);

    });
    
});
    
var port = process.env.PORT || 1337;
server.listen(port);
    
console.log("Server running at http://localhost:%d", port);
