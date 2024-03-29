var express = require('express');
var routerPatient = express.Router();
var pool = require('../../mysql');
var BedsList = require('../../Monitoring/Bed-mon');

//API for getting all Pacients information
routerPatient.get('/', function(req, res) 
{
    pool.query('Select * from Patient', function(err, result, fields) 
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
//API for getting all Pacients id information
routerPatient.get('/numbers', function(req, res) 
{
    pool.query('Select patientId from Patient', function(err, result, fields) 
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

//API for getting all  information for a single pacient
routerPatient.get('/:id', function(req, res) 
{
    idAb=req.params.id;   
    pool.query('Select * from Patient where patientId = ?',idAb, function(err, result, fields) 
    {
        if (err) 
        {
            res.send(err).status(400);
            return;
        }
        else{
            res.send(result);
            return;
		}
    });
});

/*
 * query for getting doctors from pacient id
 * SELECT userId, username from `Pacient` as p JOIN `MedicalTable` as MT JOIN `User` as us ON p.userTableId=MT.userTableId AND MT.userId=us.userID Where p.patientId=1;
 * 
 * */
 
//API for adding new  Pacient
/**
 * body format:
 * [{"patientId":2, 
 * "firstname":"peter",
 * "lastname":"Frant",
 * "bedId":"3",
 * "notesTableId":"1",
 * "userTableId":"1"}]
 */

routerPatient.post('/', async function(req, res) 
{
    console.log(req.body);
    let received= JSON.stringify(req.body);
    console.log("firstname rev:"+received);
    let patientId=req.body._patientId;
    let firstname=req.body._firstName;
    console.log("firstname:"+firstname);
    let lastname=req.body._lastName;
    console.log("lastname:"+lastname);
    let bedId= (req.body._bedId);
    console.log("bedid:"+bedId);
    let notesTableId=(req.body._patientId);
    let usersTableId = (req.body._userTableId);   
    let output; 
    //transaction for inserting a new pacient, generating new userTable and new notesTable
    pool.getConnection(function(err, connection)  
    {
        if (err) 
        {
            return;
        }            
        connection.beginTransaction(function(err)
        {
            if(err){
                connection.roolback(function(err)
                {
                    connection.release();
                    res.send().status(400);
                });
            }
            else
            {   
                connection.query('SELECT notesTableId FROM `NotesTable` \
                ORDER BY notesTableId DESC LIMIT 1',function(err, result)
                {
                    if (err) 
                    {
                        connection.rollback(function(err)
                        {
                            console.log("error 1");connection.release();res.send().status(400);
                        })                            
                    }       
                    else
                    {
                        //generating a new notestable 
                        notesTableId=parseInt(JSON.stringify(result[0].notesTableId))+1;
                        console.log("notesTableId: " + JSON.stringify(notesTableId));
                        output= notesTableId;
                                        
                        connection.query(
                        'INSERT INTO NotesTable (`notesTableId`) \
                        VALUES (?)',[output], 
                        function(err, result, fields) 
                        {
                            if (err) 
                            {
                                console.log("received:" +output);
                                console.log("err:" +err);
                                connection.rollback(function(err)
                                {
                                    console.log("error 2");connection.release();res.send().status(400);
                                })                            
                            }       
                            else{
                                connection.commit(function(err)
                                {
                                    if(err)
                                    {
                                        connection.rollback(function(err)
                                        {
                                            connection.release();console.log("error 3");res.send().status(400); 
                                        })                            
                                    }
                                })
                                //generating a new userTable
                                connection.query('SELECT userTableId FROM `UsersTable` ORDER BY userTableId DESC LIMIT 1',function(err, result)
                                {
                                    if (err) 
                                    {
                                        connection.rollback(function(err)
                                        {
                                            console.log("error 7");connection.release();res.send().status(400);
                                        })                            
                                    }       
                                    else
                                    {
                                        //generating a new notestable 
                                        userTableId=parseInt(JSON.stringify(result[0].userTableId))+1;
                                        console.log("userTableId: " + JSON.stringify(userTableId));
                                        output= userTableId;
                                                        
                                        connection.query(
                                        'INSERT INTO UsersTable (`userTableId`) \
                                        VALUES (?)',[output], 
                                        function(err, result, fields) 
                                        {
                                            if (err) 
                                            {
                                                console.log("received:" +output);
                                                console.log("err:" +err);
                                                connection.rollback(function(err)
                                                {
                                                    console.log("error 3");connection.release();res.send().status(400);
                                                })                            
                                            }       
                                            else{
                                                connection.commit(function(err)
                                                {
                                                    if(err)
                                                    {
                                                        connection.rollback(function(err)
                                                        {
                                                            connection.release();console.log("error 3");res.send().status(400); 
                                                        })                            
                                                    }
                                                })
                                                //after generating the userTable and the notesTable, the put the new pacient  
                                                connection.query(
                                                'INSERT INTO Patient (`patientId`, `firstName`, `lastName`, `bedId`, `notesTableId`, `userTableId`) \
                                                VALUES (?,?,?,?,?,?)',[patientId,firstname,lastname,bedId,notesTableId,usersTableId], 
                                                async function(err, result, fields) 
                                                {
                                                    if (err) 
                                                    {
                                                        console.log("error:"+err)
                                                        connection.rollback(function(err)
                                                        {
                                                            console.log("error 4")
                                                            connection.release();
                                                            res.send().status(400);
                                                        })                            
                                                    }
                                                    else
                                                    {
                                                        connection.query('INSERT INTO `PatientSpecTable` ( `patientId`,`specID`)  \
                                                        VALUES (?,?)',[patientId,1], function(err, result, fields) 
                                                        {
                                                            if (err) 
                                                            {
                                                                res.send(err).status(400);
                                                                console.log("error adding a treatment to a pacient ")
                                                                return;
                                                            }
                                                            else
                                                            {                                                                            
                                                                connection.commit(function(err)
                                                                {
                                                                    if(err)
                                                                    {
                                                                        connection.rollback(function(err)
                                                                        {
                                                                        connection.release();
                                                                        console.log("error 5 ")
                                                                        res.send().status(400);
                                                                        })                                                                                                
                                                                    }
                                                                    else
                                                                    {
                                                                        console.log("patient added to db")
                                                                    }     
                                                                })
                                                            } 
                                                        });
                                                        //updating bedlist status
                                                        BedsList.bedlist=[{id:0,st:0,spec:0}];                        
                                                        await   pool.query('select * from Bed join PriorityTable using (bedId) \
                                                        ORDER BY PriorityTable.priority DESC', async function(err, result, fields) 
                                                        {
                                                            console.log("filling beds")
                                                            if (err) 
                                                            {
                                                                console.log("Error in bedlist1");
                                                                return;
                                                            }
                                                            await result.forEach(element => 
                                                            {  
                                                                BedsList.addBed(element.bedId);                  
                                                            });
                                                            await pool.query('Select * from PatientSpecTable \
                                                            JOIN SpecTable on SpecTable.id = PatientSpecTable.specId  \
                                                            JOIN Patient on Patient.patientId = PatientSpecTable.patientId  \
                                                            JOIN Bed on Bed.bedId = Patient.bedId  \
                                                            ', function(err, result, fields) 
                                                            {
                                                                if (err) 
                                                                {
                                                                    console.log("error in bedlist 3")
                                                                    return;
                                                                }                    
                                                                result.forEach(element => 
                                                                {  
                                                                    BedsList.setStatus(element.bedId,1);      
                                                                    BedsList.setTreat(element.bedId,element.specId);
                                                                });            
                                                            });       
                                                        });                                                    
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
 * {"_patientId":2, 
 * "_firstname":"peter",
 * "_lastname":"Frant",
 * "_bedId":"3",
 * "_notesTableId":"1",
 * "_userTableId":"1"
 * }
 */

 routerPatient.put('/:id', async function(req, res) 
 {
    console.log((req.body))
	let received= JSON.stringify(req.body);    
    let received2 = JSON.parse(received)    
    
    let patientId=parseInt(req.params.id);
    
    let firstname=req.body._firstName;
    let lastname=req.body._lastName;
    let bedId= (req.body._bedId);    
    let usersTableId = (req.body._usersTableId);    

    console.log()
     

    await pool.query(
    'UPDATE Patient SET\
    `firstname` = ?, \
    `lastname` = ?, \
    `bedId` = ?, \
    `userTableId`= ? \
    WHERE \
    `Patient`.`patientId` = ?;',[firstname,lastname,bedId,usersTableId,patientId], async function(err, result, fields) 
    {
        if (err) 
        {
            res.send(err).status(400);
            console.log("Error:"+err)
            return;
        }
        else
        {
            res.send(result).status(202);
            //updating bedlist status   
            BedsList.bedlist=[{id:0,st:0,spec:0}];                        
            await   pool.query('select * from Bed join PriorityTable using (bedId) ORDER BY PriorityTable.priority DESC', async function(err, result, fields) 
            {
                console.log("filling beds")
                if (err) 
                {
                    console.log("Error in bedlist1");
                    return;
                }
                await result.forEach(element => 
                    {  
                        BedsList.addBed(element.bedId);                  
                    });
                await pool.query('Select * from PatientSpecTable \
                JOIN SpecTable on SpecTable.id = PatientSpecTable.specId  \
                JOIN Patient on Patient.patientId = PatientSpecTable.patientId  \
                JOIN Bed on Bed.bedId = Patient.bedId  \
                ', function(err, result, fields) 
                {
                    if (err) 
                    {
                        console.log("error in bedlist 3")
                        return;
                    }                    
                    result.forEach(element => 
                    {                  
                        BedsList.setStatus(element.bedId,1);      
                        BedsList.setTreat(element.bedId,element.specId);
                    });            
                });       
            });
        }
    });   
});


//API for deleting Patient
/**
 * body format: 
 * any
 */
routerPatient.delete('/:id', async function(req, res) 
{
    console.log(req.body);    
    let patientId=parseInt(req.params.id);
        
    await pool.query(
    'DELETE FROM Patient \
    WHERE \
    `Patient`.`patientId` = ?;',[patientId], function(err, result, fields) 
    {
        if (err) 
        {
            res.send(err).status(400);
            return;
        }        
    });
  
    await pool.query(
    'DELETE FROM EventsTable \
    WHERE \
    `EventsTable`.`patientId` = ?;',[patientId], function(err, result, fields) 
    {
        if (err) 
        {
            res.send(err).status(400);
            return;
        }        
    });  
    await pool.query(
    'DELETE FROM PatientSpecTable \
    WHERE \
    `PatientSpecTable`.`patientSpecId` = ?;',[patientId], function(err, result, fields) 
    {
        if (err) 
        {
            res.send(err).status(400);
            return;
        }        
        else
        {
            res.send(result).status(200);  
        }  
    });

    //Updating bedlist
    BedsList.bedlist=[{id:0,st:0,spec:0}];                        
    await   pool.query('select * from Bed join PriorityTable using (bedId)\
    ORDER BY PriorityTable.priority DESC', async function(err, result, fields) 
    {
        console.log("filling beds")
        if (err) 
        {
            console.log("Error in bedlist1");
            return;
        }
        await result.forEach(element => 
        {  
            BedsList.addBed(element.bedId);                  
        });
        await pool.query('Select * from PatientSpecTable \
        JOIN SpecTable on SpecTable.id = PatientSpecTable.specId  \
        JOIN Patient on Patient.patientId = PatientSpecTable.patientId  \
        JOIN Bed on Bed.bedId = Patient.bedId  \
        ', function(err, result, fields) 
        {
            if (err) 
            {
                console.log("error in bedlist 3")
                return;
            }                    
            result.forEach(element => 
            {  
                //console.log(element)               
                BedsList.setStatus(element.bedId,1);      
                BedsList.setTreat(element.bedId,element.specId);
            });            
        });       
    });  
});

module.exports = routerPatient;
