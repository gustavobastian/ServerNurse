var express = require('express');
var routerStatistics = express.Router();
var pool = require('../../mysql');

/**
 * Send to client events counts by nurse
*/
routerStatistics.get('/promNurse', function(req, res) {        
    
    pool.query('SELECT userID,COUNT(*) as cn FROM `LogEvents` GROUP BY `LogEvents`.`userId` ASC ', function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result).status(202);
    });
 });
 /**
 * Send to client events counts by pacient
*/
routerStatistics.get('/promPacient', function(req, res) {    
    pool.query('SELECT pacientID,COUNT(*) as cn FROM `LogEvents` GROUP BY `LogEvents`.`pacientId` ASC ', function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result).status(202);
 });
});

 module.exports = routerStatistics;