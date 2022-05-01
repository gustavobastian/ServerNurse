var express = require('express');
var routerUser = express.Router();
var pool = require('../../mysql');

//API for getting all users information
routerUser.get('/', function(req, res) {
    pool.query('Select * from User', function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
});

//API for getting a user information
routerUser.get('/:id', function(req, res) {
    idAb=req.params.id;    
    pool.query('Select * from User where userId = ?',idAb, function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
});


//API for adding new  user
/**
 * body format:
 * [{"userId":2,
 * "username":"peter",
 * "firstname":"peter",
 * "lastname":"Frant",
 * "occupation":"medico",
 * "state":"1",
 * "password":"123456"}]
 */
routerUser.post('/', function(req, res) {
    
    console.log(req.body);
    console.log(req.body[0].messageId);
    let userId=req.body[0].userId;
    let username=req.body[0].username;
    let firstname=req.body[0].firstname;
    let lastname=req.body[0].lastname;
    let occupation=req.body[0].occupation;
    let state = req.body[0].state;
    let password = req.body[0].password;
    

  /*  console.log(userId);
    console.log(occupation);
    console.log(lastname);*/

    pool.query(
        'INSERT INTO User(`userId`, `username`, `firstname`, `lastname`, `occupation`, `state`, `password`) \
        VALUES (?,?,?,?,?,?,?)',[userId,username,firstname,lastname,occupation,state,password], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result).status(202);
    });

    
});


//API for editing a user
/**
 * body format:
 * [{
 * "username":"peter",
 * "firstname":"peter",
 * "lastname":"Frant",
 * "occupation":"medico",
 * "state":"1",
 * "password":"123456"}]
 */

routerUser.put('/:id', function(req, res) {
    

    let userId= parseInt(req.params.id); 
    let username=req.body[0].username;
    let firstname=req.body[0].firstname;
    let lastname=req.body[0].lastname;
    let occupation=req.body[0].occupation;
    let state = req.body[0].state;
    let password = req.body[0].password;
    
    //UPDATE Notes SET state = "activa" WHERE notesId=?
  /*  console.log(userId);
    console.log(occupation);
    console.log(lastname);*/

    pool.query(
        'UPDATE User SET\
        `username` = ?,   \
        `firstname` = ?, \
        `lastname` = ?, \
        `occupation` = ?, \
        `state` = ?, \
        `password`= ? \
         WHERE \
         `User`.`userId` = ?;',[username,firstname,lastname,occupation,state,password,userId], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result).status(202);
    });

    
    //res.send(OK);
});
module.exports = routerUser;