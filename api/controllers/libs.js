'use strict';

var fs = require('fs');
var path = require('path');

module.exports = {
    fileserve: fileserve
};

function fileserve(req, res, next) {
    let folder = req.swagger.params.folder.value;
    let name = req.swagger.params.name.value;
    let file = path.join(__dirname, "..", "..", "node_modules", folder, name);

    if (req.url.indexOf('.html') != -1) {

        fs.readFile(file, function(err, data) {
            if (err) console.log(err);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        });

    }

    if (req.url.indexOf('.js') != -1) {

        fs.readFile(file, function(err, data) {
            if (err) console.log(err);
            res.writeHead(200, { 'Content-Type': 'text/javascript' });
            res.write(data);
            res.end();
        });

    }

    if (req.url.indexOf('.css') != -1) {

        fs.readFile(file, function(err, data) {
            if (err) console.log(err);
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.write(data);
            res.end();
        });

    }
}