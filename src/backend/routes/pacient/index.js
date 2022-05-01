var express = require('express');
var routerPacient = express.Router();
var pool = require('../../mysql');

//API for getting all Pacients information
routerPacient.get('/', function(req, res) {
    pool.query('Select * from Pacient', function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
});

//API for getting all  information for a single pacient
routerPacient.get('/:id', function(req, res) {
    idAb=req.params.id;   
    pool.query('Select * from Pacient where pacientId = ?',idAb, function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
});


//API for adding new  Pacient
/**
 * body format:
 * [{"pacientId":2, 
 * "firstname":"peter",
 * "lastname":"Frant",
 * "bedId":"3",
 * "notesTableId":"1",
 * "userTableId":"1"}]
 */

routerPacient.post('/', function(req, res) {
    console.log(req.body);
        
    let pacientId=req.body[0].pacientId;
    let firstname=req.body[0].firstname;
    let lastname=req.body[0].lastname;
    let bedId= (req.body[0].bedId);
    let notesTableId=(req.body[0].notesTableId);
    let usersTableId = (req.body[0].usersTableId);    


    pool.query(
        'INSERT INTO Pacient (`pacientId`, `firstName`, `lastName`, `bedId`, `notesTableId`, `userTableId`) \
        VALUES (?,?,?,?,?,?)',[pacientId,firstname,lastname,bedId,notesTableId,usersTableId], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result).status(202);
    });

    //res.send().status(202);
});


//API for editing a Pacient
/**
 * body format:
 * [{
 * [{"pacientId":2, 
 * "firstname":"peter",
 * "lastname":"Frant",
 * "bedId":"3",
 * "notesTableId":"1",
 * "userTableId":"1"}]
 */

 routerPacient.put('/:id', function(req, res) {
    

    
    let pacientId=parseInt(req.params.id);
    let firstname=req.body[0].firstname;
    let lastname=req.body[0].lastname;
    let bedId= (req.body[0].bedId);
    let notesTableId=(req.body[0].notesTableId);
    let usersTableId = (req.body[0].usersTableId);    

     

    pool.query(
        'UPDATE Pacient SET\
        `firstname` = ?, \
        `lastname` = ?, \
        `bedId` = ?, \
        `notesTableId` = ?, \
        `userTableId`= ? \
         WHERE \
         `Pacient`.`pacientId` = ?;',[firstname,lastname,bedId,notesTableId,usersTableId,pacientId], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result).status(202);
    });

    
    //res.send(OK);
});


//API for deleting Pacient
/**
 * body format: 
 * any
 */
 routerPacient.delete('/:id', function(req, res) {
    console.log(req.body);
    console.log(req.body[0].messageId);
    let pacientId=parseInt(req.params.id);
        
    pool.query(
        'DELETE FROM Pacient \
        WHERE \
         `Pacient`.`pacientId` = ?;',[pacientId], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result).status(202);
    });

});
module.exports = routerPacient;