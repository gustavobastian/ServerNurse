var express = require('express');
var routerPacient = express.Router();
var pool = require('../../mysql');

//Devuelve un array de Pacientes
routerPacient.get('/', function(req, res) {
    pool.query('Select * from Pacient', function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
});

module.exports = routerPacient;