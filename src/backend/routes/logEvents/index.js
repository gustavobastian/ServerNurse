var express = require('express');
var eventsTable = express.Router();
var pool = require('../../mysql');



eventsTable.get('/', function(req, res) {
    pool.query('Select * from LogEvents ORDER BY logEventId DESC limit 100', function(err, result, fields) {
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
   
    res.send(401).status(401);

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
        else{
        res.send(result).status(202);
	}
    });

});

module.exports = eventsTable;
