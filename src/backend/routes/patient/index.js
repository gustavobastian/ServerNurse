var express = require('express');
var routerPatient = express.Router();
var pool = require('../../mysql');

//API for getting all Pacients information
routerPatient.get('/', function(req, res) {
    pool.query('Select * from Pacient', function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
});

//API for getting all  information for a single pacient
routerPatient.get('/:id', function(req, res) {
    idAb=req.params.id;   
    pool.query('Select * from Pacient where pacientId = ?',idAb, function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
});

/*
 * query for getting doctors from pacient id
 * SELECT userId, username from `Pacient` as p JOIN `MedicalTable` as MT JOIN `User` as us ON p.userTableId=MT.userTableId AND MT.userId=us.userID Where p.pacientId=1;
 * 
 * */
 
//API for adding new  Pacient
/**
 * body format:
 * [{"pacientId":2, 
 * "firstname":"peter",
 * "lastname":"Frant",
 * "bedId":"3",
 * "notesTableId":"1",
 * "userTableId":"1"}]
 */

routerPatient.post('/', async function(req, res) {
    console.log(req.body);
    let received= JSON.stringify(req.body);
    console.log("firstname rev:"+received);
    let pacientId=req.body._pacientId;

    
    
    let firstname=req.body._firstName;
    console.log("firstname:"+firstname);
    let lastname=req.body._lastName;
    console.log("lastname:"+lastname);
    let bedId= (req.body._bedId);
    console.log("bedid:"+bedId);
    let notesTableId=(req.body._pacientId);
    let usersTableId = (req.body._userTableId);   
    let output; 
    
    
    
    //transaction for inserting a new pacient, generating new userTable and new notesTable


    pool.getConnection(function(err, connection)  {
        if (err) {return;}            
        connection.beginTransaction(function(err){
            if(err){
                connection.roolback(function(err){
                    connection.release();
                    res.send().status(400);
                });
            }
            else
                {   
                     connection.query('SELECT notesTableId FROM `NotesTable` ORDER BY notesTableId DESC LIMIT 1',function(err, result)
                     {
                        if (err) {
                            connection.rollback(function(err){
                                console.log("error 1");connection.release();res.send().status(400);
                            })                            
                        }       
                        else{
                            //generating a new notestable 
                            notesTableId=parseInt(JSON.stringify(result[0].notesTableId))+1;
                            console.log("notesTableId: " + JSON.stringify(notesTableId));
                            output= notesTableId;
                                         
                                   connection.query(
                                    'INSERT INTO NotesTable (`notesTableId`) \
                                    VALUES (?)',[output], 
                                    function(err, result, fields) {
                                    if (err) {
                                        console.log("received:" +output);
                                        console.log("err:" +err);
                                        connection.rollback(function(err){console.log("error 2");connection.release();res.send().status(400);
                                        })                            
                                    }       
                                    else{
                                        connection.commit(function(err){
                                            if(err){
                                                connection.rollback(function(err){connection.release();console.log("error 3");res.send().status(400); })                            
                                            }
                                        })
                                        //generating a new userTable
                                        connection.query('SELECT userTableId FROM `UsersTable` ORDER BY userTableId DESC LIMIT 1',function(err, result){
                                            if (err) {
                                                connection.rollback(function(err){console.log("error 7");connection.release();res.send().status(400);
                                                })                            
                                            }       
                                            else{
                                                //generating a new notestable 
                                                userTableId=parseInt(JSON.stringify(result[0].userTableId))+1;
                                                console.log("userTableId: " + JSON.stringify(userTableId));
                                                output= userTableId;
                                                             
                                                       connection.query(
                                                        'INSERT INTO UsersTable (`userTableId`) \
                                                        VALUES (?)',[output], 
                                                        function(err, result, fields) {
                                                        if (err) {
                                                            console.log("received:" +output);
                                                            console.log("err:" +err);
                                                            connection.rollback(function(err){console.log("error 3");connection.release();res.send().status(400);
                                                            })                            
                                                        }       
                                                        else{
                                                            connection.commit(function(err){
                                                                if(err){
                                                                    connection.rollback(function(err){connection.release();console.log("error 3");res.send().status(400); })                            
                                                                }
                                                            })
                                        
                                                          //after generating the userTable and the notesTable, the put the new pacient  


                                                            connection.query(
                                                                'INSERT INTO Pacient (`pacientId`, `firstName`, `lastName`, `bedId`, `notesTableId`, `userTableId`) \
                                                                VALUES (?,?,?,?,?,?)',[pacientId,firstname,lastname,bedId,notesTableId,usersTableId], 
                                                                function(err, result, fields) {
                                                                if (err) {
                                                                    console.log("error:"+err)
                                                                    connection.rollback(function(err){
                                                                        console.log("error 4")
                                                                        connection.release();
                                                                        res.send().status(400);
                                                                    })                            
                                                                }
                                                                else{
                                                                    connection.commit(function(err){
                                                                        if(err){
                                                                            connection.rollback(function(err){
                                                                                connection.release();
                                                                                console.log("error 5 ")
                                                                                res.send().status(400);
                                                                            })                            
                                                                        }
                                                                    })
                                                                }        
                                                            });                                    
                                                            }
                                                        });
                                                
                                                  }
                                                });                    
                                                                                                          
                                    }
                                })
                            };
                     });
                    }                       
                     connection.release();                    
                     res.send().status(200);
               })
            });       
    
       
    
});


//API for editing a Patient
/**
 * body format: * 
 * [{"pacientId":2, 
 * "firstname":"peter",
 * "lastname":"Frant",
 * "bedId":"3",
 * "notesTableId":"1",
 * "userTableId":"1"
 * }]
 */

 routerPatient.put('/:id', function(req, res) {
    

    
    let pacientId=parseInt(req.params.id);
    let firstname=req.body[0].firstname;
    let lastname=req.body[0].lastname;
    let bedId= (req.body[0].bedId);
    let notesTableId=(req.body[0].notesTableId);
    let usersTableId = (req.body[0].usersTableId);    

     

    pool.query(
        'UPDATE Pacient SET\
        `firstname` = ?, \
        `lastname` = ?, \
        `bedId` = ?, \
        `notesTableId` = ?, \
        `userTableId`= ? \
         WHERE \
         `Pacient`.`pacientId` = ?;',[firstname,lastname,bedId,notesTableId,usersTableId,pacientId], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result).status(202);
    });

    
    //res.send(OK);
});


//API for deleting Patient
/**
 * body format: 
 * any
 */
 routerPatient.delete('/:id', function(req, res) {
    console.log(req.body);    
    let pacientId=parseInt(req.params.id);
        
    pool.query(
        'DELETE FROM Pacient \
        WHERE \
         `Pacient`.`pacientId` = ?;',[pacientId], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result).status(200);
    });

});
module.exports = routerPatient;
