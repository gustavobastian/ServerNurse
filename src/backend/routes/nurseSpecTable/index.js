var express = require('express');
var routerNurseSpecTable = express.Router();
var pool = require('../../mysql');


//get all single user specialization  
routerNurseSpecTable.get('/:id', function(req, res) {    
    let idAb=req.params.id;   
    pool.query('Select NurseSpecTable.nurseSpecId, SpecTable.Name, NurseSpecTable.specId  \
    from NurseSpecTable INNER JOIN SpecTable on SpecTable.id= NurseSpecTable.specId \
    WHERE userId=?',[idAb], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });    
});


//get all user specialization  
routerNurseSpecTable.get('/', function(req, res) {    
    pool.query('Select * from NurseSpecTable ', function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });    
});


//adding a specialization to tables 
	/**
	 * body format:
	 * [{ specId: 1,  userId:}]
	 */
    //INSERT INTO `NurseSpecTable` (`nurseSpecId`, `userID`, `specID`) VALUES (NULL, '8', '1')


routerNurseSpecTable.post('/', function(req, res) {
	console.log(req.body[0]);
    let received= JSON.stringify(req.body);    
    let received2 = JSON.parse(received)    
    let specID=(received2[0].specId);
    let userID=(received2[0].userId);
    
    pool.query('INSERT INTO `NurseSpecTable` ( `userID`,`specID`)  \
				VALUES (?,?)',[userID,specID], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            console.log("error adding a specialization to the nurse ")
            return;
        }
        res.send(result);
        console.log("done adding a spec to a nurse")
    });
});




//API for deleting specialization from the table of specialization

routerNurseSpecTable.delete('/:id', function(req, res) {
    let index=req.params.id;           
    pool.query(
        'DELETE FROM NurseSpecTable \
        WHERE \
         `NurseSpecTable`.`nurseSpecId` = ?;',[index], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result).status(202);
    });
	
});

module.exports = routerNurseSpecTable;
