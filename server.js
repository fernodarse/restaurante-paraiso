const path = require('path');
const express = require('express');
const app = express();

app.use(express.static(__dirname+'/dist/restaurante-paraiso'));
app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/dist/restaurante-paraiso/index.html'));
});
app.get('/inicio', function(req, res){
    res.sendFile(__dirname + '/dist/restaurante-paraiso/index.html');
});
app.get('/admin', function(req, res){
    res.sendFile(__dirname + '/dist/restaurante-paraiso/index.html');
});
app.get('/login', function(req, res){
    res.sendFile(__dirname + '/dist/restaurante-paraiso/index.html');
});

app.listen(process.env.PORT || 8080);