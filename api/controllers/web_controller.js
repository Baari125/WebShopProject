'use strict';

var fs = require('fs');
var path = require('path');

module.exports = {
    homepage: homepage,
};

function homepage(req, res, next) {
    let file = path.join(__dirname, "..", "..", "html", "homepage.html");
    let contents = fs.readFileSync(file, 'utf8');
    res.send(contents);
}