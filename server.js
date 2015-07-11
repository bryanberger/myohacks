var fs = require('fs'),
    express = require('express'),
    app = express(),
    http = require('http').Server(app),
    _ = require('underscore');


app.use('/assets',express.static(__dirname + '/assets'));
app.use('/lib',express.static(__dirname + '/lib'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});