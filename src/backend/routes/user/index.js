var express = require('express');
var routerUser = express.Router();
var pool = require('../../mysql');

//Devuelve un array de Usuarios
routerUser.get('/', function(req, res) {
    pool.query('Select * from User', function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
});

routerUser.get('/:id', function(req, res) {
    idAb=req.params.id;    
    pool.query('Select * from User where userId = ?',idAb, function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
});


//API for adding new  notes of a pacient by bedId
routerUser.post('/', function(req, res) {
    let request=(req.body);

    console.log(req.body);
    res.send(OK);
});

module.exports = routerUser;