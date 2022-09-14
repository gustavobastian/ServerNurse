var express = require('express');
var routerPacientSpecTable = express.Router();
var pool = require('../../mysql');


//get all treatments 

routerPacientSpecTable.get('/all', function(req, res) {    
    console.log("here")
    pool.query('Select * from PacientSpecTable INNER JOIN SpecTable on SpecTable.id = PacientSpecTable.specId limit 10', function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        console.log(result)
        res.send(result);
    });    
});


//get all single pacient's treatments
routerPacientSpecTable.get('/:id', function(req, res) {    
    let idAb=req.params.id;   
    pool.query('Select * from PacientSpecTable INNER JOIN SpecTable on SpecTable.id = PacientSpecTable.specId  WHERE pacientId=?',[idAb], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }        
        console.log(result)
        res.send(result);
    });    
});

//get all single pacient's treatments from bedId
routerPacientSpecTable.get('/bed/:id', function(req, res) {    
    let idAb=req.params.id;   
    pool.query('Select Bed.bedId,PacientSpecTable.specId from PacientSpecTable \
    JOIN SpecTable on SpecTable.id = PacientSpecTable.specId  \
    JOIN Pacient on Pacient.pacientId = PacientSpecTable.pacientId  \
    JOIN Bed on Bed.bedId = Pacient.bedId  \
    WHERE Pacient.pacientId=? limit 1',[idAb], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }        
        console.log(result)
        res.send(result);
    });    
});




//adding a specialization to tables 
	/**
	 * body format:
	 * [{ specId: 1,  pacientId:}]
	 */
    //INSERT INTO `NurseSpecTable` (`nurseSpecId`, `userID`, `specID`) VALUES (NULL, '8', '1')


routerPacientSpecTable.post('/', function(req, res) {
	console.log(req.body[0]);
    let received= JSON.stringify(req.body);    
    let received2 = JSON.parse(received)    
    let specID=(received2[0].specId);
    let pacientID=(received2[0].pacientId);
    
    pool.query('INSERT INTO `PacientSpecTable` ( `pacientId`,`specID`)  \
				VALUES (?,?)',[pacientID,specID], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            console.log("error adding a treatment to a pacient ")
            return;
        }
        res.send(result);
        console.log("done adding a treatment to a pacient")
    });
});




//API for deleting specialization from the table of specialization

routerPacientSpecTable.delete('/:id', function(req, res) {
    let index=req.params.id;           
    pool.query(
        'DELETE FROM PacientSpecTable \
        WHERE \
         `PacientSpecTable`.`pacientSpecId` = ?;',[index], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result).status(202);
    });
	
});

module.exports = routerPacientSpecTable;
