var express = require('express')
var stylus = require('stylus')
var nib = require('nib')

var app = express()

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}

app.use(express.static(__dirname + '/public'))

app.listen(3000)
