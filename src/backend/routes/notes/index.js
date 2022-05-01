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

//API for adding new  notes for a pacient pacient by 
routerNotes.post('/', function(req, res) {
    let request=(req.body);

    console.log(req.body);
    res.send(OK);
});

//API for post activate/deactivate notes of a pacient by noteID
/**
 * params body: example 1:{[{"state":"desactivada"}]}, example 2:[{"state":"activada"}]
 */
 routerNotes.post('/activation/:id', function(req, res) {    
    let noteId= req.params.id;
    let newState= req.body[0].state;  
    console.log(noteId);
    if (newState == "activa")
        {
         pool.query('UPDATE Notes SET state = "activa" WHERE notesId=?',[noteId],function(err, result, fields){
            if (err) {
                res.send(err).status(400);
                return;
            }        
            res.send(result)
        })}
    else if (newState == "desactiva")    
    {pool.query('UPDATE Notes SET state = "desactiva" WHERE notesId=?',[noteId],function(err, result, fields){
        if (err) {
            res.send(err).status(400);
            return;
        }    
        res.send(result)
    })}
    else {
        res.send("state not valid")};
    
  
});


module.exports = routerNotes;