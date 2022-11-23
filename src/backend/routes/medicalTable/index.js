var express = require('express');
var routerMedicalTable = express.Router();
var pool = require('../../mysql');



//adding a doctor to tables of a pacient from the hospital
	/**
	 * body format:
	 * [{"userTableId":1,
	 * "userId":2}]
	 */

routerMedicalTable.post('/', function(req, res) 
{
    let received= JSON.stringify(req.body);
    let received2 = JSON.parse(received)
    let userId= parseInt(received2[0].userID);
    let userTableId=parseInt(received2[0].userTableID);
	
    pool.query('INSERT INTO `MedicalTable` ( `userTableId`, `userId`) \
    VALUES (?, ?)',[userTableId,userId], function(err, result, fields) 
    {
        if (err) 
        {
            res.send(err).status(400);
            console.log("error adding a doctor to a medical table")
            return;
        }
        else
        {
            res.send(result);
            console.log("done adding a doctor to a medical table")
            return;
        }
    });
});
//Returns all users tables from the hospital
routerMedicalTable.get('/', function(req, res) 
{
    pool.query('Select * from MedicalTable ORDER BY medicalTableId DESC', function(err, result, fields) 
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

//Returns all users tables from one userTableId
routerMedicalTable.get('/:id', function(req, res) 
{
    let idAb=req.params.id;   
    pool.query('Select * from MedicalTable WHERE `MedicalTable`.`userTableId`= ? ',[idAb], function(err, result, fields) 
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

//Returns all users tables from one userTableId
routerMedicalTable.get('/single/', function(req, res) 
{
	
    let received= JSON.stringify(req.body);
    let received2 = JSON.parse(received)
    let userId= parseInt(received2[0].userID);
    let userTableId=parseInt(received2[0].userTableID);
    
    pool.query('Select * from MedicalTable WHERE \
    `MedicalTable`.`userTableId`= ? AND `MedicalTable`.`userId` ',[userTableId, userId], function(err, result, fields) 
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
//Returns all users tables from one userTableId
routerMedicalTable.get('/info/:id', function(req, res) 
{
    let idAb=req.params.id;   
    pool.query('\
    SELECT lastname, userId from MedicalTable JOIN User \
    USING (userId)\
    WHERE `MedicalTable`.`userTableId`= ? \
    ',[idAb], function(err, result, fields) 
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

//API for deleting doctor from the table of the pacient

/**
	 * body format:
	 * [{"userTableId":1,
	 * "userId":2}]
 */
 routerMedicalTable.delete('/:id', function(req, res) 
 {
    let index=req.params.id;   
    pool.query(
    'DELETE FROM MedicalTable \
    WHERE \
    `MedicalTable`.`medicalTableId` = ?;',[index], function(err, result, fields) 
    {
        if (err) 
        {
            res.send(err).status(400);
            return;
        }
        else{
            res.send(result).status(202);
            return;
        }
    });
});

module.exports = routerMedicalTable;
