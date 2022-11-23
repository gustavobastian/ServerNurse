var express = require('express');
var routerStatistics = express.Router();
var pool = require('../../mysql');

/**
 * Send to client events counts by nurse
*/
routerStatistics.get('/promNurse', function(req, res) 
{        
    pool.query('SELECT userID,COUNT(*) as cn FROM `LogEvents` GROUP BY `LogEvents`.`userId` ASC ', function(err, result, fields) 
    {
        if (err) 
        {
            res.send(err).status(400);
            return;
        }
        else
        {
            res.send(result).status(202);
            return;
        }
        
    });
});
 /**
 * Send to client events counts by patient
*/
routerStatistics.get('/promPatient', function(req, res) {    
    pool.query('SELECT patientId,COUNT(*) as cn FROM `LogEvents` GROUP BY `LogEvents`.`patientId` ASC ', function(err, result, fields) 
    {
        if (err) 
        {
            res.send(err).status(400);
            return;
        }
        else
        {
            res.send(result).status(202);
            return;
        }
        
    });
});
/**
 * Send to client the number of patients with same treatment
 * 
*/
routerStatistics.get('/promTreatment', function(req, res) 
{    
    console.log("asking for list of treatment")
    pool.query('SELECT SpecTable.name,COUNT(*) as cn FROM `PatientSpecTable` \
    JOIN SpecTable on SpecTable.id=`PatientSpecTable`.`specId`\
    GROUP BY `PatientSpecTable`.`specId` ASC ', function(err, result, fields) 
    {
        if (err) 
        {
            res.send(err).status(400);
            return;
        }
        else
        {
            res.send(result).status(202);
            return;
        }
    });
});
/**
 * Send to client the number of patients with same treatment
 *
*/
routerStatistics.get('/promNurseSpec', function(req, res) 
{    
    console.log("asking for list of treatment")
    pool.query('SELECT SpecTable.name,COUNT(*) as cn FROM `NurseSpecTable` \
    JOIN SpecTable on SpecTable.id=`NurseSpecTable`.`specId`\
    GROUP BY `NurseSpecTable`.`specId` ASC ', function(err, result, fields) 
    {
        if (err) 
        {
            res.send(err).status(400);
            return;
        }
        else
        {
            res.send(result).status(202);
            return;
        }
    });
});

 module.exports = routerStatistics;
