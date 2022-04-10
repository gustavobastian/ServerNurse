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

routerBeds.get('/pacient/:id', function(req, res) {
    idAb=req.params.id;   
    pool.query('Select * from Bed as b JOIN Pacient AS p ON b.bedId=p.bedId JOIN NotesTable AS n ON p.notesTableId=n.notesTableId JOIN Notes AS nn ON n.noteId= n.noteId where b.bedId='+idAb, function(err, result, fields) {
        //pool.query(`Select * from Bed as b JOIN Pacient AS p ON b.bedId=p.bedId where b.bedId=`+idAb,   function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
});

module.exports = routerBeds;