var express = require('express');
var routerMessages = express.Router();
var pool = require('../../mysql');

//Devuelve un array de Pacientes
routerMessages.get('/', function(req, res) {
    pool.query('Select * from Messages', function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
});

module.exports = routerMessages;