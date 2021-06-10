const http = require('http');
const fs = require('fs');


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
    else{
        console.log('out routes')
        respond(405, "Method " + request.method + " not allowed on " + request.url );
    }

}).listen(process.env.PORT || 8000);
console.log('Node server running on port 80');

function urlToPath(url) {
    var path = require("url").parse(url).pathname;
    console.log("URL -> path: " + path);
    var decodedPath = decodeURIComponent(path).substring(1);
    console.log("decoded path: " + decodedPath);
    return decodedPath;
}



var formidable = require('formidable');
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


/*var mkdirp = require("mkdirp");*/
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

var mkdirp = require('mkdirp');
mkdirp('/SCORES/test', function (err) {
});

var moveFile = require('move-file');
methods.POST = function(path, res, req) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        console.log('files uploaded', files)
        if (files.file && files.file.size > 0){
            var oldpath = files.file.path;
            var newpath = './sons/' + files.file.name;
            console.log('hello file',newpath);
            moveFile(oldpath, newpath, function (err) {
                if (err) throw err;

                // res(200, JSON.parse({success : true}));
            });
            res(200,JSON.stringify({success : true}));
        }
        else {res(403);}
    });
}
console.log("Serveur : Ok");
