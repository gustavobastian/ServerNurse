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

routerPacient.get('/:id', function(req, res) {
    idAb=req.params.id;   
    pool.query('Select * from Pacient where pacientId = ?',idAb, function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
});

//API for adding new  Pacient of a pacient by bedId
routerPacient.post('/', function(req, res) {
    let request=(req.body);

    console.log(req.body);
    res.send(OK);
});

module.exports = routerPacient;