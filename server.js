
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
}).listen(process.env.PORT || 8000);
console.log('Node server running on port 8000');

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
/*
methods.POST = function(path, respond, request) {
const express=require('express');
const upload=require('express-fileupload');
const app=express()
app.use(upload())

app.post('/',(req,res)=>{
 if(req.files){

    var file=req.files.file
       var filename =file.name
        file.mv('./upload/'+filename,function(err){
            if(err){

                res.send("error occured")
            }
            else
            {
                res.send("done!")
            }
        })

 }

})
}
 methods.POST = function() {

    const express=require('express');
    const upload=require('express-fileupload');
    const app=express()
    app.use(upload())

    app.post('/',(req,res)=>{
     if(req.files){

        var file=req.files.filename,
            filename=files.filename;
            files.mv("/upload/"+filename,function(err){
                if(err){
                    console.log(err)
                    res.send("error occured")
                }
                else
                {
                    res.send("done!")
                }
            })

           console.log(req.files)
     }

    })

};

*/



console.log("Serveur : Ok");
