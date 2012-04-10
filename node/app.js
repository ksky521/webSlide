var http = require("http"),
        url  = require("url"),
        path = require("path"),
        fs   = require("fs");
		
var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app);

app.listen(3000);

function handler (req, res) {
        //res.setHeader('Connection', 'keep-alive');
        //res.setHeader('Expires', 'Mon, 31 Dec 2012 23:59:59 GMT');
        //res.setHeader('Cache-Control', 'max-age=31536000');

        var pathname = __dirname + url.parse(req.url).pathname;
        if(path.extname(pathname) == "") {
            pathname += "/";
        }
        if(pathname.charAt(pathname.length - 1) == "/") {
            pathname += "index.html";
        }

        path.exists(pathname, function(exists) {
            if(exists) {
                var type = {
                    ".html": "text/html",
                    ".htm": "text/html",
                    ".js": "text/javascript",
                    ".css": "text/css",
                    ".ico": "image/x-icon",
                    ".jpeg": "image/jpeg",
                    ".jpg": "image/jpeg",
                    ".png": "image/png",
                    ".gif": "image/gif",
                    ".xml": "text/xml",
                    ".json": "application/json",
                    ".txt": "text/plain",
                    ".pdf": "application/pdf",
                    ".swf": "application/x-shockwave-flash"
                };
                res.writeHead(200, {"Content-Type": type[path.extname(pathname)]});
                fs.readFile(pathname, function(err, data) {
                    res.end(data);
                });
            } else {
                res.writeHead(404, {"Content-Type": "text/html"});
                res.end("<h1>404 Not Found</h1>");
            }
        });
    };

io.sockets.on('connection', function(client){   
	//连接成功则执行下面的监听
	client.on('action',function(event){ 
		client.broadcast.emit('action', event);
	});
	//断开连接callback
	client.on('disconnect',function(){
		console.log('Server has disconnected');
	});
});