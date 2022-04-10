var express = require('express');
var routerBeds = express.Router();
var pool = require('../../mysql');

//Devuelve un array de Usuarios
routerBeds.get('/', function(req, res) {
    pool.query('Select * from Bed', function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
});

module.exports = routerBeds;