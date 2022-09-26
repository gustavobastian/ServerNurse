var express = require('express');
var eventsTable = express.Router();
var pool = require('../../mysql');

const schedule = require('node-schedule');
var client = require ('../../mqtt/mqtt')
var BedsList = require('../../Monitoring/Bed-mon');


//filling the bedList
async function fillingScheduledJobs(){
    console.log("generating scheduled jobs")
    let type=0;
    pool.query('Select * from EventsTable', function(err, result, fields) {
        if (err) {
            console.log(err);
            return;
        }
        if(result!=null )
        {
            
        result.forEach(element => {
            console.log(JSON.stringify(element)    );
            console.log(element.datetime)
            let data = element.datetime;
            console.log(data.getHours())
            
            let hoursL=data.getHours();
            let minutesL=data.getMinutes();
            let dateL=data.getDate();
            let dayL= data.getDay();

            console.log("h:"+hoursL+"|min:"+ minutesL+"|date:"+ dateL+"|dayL:"+ dayL);
            pool.query('Select * from Pacient where pacientId = ?',element.pacientId, function(err, result, fields) {
                if (err || result.length==0) {
                    console.log("error:",err)
                   // client.publish(topic, JSON.stringify("Error"));          
                }
                //console.log(result)
                else{
                        bedID=result[0].bedId;    

                        if(element.type=="daily"){
                                console.log("creating daily job")
                                type=1;
                                const rule= new schedule.RecurrenceRule();
                                rule.hour=hoursL;
                                rule.minute=minutesL;
                                
                                    
                                    console.log("bed calendario:"+bedID);
                                    const job = schedule.scheduleJob(rule,function(){
                                        console.log("lauching daily job ");  
                                        console.log("Bed:"+bedID);  
                                        console.log("Note:"+element.note);  
                                        BedsList.setStatus(bedID,9)
                                        client.publish("/Beds/"+bedID+"/Notes", JSON.stringify(element.note));                  
                                    })                   
                            }
                        if(element.type=="weekly"){
                            console.log("creating weekly job")
                            const rule= new schedule.RecurrenceRule();
                            rule.hour=hoursL;
                            rule.minute=minutesL;
                            rule.dayOfWeek=dayL;
                            const job = schedule.scheduleJob(rule, function(){
                                console.log("lauching weekly job ");                        
                                console.log("Bed:"+element.bedId);  
                                console.log("Note:"+element.note);  
                                BedsList.setStatus(bedID,5)

                        }) }  
                        if(element.type=="monthly"){
                            console.log("creating monthly job")
                                    const rule= new schedule.RecurrenceRule();
                                    rule.hour=hoursL;
                                    rule.minute=minutesL;
                                    rule.date=dateL;
                            
                                    type=3;
                                    const job = schedule.scheduleJob(rule, function(){
                                        console.log("lauching monthly job ");                        
                                        console.log("Bed:"+element.bedId);  
                                        console.log("Note:"+element.note);  
                                        BedsList.setStatus(bedID,5)
                    
                                }) }    
                                
                                
                    }
                })           

            });  

        }
    })
       
    
}; 

     /*pool.query('Select * from Bed', function(err, result, fields) {
        console.log("filling beds")
        if (err) {
            console.log("Error");
            return;
        }
        result.forEach(element => {  
            BedsList.addBed(element.bedId);      
            
        });    
        return;
        
    });

     pool.query('Select bedId from `Pacient`', function(err, result, fields) {
        console.log("filling bed status")
        if (err) {
            console.log("Error")
            return;
        }
        result.forEach(element => {        
            BedsList.setStatus(element.bedId,1);
        });    
        //UserList.printUserList();  
        return;
    });

 //   BedsList.printBedlist();  */
//}

fillingScheduledJobs();
/**
 * Send to client all beds status information
*/
/*
routerBeds.get('/state/', function(req, res) {    
    var response = BedsList.getBedStats();    
    res.send(response);
 });

/**
 * Send to client all events information
*/

eventsTable.get('/', function(req, res) {
    pool.query('Select * from EventsTable', function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
});

/**
 * return  event  info filtered by pacient
 */

eventsTable.get('/:id', function(req, res) {
    idAb=req.params.id;   
    pool.query('Select * from EventsTable where pacientId=?',[idAb], function(err, result, fields) {
        if (err) {
            res.send(err).status(404);
            return;
        }
        res.send(result);
    });
});



//API for adding new Events 
/**
 *{"pacientId":1,
 *"type": "daily",
 *"note":"say hola",
 *"dateTime":"2022-07-20 11:39:51"
 *}
 */

 eventsTable.post('/', function(req, res) { 
    console.log(" post event"   )
    console.log("req:"+JSON.stringify(req.body))
    console.log(req.body);    
    let received=(JSON.stringify(req.body));       
    let received2=JSON.parse(received);
    
    let pacientId=parseInt(received2.pacientId);
    let date_int=JSON.stringify(received2.dateTime);
    let stringTime=JSON.parse(date_int);
    let type =( received2.type);
    console.log("pacientId:"+pacientId);
    console.log("tipo:"+type);
    let note =( received2.note);
    console.log("nota:"+note);
    console.log("datetime:"+(stringTime));

    pool.query(
        'INSERT INTO EventsTable(`pacientId`, `type`, `dateTime`, `note`) \
        VALUES (?,?,?,?)',[pacientId,type,stringTime,note], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            console.log("error"+err);   
            return;
        }
        res.send(result).status(201);
        console.log("done");   
        fillingScheduledJobs();
    });
    
    //res.status(202);

});

//API for editing events 
/**
 * body format: 
 *{"eventId":1,
 *"type": "daily",
 *"note":"say hola",
 *"dateTime":"2022-07-20 11:42:51"
 }
 */

 eventsTable.put('/:id', function(req, res) {
    console.log("put event"   )
    console.log(req.body);    
    console.log(JSON.stringify(req.body));   
    let eventId=(req.params.id);
    let dateTime=(req.body.dateTime);    
    let type=(req.body.type);  
    let note =( req.body.note);

    console.log("eventId: " + eventId + " dateTime: " + dateTime + " type: " + type + "note:"+note)
        
    pool.query(
        'UPDATE EventsTable SET \
        `type` = ?,   \
        `dateTime` = ?, \
        `note` = ? \
        WHERE \
         `EventsTable`.`eventId` = ?;',[type,dateTime,note,eventId], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result).status(201);
    });

});

//API for deleting scheduled events
/**
 * body format: 
 * any
 */

 eventsTable.delete('/:id', function(req, res) {
    console.log(req.body);
    
    let eventId=parseInt(req.params.id);
    console.log("deleting event:"+eventId)        
    pool.query(
        'DELETE FROM EventsTable        \
        WHERE \
         `EventsTable`.`eventId` = ?;',[eventId], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result).status(201);
    });

});

module.exports = eventsTable;
