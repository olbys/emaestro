
var http = require("http");

var methods = Object.create(null);

var server = http.createServer(function(request, response) {
    function respond(code, body, type) {
        if (!type) type = "application/json";
        response.writeHead(code, {"Content-Type": type});
        if (body && body.pipe)
            body.pipe(response);
        else
            response.end(body);
    }

    if (request.method in methods)
        methods[request.method](urlToPath(request.url),
            respond, request);
    else
        respond(405, "Method " + request.method
            + " not allowed on " + request.url );
}).listen(8000);

function urlToPath(url) {
    var path = require("url").parse(url).pathname;
    console.log("URL -> path: " + path);
    var decodedPath = decodeURIComponent(path).substring(1);
    console.log("decoded path: " + decodedPath);
    return decodedPath;
}


var fs = require("fs");

methods.GET = function(path, respond) {
    fs.stat(path, function(error, stats) {
        console.log("GET path: " + path);
        if (error && error.code == "ENOENT")
            respond(404, "File not found");
        else if (error)
            respond(500, error.toString());
        else if (stats.isDirectory()) {
            console.log("readdir");
            fs.readdir(path, function(error, files) {
                if (error)
                    respond(500, error.toString());
                else
                    respond(200, '{"scores": ["' + files.join('", "') + '"]}');
            });
        }else {
//			respond(200, fs.readFileSync(path,"utf8") );
            console.log("readfile");
            respond(200, fs.createReadStream(path), require("mime").getType(path));
        }
    });
};

methods.DELETE = function(path, respond) {
    fs.stat(path, function(error, stats) {
        if (error && error.code == "ENOENT")
            respond(204);
        else if (error)
            respond(500, error.toString());
        else if (stats.isDirectory())
            respond(204);
        else
            fs.unlink(path, respondErrorOrNothing(respond));
    });
};

function respondErrorOrNothing(respond) {
    return function(error) {
        if (error)
            respond(500, error.toString());
        else
            respond(204);
    };
}

methods.PUT = function(path, respond, request) {
    var outStream = fs.createWriteStream(path);
    outStream.on("error", function(error) {
        respond(500, error.toString());
    });
    outStream.on("finish", function() {
        respond(204);
    });
    request.pipe(outStream);
}

var usb = false

if (usb) {
// -- socket.io --
// Chargement
    var io = require('socket.io').listen(server);

// -- SerialPort --
// Chargement
    var SerialPort = require('serialport');
    var usbserial = '/dev/cu.usbmodem14311';
    var arduino = new SerialPort(usbserial, { autoOpen: false });

// Overture du port serie
    arduino.open(function (err) {
        if (err) {
            return console.log('Error opening port: ' + err.message);
        }
        else {
            console.log ("Communication serie Arduino: Ok")
        }
    });


// Requetes
    io.sockets.on('connection', function (socket) {
        // Message à la connexion
        console.log('Connexion socket : Ok');
///	socket.emit('message', 'Connexion : Ok');
        // Le serveur reçoit un message" du navigateur
        socket.on('message', function (msg) {
            console.log("node <- client: " + msg);
            // socket.emit('message', 'Veuillez patienter !');
            arduino.write(msg, function (err) {
                console.log("node -> arduino: " + msg);
                if (err) {
//		  		io.sockets.emit('message', err.message);
                    return console.log('Error: ', err.message);
                }
                console.log("node -> arduino: OK");
            });
        });
    });

    arduino.on('data', function (data) {
        let buf = new Buffer(data);
        console.log("node <- arduino: " + buf + " = " + buf.toString('ascii') );
        io.sockets.emit('message', buf.toString('ascii'));
        console.log("node -> client: " + buf.toString('ascii'));
    });
}

console.log("Serveur : Ok");
