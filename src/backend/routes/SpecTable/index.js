var express = require('express');
var routerSpecTable = express.Router();
var pool = require('../../mysql');



//adding a specialization to tables 
	/**
	 * body format:
	 * [{Spec: "Enfermeria de salud mental"}]
	 */

routerSpecTable.post('/', function(req, res) {
	console.log(req.body[0]);
    let received= JSON.stringify(req.body);    
    let received2 = JSON.parse(received)    
    let name=(received2[0].Spec);
    
    pool.query('INSERT INTO `SpecTable` ( `name`) \
				VALUES (?)',[name], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            console.log("error adding a specialization to the specialization table")
            return;
        }
        res.send(result);
        console.log("done adding a doctor to a medical table")
    });
});

//get specialization name 
routerSpecTable.get('/:id', function(req, res) {
    let idAb=req.params.id;   
    pool.query('Select name from SpecTable WHERE `SpecTable`.`id`= ? ',[idAb], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });    
});


//API for deleting specialization from the table of specialization

 routerSpecTable.delete('/:id', function(req, res) {
    let index=req.params.id;   
        
    pool.query(
        'DELETE FROM SpecTable \
        WHERE \
         `SpecTable`.`id` = ?;',[index], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result).status(202);
    });
	
});

module.exports = routerSpecTable;
