/*
var PORT = 8080;

var http = require('http');
var server = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Hello World (mais en http)!');
    res.end () ;
    });
server.listen(PORT);

console.log('Server running on ' + PORT);

var io = require('socket.io');
var express = require('express');

var app = express.createServer();
app.configure(function(){
    app.use(express.static(__dirname + '/public'));
});
app.get('/', function(req, res, next){
    res.render('./emaestro.html');
});
app.listen(8333);
*/

var fs = require('fs');
var vm = require('vm');

eval(fs.readFileSync(__dirname + '/emaestro.html')+'');

/*fs.readFile('emaestro.html', function (err, html) {
    if (err) {
        throw err;
    }
});*/

var file = fileContent;
console.log(file);

fs.writeFile('./SCORES/test1.txt', "Test", function (err) {

    if (err) throw err;

    console.log('Fichier créé !');
});




