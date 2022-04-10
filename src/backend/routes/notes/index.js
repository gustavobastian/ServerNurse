var express = require('express');
var routerNotes = express.Router();
var pool = require('../../mysql');

//Devuelve un array de Usuarios
routerNotes.get('/', function(req, res) {
    pool.query('Select * from Notes', function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
});

module.exports = routerNotes;