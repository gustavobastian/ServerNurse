var express = require('express');
var eventsTable = express.Router();
var pool = require('../../mysql');



eventsTable.get('/', function(req, res) {
    pool.query('Select * from LogEvents ORDER BY logEventId DESC ', function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
});

/**
 * return  events  info filtered by pacient
 */

eventsTable.get('/patient/:id', function(req, res) {
    idAb=req.params.id;   
    pool.query('Select * from LogEvents where patientId=?',[idAb], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
});
/**
 * return  events  info filtered by nurse who attended
 */

 eventsTable.get('/userId/:id', function(req, res) {
    idAb=req.params.id;   
    pool.query('Select * from LogEvents where userId=?',[idAb], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
});
/**
 * return  events  info filtered by id who attended
 */

 eventsTable.get('/event/:id', function(req, res) {
    idAb=req.params.id;   
    pool.query('Select * from LogEvents where logEventId=?',[idAb], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
});


//API for adding new Events 
/**
 *{"patientId":1,
 *"type": "daily",
 *"note":"say hola",
 *"dateTime":"2022-07-20 11:39:51"
 *}
 */

 eventsTable.post('/', function(req, res) { 
    console.log(" post log event"   )
    console.log("req:"+JSON.stringify(req.body))
    console.log(req.body);    
    let received=(JSON.stringify(req.body));       
    let received2=JSON.parse(received);
    
    let patientId=parseInt(received2._patientId);
    let date_int_init=(received2._dateTimeInit);
    let date_int_finish=(received2._dateTimeFinish);
    let stringTimeInit=JSON.parse(date_int_init);
    let stringTimeFinish=JSON.parse(date_int_finish);
    let userId=parseInt(received2._userId);
    let type =( received2._type);
    console.log("tipo:"+type);
    let note =( received2._note);
    console.log("nota:"+note);
    let note2 =( received2._note2);
    console.log("nota:"+note);
    //console.log("datetime:"+JSON.parse(stringTime));
/*
    pool.query(
        'INSERT INTO LogEvents(`patientId`, `type`, `dateTime`, `note`) \
        VALUES (?,?,?,?)',[patientId,type,stringTime,note], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            console.log("error"+err);   
            return;
        }
        res.send(result).status(202);
        console.log("done");   
    });
  */  
    //res.status(202);

});



//API for deleting logged events
/**
 * body format: 
 * any
 */

 eventsTable.delete('/:id', function(req, res) {
    console.log(req.body);    
    let eventId=parseInt(req.params.id);
        
    pool.query(
        'DELETE FROM LogEvents        \
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
