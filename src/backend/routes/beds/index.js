var express = require('express');
var routerBeds = express.Router();
var pool = require('../../mysql');

//Devuelve un array de beds
routerBeds.get('/', function(req, res) {
    pool.query('Select * from Bed', function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
});
//API for gettin active notes of a pacient by bedId
routerBeds.get('/pacient/:id', function(req, res) {
    idAb=req.params.id;   
    //pool.query('Select * from Bed as b JOIN Pacient AS p ON b.bedId=p.bedId JOIN NotesTable AS n ON p.notesTableId=n.notesTableId JOIN Notes AS nn ON n.noteId= n.noteId where b.bedId='+idAb, function(err, result, fields) {
        //pool.query(`Select * from Bed as b JOIN Pacient AS p ON b.bedId=p.bedId where b.bedId=`+idAb,   function(err, result, fields) {
      pool.query('Select firstname,lastname, note from Bed as b JOIN Pacient AS p ON b.bedId=p.bedId JOIN NotesTable AS n ON p.notesTableId=n.notesTableId JOIN Notes AS nn ON n.noteId= n.noteId WHERE nn.state= "activa" AND b.bedId='+idAb, function(err, result, fields) {      
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
});

module.exports = routerBeds;