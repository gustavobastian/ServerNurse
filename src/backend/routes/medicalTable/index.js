var express = require('express');
var routerMedicalTable = express.Router();
var pool = require('../../mysql');

//Returns all users tables from the hospital
routerMedicalTable.get('/', function(req, res) {
    pool.query('Select * from MedicalTable', function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
});

//Returns all users tables from one userTableId
routerMedicalTable.get('/:id', function(req, res) {
    let idAb=req.params.id;   
    pool.query('Select * from MedicalTable WHERE `MedicalTable`.`userTableId`= ? ',[idAb], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });    
});

//Returns all users tables from one userTableId
routerMedicalTable.get('/info/:id', function(req, res) {
    let idAb=req.params.id;   
    pool.query('\
    SELECT lastname, userId from MedicalTable JOIN User \
     USING (userId)\
    WHERE `MedicalTable`.`userTableId`= ? \
    ',[idAb], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
  
});
module.exports = routerMedicalTable;