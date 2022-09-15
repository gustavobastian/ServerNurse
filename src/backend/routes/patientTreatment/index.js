var express = require('express');
var routerPatientSpecTable = express.Router();
var pool = require('../../mysql');


//get all treatments 

routerPatientSpecTable.get('/all', function(req, res) {    
    console.log("here")
    pool.query('Select * from PatientSpecTable INNER JOIN SpecTable on SpecTable.id = PatientSpecTable.specId limit 10', function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        console.log(result)
        res.send(result);
    });    
});


//get all single patient's treatments
routerPatientSpecTable.get('/:id', function(req, res) {    
    let idAb=req.params.id;   
    pool.query('Select * from PatientSpecTable INNER JOIN SpecTable on SpecTable.id = PatientSpecTable.specId  WHERE patientId=?',[idAb], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }        
        console.log(result)
        res.send(result);
    });    
});

//get all single patient's treatments from bedId
routerPatientSpecTable.get('/bed/:id', function(req, res) {    
    let idAb=req.params.id;   
    pool.query('Select Bed.bedId,PatientSpecTable.specId from PatientSpecTable \
    JOIN SpecTable on SpecTable.id = PatientSpecTable.specId  \
    JOIN Pacient on Pacient.pacientId = PatientSpecTable.patientId  \
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
	 * [{ specId: 1,  patientId:}]
	 */
    //INSERT INTO `NurseSpecTable` (`nurseSpecId`, `userID`, `specID`) VALUES (NULL, '8', '1')


routerPatientSpecTable.post('/', function(req, res) {
	console.log(req.body[0]);
    let received= JSON.stringify(req.body);    
    let received2 = JSON.parse(received)    
    let specID=(received2[0].specId);
    let patientID=(received2[0].patientId);
    
    pool.query('INSERT INTO `PatientSpecTable` ( `patientId`,`specID`)  \
				VALUES (?,?)',[patientID,specID], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            console.log("error adding a treatment to a pacient ")
            return;
        }
        res.send(result);
        console.log("done adding a treatment to a pacient")
    });
});



//API for aletring treatment from the table of treatment

routerPatientSpecTable.put('/', async function(req, res) {
	console.log("making a put")
	console.log(req.body);
    let received= JSON.stringify(req.body);    
    let received2 = JSON.parse(received)    
    let specID=parseInt(received2.specId);
    let patientID=parseInt(received2.patientId);
    console.log("patientID:"+patientID.toString()+"|specID:"+specID.toString())
    //UPDATE `PatientSpecTable` SET `specId` = '4' WHERE `PatientSpecTable`.`patientSpecId` = 4;
    
    await pool.query('UPDATE `PatientSpecTable` SET `specId`=?  \
				WHERE `patientId`= ?',[specID,patientID], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            console.log("error adding a treatment to a pacient ")
            return;
        }
        else{
        res.send(result);
        console.log("done adding a treatment to a pacient")}
    });
});



//API for deleting specialization from the table of specialization

routerPatientSpecTable.delete('/:id', function(req, res) {
    let index=req.params.id;           
    pool.query(
        'DELETE FROM PatientSpecTable \
        WHERE \
         `PacientSpecTable`.`patientSpecId` = ?;',[index], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result).status(202);
    });
	
});

module.exports = routerPatientSpecTable;
