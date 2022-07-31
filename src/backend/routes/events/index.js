var express = require('express');
var eventsTable = express.Router();
var pool = require('../../mysql');



//filling the bedList
async function fillingScheduledJobs(){
     /*pool.query('Select * from Bed', function(err, result, fields) {
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

 //   BedsList.printBedlist();  */
}

//fillingBeds();
/**
 * Send to client all beds status information
*/
/*
routerBeds.get('/state/', function(req, res) {    
    var response = BedsList.getBedStats();    
    res.send(response);
 });

/**
 * Send to client all events information
*/

eventsTable.get('/', function(req, res) {
    pool.query('Select * from EventsTable', function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
});

/**
 * return  event  info filtered by pacient
 */

eventsTable.get('/:id', function(req, res) {
    idAb=req.params.id;   
    pool.query('Select * from EventsTable where pacientId=?',[idAb], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
});

//API for gettin active notes of a pacient by bedId
/*
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
/*
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
*/
//API for adding new Events 
/**
 *{"pacientId":1,
 *"type": "daily",
 *"note":"say hola",
 *"dateTime":"2022-07-20 11:39:51"
 *}
 */

 eventsTable.post('/', function(req, res) {    
    console.log("req:"+JSON.stringify(req.body))
    console.log(req.body);    
    let received=(JSON.stringify(req.body));       
    let received2=JSON.parse(received);
    
    let pacientId=parseInt(received2.pacientId);
    let stringTime=(received2.dateTime);
    let type =( received2.type);
    let note =( received2.note);
    

    pool.query(
        'INSERT INTO EventsTable(`pacientId`, `type`, `dateTime`, `note`) \
        VALUES (?,?,?,?)',[pacientId,type,stringTime,note], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            console.log("error");   
            return;
        }
        res.send(result).status(202);
        console.log("done");   
    });
    
    //res.status(202);

});

//API for editing events 
/**
 * body format: 
 *{"eventId":1,
 *"type": "daily",
 *"note":"say hola",
 *"dateTime":"2022-07-20 11:42:51"
 }
 */

 eventsTable.put('/:id', function(req, res) {
    console.log(req.body);    
    console.log(JSON.stringify(req.body));   
    let eventId=(req.params.id);
    let dateTime=(req.body.dateTime);    
    let type=(req.body.type);  
    let note =( req.body.note);

    console.log("eventId: " + eventId + " dateTime: " + dateTime + " type: " + type + "note:"+note)
        
    pool.query(
        'UPDATE EventsTable SET \
        `type` = ?,   \
        `dateTime` = ?, \
        `note` = ? \
        WHERE \
         `EventsTable`.`eventId` = ?;',[type,dateTime,note,eventId], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result).status(202);
    });

});

//API for deleting scheduled events
/**
 * body format: 
 * any
 */

 eventsTable.delete('/:id', function(req, res) {
    console.log(req.body);    
    let eventId=parseInt(req.params.id);
        
    pool.query(
        'DELETE FROM EventsTable        \
        WHERE \
         `EventsTable`.`eventId` = ?;',[eventId], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result).status(202);
    });

});

module.exports = eventsTable;