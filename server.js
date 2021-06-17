const express = require('express')
const https = require('https');
const fs = require('fs');

const app = express()


// Enable reverse proxy support in Express. This causes the
// the "X-Forwarded-Proto" header field to be trusted so its
// value can be used to determine the protocol. See 
// http://expressjs.com/api#app-settings for more details.

/*app.get('/', (req, res) => {
  res.send('Hello HTTPS!')
})*/

app.enable('trust proxy');

// Add a handler to inspect the req.secure flag (see 
// http://expressjs.com/api#req.secure). This allows us 
// to know whether the request was via http or https.

app.use (function (req, res, next) {
        if (req.secure) {
                // request was via https, so do no special handling
                next();
        } else {
                // request was via http, so redirect to https
                res.redirect('https://' + req.headers.host + req.url);
		//res.redirect('https://emaestro.istic.univ-rennes1.fr:80/' + req.url);
       }
});


// Allow static files in the /public directory to be served

app.use(express.static(__dirname + '/public'));


var methods = Object.create(null);

var server = https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
},function(request, response) {
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
    else {
        console.log('out routes')
        respond(405, "Method " + request.method + " not allowed on " + request.url);
    }

}).listen(process.env.PORT || 443);
console.log('Node server running on port 80');

/*var server = http.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
},app).listen(process.env.PORT || 80);
console.log('Node server running on port 80');*/

// Start listening on the port
/*var server = app.listen(80, function() {
        console.log('Listening on port %d', server.address().port);
});*/

function urlToPath(url) {
    var path = require("url").parse(url).pathname;
    console.log("URL -> path: " + path);
    var decodedPath = decodeURIComponent(path).substring(1);
    console.log("decoded path: " + decodedPath);
    return decodedPath;
}


var formidable = require('formidable');
methods.GET = function (path, respond) {
    fs.stat(path, function (error, stats) {
        console.log("GET path: " + path);
        if (error && error.code == "ENOENT")
            respond(404, "File not found");
        else if (error)
            respond(500, error.toString());
        else if (stats.isDirectory()) {
            console.log("readdir");
            fs.readdir(path, function (error, files) {
                if (error)
                    respond(500, error.toString());
                else
                    respond(200, '{"scores": ["' + files.join('", "') + '"]}');
            });
        } else {
//			respond(200, fs.readFileSync(path,"utf8") );
            console.log("readfile");
            respond(200, fs.createReadStream(path), require("mime").getType(path));
        }
    });
};

methods.DELETE = function (path, respond) {
    console.log("PATH is :", path);
    if (path) {
        if (fs.existsSync(path)) {
            try {
                fs.unlinkSync(path)
            } catch (err) {
                console.error("une erreur", err)
                respond(200, JSON.stringify({deleted: false}));
            }
            respond(200, JSON.stringify({deleted: true}));

        } else
            respond(200, JSON.stringify({deleted: false}));

    }
};

function respondErrorOrNothing(respond) {
    return function (error) {
        if (error)
            respond(500, error.toString());
        else
            respond(204);
    };
}


/*var mkdirp = require("mkdirp");*/
methods.PUT = function (path, respond, request) {
    var outStream = fs.createWriteStream(path);
    outStream.on("error", function (error) {
        respond(500, error.toString());
    });
    outStream.on("finish", function () {
        respond(204);
    });
    request.pipe(outStream);
}

var mkdirp = require('mkdirp');
mkdirp('/SCORES/test', function (err) {
});

var moveFile = require('move-file');
methods.POST = function (path, res, req) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (files.file && files.file.size > 0) {
            var oldpath = files.file.path;
            var newpath = './sons/' + files.file.name;
            moveFile(oldpath, newpath, function (err) {
                if (err) throw err;
                // res(200, JSON.parse({success : true}));
            });
            res(200, JSON.stringify({success: true}));
        } else {
            res(403);
        }
    });
}
console.log("Serveur : Ok");
