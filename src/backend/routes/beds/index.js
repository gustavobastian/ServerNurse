var express = require('express');
var routerBeds = express.Router();
var pool = require('../../mysql');
var BedsList = require('../../Monitoring/Bed-mon');


//filling the bedList
async function fillingBeds(){
     pool.query('Select * from Bed', function(err, result, fields) {
        console.log("filling beds")
        if (err) {
            console.log("Error");
            return;
        }
        result.forEach(element => {  
            BedsList.addBed(element.bedId);      
            
        });    
        return;
        
    });

     pool.query('Select bedId from `Pacient`', function(err, result, fields) {
        console.log("filling bed status")
        if (err) {
            console.log("Error")
            return;
        }
        result.forEach(element => {        
            BedsList.setStatus(element.bedId,1);
        });    
        //UserList.printUserList();  
        return;
    });

 //   BedsList.printBedlist();  
}

fillingBeds();
/**
 * Send to client all beds status information
*/
routerBeds.get('/state/', function(req, res) {    
    var response = BedsList.getBedStats();    
    res.send(response);
 });

/**
 * Send to client all beds information
*/
routerBeds.get('/', function(req, res) {
    pool.query('Select * from Bed', function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
});

/**
 * return selected bed info 
 */
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
        pool.query(`Select * from Bed as b JOIN Pacient AS p ON b.bedId=p.bedId where b.bedId=?`,[idAb],   function(err, result, fields) {
      //pool.query('Select notesId,firstname,lastname,note, state from Bed as b JOIN Pacient AS p ON b.bedId=p.bedId JOIN NotesTable AS n ON p.notesTableId=n.notesTableId JOIN Notes AS nn ON n.noteId= nn.notesId WHERE nn.state= "activa" AND b.bedId=?',[idAb], function(err, result, fields) {      
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
    console.log("req:"+JSON.stringify(req.body))
    console.log(req.body);    
    let received=(JSON.stringify(req.body));       
    let received2=JSON.parse(received);
    
    let roomId=parseInt(received2.roomId);
    let callerId=parseInt(received2.callerId);
    let floorId =parseInt( received2.floorId);


    
    
    pool.query(
        'INSERT INTO Bed(`roomId`, `callerId`, `floorId`) \
        VALUES (?,?,?)',[roomId,callerId,floorId], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result).status(202);
        console.log("done");   
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
    console.log(JSON.stringify(req.body));   
    let bedId=parseInt(req.params.id);
    let roomId=parseInt(req.body.roomId);
    let callerId=parseInt(req.body.callerId);
    let floorId =parseInt( req.body.floorId);
        
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