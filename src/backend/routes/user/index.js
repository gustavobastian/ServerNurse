var express = require('express');
var routerUser = express.Router();
var pool = require('../../mysql');

//Devuelve un array de Usuarios
routerUser.get('/', function(req, res) {
    pool.query('Select * from User', function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
});

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



routerUser.put('/', function(req, res) {
    let request=(req.body);

    console.log(req.body);
    res.send(OK);
});
module.exports = routerUser;