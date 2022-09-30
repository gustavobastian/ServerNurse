var express = require('express');
var routerUser = express.Router();
var pool = require('../../mysql');
const bcrypt = require("bcrypt");

var UserList = require('../../Monitoring/User-mon');




//filling the userList
async function fillingUserSt(){
    UserList.UserList=[{id:0,st:0}]; 
pool.query('Select * from User', function(err, result, fields) {
    if (err) {
        res.send(err).status(400);
        return;
    }
    result.forEach(element => {
        UserList.addUser(element.userId);
    });    
    //UserList.printUserList();
   
});

}
//filling users Status
fillingUserSt();
//API for getting all users information
routerUser.get('/', function(req, res) {
    
    pool.query('Select * from User', function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }        
        UserList.printUserList();
        res.send(result);
    });
});


//API for getting the list of userStates
routerUser.get('/state', function(req, res) {
    
        let result=UserList.getUserStats();
        res.send(result);
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
 * {"username":"peter",
 * "firstname":"peter",
 * "lastname":"Frant",
 * "occupation":"medico",
 * "state":"1",
 * "password":"123456"}
 */
routerUser.post('/', async function(req, res) {
    console.log("here");
    console.log(req.body);
    let d= JSON.stringify(req.body);
    console.log("body:"+d);  
    let user= JSON.parse(d); 
    console.log("user:"+user._username);
    /*console.log(req.body[0].messageId);    
    let username=req.body[0].username;
    let firstname=req.body[0].firsstname;
    let lastname=req.body[0].lastname;
    let occupation=req.body[0].occupation;
    let state = req.body[0].state;
    let password = req.body[0].password;*/
    let username=user._username;
    let firstname=user._firstname;
    let lastname=user._lastname;
    let occupation=user._occupation;
    let state = user._state;
    let password2=user._password;

     


     let password = await bcrypt.hash(password2, 12);
  /*  console.log(userId);
    console.log(occupation);
    console.log(lastname);*/

    await pool.query(
        'INSERT INTO User( `username`, `firstname`, `lastname`, `occupation`, `state`, `password`) \
        VALUES (?,?,?,?,?,?)',[username,firstname,lastname,occupation,state,password], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            console.log("error:"+err);
            return;
        }
        else{
        res.send(result).status(202);
        fillingUserSt();
        }
    });

    
});


//API for editing a user
/**
 * body format:
 * {
 * "username":"peter",
 * "firstname":"peter",
 * "lastname":"Frant",
 * "occupation":"medico",
 * "state":"1",
 * "password":"123456"}
 */

routerUser.put('/:id', async function(req, res) {
    console.log("altering User")
    let d= JSON.stringify(req.body);
    console.log("body:"+d);  
    let user= JSON.parse(d); 
    console.log("user:"+user.username);

    let userId= parseInt(req.params.id); 
    let username=user.username;
    let firstname=user.firstname;
    let lastname=user.lastname;
    let occupation=user.occupation;
    let state = user.state;
    let password2 =user.password;
    
    //hashing password
    let password = await bcrypt.hash(password2, 12);

    
   

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
        else{
        res.send(result).status(202);}
    });

    
   // res.send(202);
});


//API for deleting user
/**
 * body format: 
 * any
 */
 routerUser.delete('/:id', function(req, res) {
    console.log(req.body);
    //console.log(req.body[0].messageId);
    let userId=parseInt(req.params.id);
        
    pool.query(
        'DELETE FROM User \
        WHERE \
         `User`.`userId` = ?;',[userId], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        else{
        res.send(result).status(202);
        fillingUserSt();
        }
    });

});

module.exports = routerUser;
