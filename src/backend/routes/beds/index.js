var express = require('express');
var routerBeds = express.Router();
var pool = require('../../mysql');
var BedsList = require('../../Monitoring/Bed-mon');

//filling the bedList ordered by priority

async function fillingBeds()
{
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
    BedsList.printBedlist();  
    return;   
}

fillingBeds();
/**
 * Send to client all beds status information
*/
routerBeds.get('/state/', function(req, res) 
{    
    var response = BedsList.getBedStats();    
    res.send(response).status(201);
});

/**
 * Send to client all beds information
*/
routerBeds.get('/', function(req, res) 
{
    pool.query('Select * from Bed', function(err, result, fields) 
    {
        if (err) 
        {
            res.send(err).status(400);
            return;
        }
        else
        {
            res.send(result).status(201);
            return;
        }
    });
});

/**
 * return selected bed info 
 */
routerBeds.get('/:id', function(req, res) {
    idAb=req.params.id;   
    pool.query('Select * from Bed where bedId=?',[idAb], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
});

//API for gettin active notes of a pacient by bedId
routerBeds.get('/pacient/notes/:id', function(req, res) 
{
    idAb=req.params.id;   
    pool.query('SELECT DISTINCT notesId,note,state \
    FROM `Notes` as n JOIN `NotesTable` as nt JOIN `Patient` as p \
    WHERE n.notesTableId = nt.notesTableId AND \
    p.notesTableId = nt.notesTableId AND p.bedId= ? ORDER BY notesId DESC ',[idAb], function(err, result, fields) 
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

//API for post active notes of a pacient by bedId 
/**
 * params body: example 1:{[{"noteId":"1"},{"state":"desactivada"}]}, example 2:[{"noteId":"1"},{"state":"activada"}]
 */
routerBeds.post('/pacient/notes/activation/:id', function(req, res) {
    idAb=req.params.id;
    let noteId= req.body[0].noteId;
    let newState= req.body[1].state;  
    console.log(req.body[0].noteId);
    if (newState == "activa")
        {
         pool.query('UPDATE Notes SET state = "activa" WHERE notesId=?',[noteId],function(err, result, fields){
            if (err) {
                res.send(err).status(400);
                return;
            }        
            res.send(result)
        })}
    else if (newState == "desactiva")    
    {pool.query('UPDATE Notes SET state = "desactiva" WHERE notesId=?',[noteId],function(err, result, fields){
        if (err) {
            res.send(err).status(400);
            return;
        }    
        res.send(result)
    })}
    else {
        res.send("state not valid")};
    
  
});

//API for adding new beds 
/**
 * body format:
 * [{"roomId":1,
 * "callerId":1,
 * "floorId":"1"}]
 */
routerBeds.post('/', function(req, res) 
{    
    console.log("req:"+JSON.stringify(req.body))
    console.log(req.body[0]);    
    let received=(JSON.stringify(req.body));       
    let received2=JSON.parse(received);
    let roomId=parseInt(received2[0].roomId);
    let callerId=parseInt(received2[0].callerId);
    let floorId =parseInt( received2[0].floorId);
    pool.query(
        'INSERT INTO Bed(`roomId`, `callerId`, `floorId`) \
        VALUES (?,?,?)',[roomId,callerId,floorId], function(err, result, fields) 
        {
            if (err) 
            {
                res.send(err).status(400);
                return;
            }
            else
            {
                console.log(result.insertId);   
                bedId=result.insertId;
                pool.query(
                    'INSERT INTO PriorityTable(`bedId`, `priority`) \
                    VALUES (?,?)',[bedId,0], async function(err, result2, fields) 
                    {
                        if (err) 
                        {
                            res.send(err).status(400);
                            return;
                        }
                        else
                        {   
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
                                JOIN Bed on Bed.bedId = Pacient.bedId  \
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
                res.send(result).status(201);
                console.log("done");   
            }
        });
});

//API for editing beds 
/**
 * body format: 
 * [{"roomId":"2", "callerId":"17", "floorId":"1"}]
 */
 routerBeds.put('/:id', function(req, res) {
    console.log(req.body);    
    console.log(JSON.stringify(req.body));   
    let bedId=parseInt(req.params.id);
    let roomId=parseInt(req.body.roomId);
    let callerId=parseInt(req.body.callerId);
    let floorId =parseInt( req.body.floorId);
        
    pool.query(
        'UPDATE Bed SET \
        `roomId` = ?,   \
        `callerId` = ?, \
        `floorId` = ? \
        WHERE \
         `Bed`.`bedId` = ?;',[roomId,callerId,floorId, bedId], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result).status(200);
    });

    


});

//API for deleting beds
/**
 * body format: 
 * any
 */
 routerBeds.delete('/:id', function(req, res) {
    console.log(req.body);        
    let bedId=parseInt(req.params.id);
// first deleting the bed in bed Table, then in the priority table        
    pool.query(
        'DELETE FROM Bed \
        WHERE \
         `Bed`.`bedId` = ?;',[bedId], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        else{
        pool.query(
            'DELETE FROM PriorityTable\
            WHERE \
            `PriorityTable`.`bedId` = ?;',[bedId], function(err, result2, fields) {
            if (err) {
                res.send(err).status(400);
                return;
            }
            res.send(result).status(200);
            });
        }    
        
    });

});

//API for setting the priority of the bed
/**
 * params body: example 1:{[{"priority":"1"}]
 */
 routerBeds.put('/priority/:id', function(req, res) {
    console.log(req.body)
    let bedId=parseInt(req.params.id);
    let priority=parseInt(req.body[0].priority);
    console.log(priority);
    
    pool.query(
        'UPDATE PriorityTable SET \
        `priority` = ?   \
        WHERE \
         `PriorityTable`.`bedId` = ?;',[priority, bedId], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }        
        res.send(result).status(200);
        fillingBeds();
    });
 });


//API for getting the priority of the bed
/**
 * 
 */
 routerBeds.get('/priority/:id', function(req, res) {
    let bedId=parseInt(req.params.id);
    console.log(req.body)
    pool.query('Select * from PriorityTable where bedId=?',[bedId], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result).status(200);
    });
    
 });



module.exports = routerBeds;
