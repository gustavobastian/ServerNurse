var express = require('express');
var routerBeds = express.Router();
var pool = require('../../mysql');

//Returns all beds from the hospital
routerBeds.get('/', function(req, res) {
    pool.query('Select * from Bed', function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
});

//Returns all beds from the hospital
routerBeds.get('/:id', function(req, res) {
    idAb=req.params.id;   
    pool.query('Select * from Bed where bedId=?',[idAb], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
});

//API for gettin active notes of a pacient by bedId
routerBeds.get('/pacient/notes/:id', function(req, res) {
    idAb=req.params.id;   
    //pool.query('Select * from Bed as b JOIN Pacient AS p ON b.bedId=p.bedId JOIN NotesTable AS n ON p.notesTableId=n.notesTableId JOIN Notes AS nn ON n.noteId= n.noteId where b.bedId='+idAb, function(err, result, fields) {
        //pool.query(`Select * from Bed as b JOIN Pacient AS p ON b.bedId=p.bedId where b.bedId=`+idAb,   function(err, result, fields) {
      pool.query('Select noteId,firstname,lastname,note, state from Bed as b JOIN Pacient AS p ON b.bedId=p.bedId JOIN NotesTable AS n ON p.notesTableId=n.notesTableId JOIN Notes AS nn ON n.noteId= n.noteId WHERE nn.state= "activa" AND b.bedId='+idAb, function(err, result, fields) {      
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
});


//API for post active notes of a pacient by bedId 
/**
 * params body: example 1:{[{"noteId":"1"},{"state":"desactivada"}]}, example 2:[{"noteId":"1"},{"state":"activada"}]
 */
routerBeds.post('/pacient/notes/activation/:id', function(req, res) {
    idAb=req.params.id;
    let noteId= req.body[0].noteId;
    let newState= req.body[1].state;  
    console.log(req.body[0].noteId);
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

//API for adding new beds 
/**
 * body format:
 * [{"roomId":1,
 * "callerId":1,
 * "floorId":"1"}]
 */
 routerBeds.post('/', function(req, res) {
    console.log(req.body);
    console.log(req.body[0].messageId);    
    let roomId=req.body[0].roomId;
    let callerId=req.body[0].callerId;
    let floorId = req.body[0].floorId;
    
    
    pool.query(
        'INSERT INTO Bed(`roomId`, `callerId`, `floorId`) \
        VALUES (?,?,?)',[roomId,callerId,floorId], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result).status(202);
    });
    
    //res.status(202);

});

//API for editing beds 
/**
 * body format: 
 * [{"roomId":"2", "callerId":"17", "floorId":"1"}]
 */
 routerBeds.put('/:id', function(req, res) {
    console.log(req.body);
    console.log(req.body[0].messageId);
    let bedId=parseInt(req.params.id);
    let roomId=parseInt(req.body[0].roomId);
    let callerId=parseInt(req.body[0].callerId);
    let floorId =parseInt( req.body[0].floorId);
        
    pool.query(
        'UPDATE Bed SET \
        `roomId` = ?,   \
        `callerId` = ?, \
        `floorId` = ? \
        WHERE \
         `Bed`.`bedId` = ?;',[roomId,callerId,floorId, bedId], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result).status(202);
    });

});

//API for deleting beds
/**
 * body format: 
 * any
 */
 routerBeds.delete('/:id', function(req, res) {
    console.log(req.body);
    console.log(req.body[0].messageId);
    let bedId=parseInt(req.params.id);
        
    pool.query(
        'DELETE FROM Bed \
        WHERE \
         `Bed`.`bedId` = ?;',[bedId], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result).status(202);
    });

});

module.exports = routerBeds;