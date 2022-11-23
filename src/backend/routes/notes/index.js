var express = require('express');
var routerNotes = express.Router();
var pool = require('../../mysql');

//Devuelve todas las notas
routerNotes.get('/', function(req, res) 
{
    pool.query('Select * from Notes', function(err, result, fields) 
    {
        if (err) 
        {
            res.send(err).status(400);
            return;
        }
        else
        {
            res.send(result);
            return;
        }
    });
});

//API for adding new  notes for a pacient, for now only medicals using mobile app can do it 
routerNotes.post('/', function(req, res) 
{
    res.send().status(404);
});

//API for post activate/deactivate notes of a pacient by noteID
/**
 * params body: example 1:{[{"state":"desactivada"}]}, example 2:[{"state":"activada"}]
 */
 routerNotes.post('/activation/:id', function(req, res) 
 {    
    let noteId= req.params.id;
    let newState= req.body[0].state;  
    console.log(noteId);
    if (newState == "activa")
    {
         pool.query('UPDATE Notes SET state = "activa" WHERE notesId=?',[noteId],function(err, result, fields)
         {
            if (err) 
            {
                res.send(err).status(400);
                return;
            }        
            else
            {
                res.send(result)
                return;
            }
        })
    }
    else if (newState == "desactiva")    
    {
        pool.query('UPDATE Notes SET state = "desactiva" WHERE notesId=?',[noteId],function(err, result, fields)
        {
            if (err) 
            {
                res.send(err).status(400);
                return;
            }
            else 
            {    
                res.send(result)
                return;
            }
        })
    }
    else 
    {
        res.send("state not valid")
        return;
    };
});

module.exports = routerNotes;