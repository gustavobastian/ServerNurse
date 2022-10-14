var express = require('express');
var eventsTable = express.Router();
var pool = require('../../mysql');

var randf = require('randomstring');    


const schedule = require('node-schedule');
var client = require ('../../mqtt/mqtt')
var BedsList = require('../../Monitoring/Bed-mon');
var CalendarList = require('../../Monitoring/Calendar-mon');


//filling the bedList
async function fillingScheduledJobs(){
    console.log("generating scheduled jobs")
    let scheduleJob=0;
    let type=0;
    pool.query('Select * from EventsTable', function(err, result, fields) {
        if (err) {
            console.log(err);
            return;
        }
        if(result!=null )
        {
        let n=0;
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
                
                else{
                        bedID=result[0].bedId;    
                        console.log(result[0].bedId)
                           
                        
                        var jobId ="job-"+n.toString(); //randomsrting
                        n=n+1;    


                        if(element.type=="daily"){
                                console.log("creating daily job")
                                console.log("jobId:"+jobId);  
                                type=1;
                                const rule= new schedule.RecurrenceRule();
                                rule.hour=hoursL;
                                rule.minute=minutesL;                                
                                    
                                //console.log("bed calendario:"+bedID);
                                schedule.scheduleJob(jobId,rule,function(){
                                        console.log("lauching daily job ");  
                                //        console.log("Bed:"+bedID);  
                                //        console.log("Note:"+element.note);  
                                         console.log("jobId:"+jobId);  
                                        BedsList.setStatus(bedID,5);
                                        CalendarList.addCalendar(element.eventId,bedID,element.note);
                                     //  client.publish("/Calendar/Notes", JSON.stringify({'id':bedID,"note":element.note}));                  
                                    })
                                    var jobList = schedule.scheduledJobs;
                                    var d=0;
                                    for(jobName in jobList){
                                        // Here inside **jobName** you are getting name of each Schedule.
                                        d=d+1;
                                    }

                                    console.log("number of jobs:"+d)                                                   
                            }
                        if(element.type=="weekly"){
                            console.log("creating weekly job")
                            const rule= new schedule.RecurrenceRule();
                            rule.hour=hoursL;
                            rule.minute=minutesL;
                            rule.dayOfWeek=dayL;
                            console.log("jobId:"+jobId);  
                            schedule.scheduleJob(jobId,rule, function(){
                                console.log("lauching weekly job ");                        
                                //console.log("Bed:"+element.bedId);  
                                //console.log("Note:"+element.note);  
                                console.log("jobId:"+jobId);  
                                
                                BedsList.setStatus(bedID,5);
                                CalendarList.addCalendar(element.eventId,element.bedId,element.note);
                                //client.publish("/Calendar/Notes", JSON.stringify({'id':bedID,"note":element.note}));   
                        

                        }) 
                        var jobList = schedule.scheduledJobs;
                                    var d=0;
                                    for(jobName in jobList){
                                        // Here inside **jobName** you are getting name of each Schedule.
                                        d=d+1;
                                    }

                                    console.log("number of jobs:"+d)                                                                                                                                 
           
                        }  
                        if(element.type=="monthly"){
                            console.log("creating monthly job")
                            console.log("jobId:"+jobId);  
                                    const rule= new schedule.RecurrenceRule();
                                    rule.hour=hoursL;
                                    rule.minute=minutesL;
                                    rule.date=dateL;
                            
                                    type=3;
                                    schedule.scheduleJob(jobId,rule, function(){
                                        console.log("lauching monthly job ");                        
                                        //console.log("Bed:"+element.bedId);  
                                        //console.log("Note:"+element.note);  
                                        console.log("jobId:"+jobId);  
                                        BedsList.setStatus(bedID,5);
                                        CalendarList.addCalendar(element.eventId,element.bedID,element.note);
                                  //      client.publish("/Calendar/Notes", JSON.stringify({'id':bedID,"note":element.note}));   
                                        
                                })
                                var jobList = schedule.scheduledJobs;
                                    var d=0;
                                    for(jobName in jobList){
                                        // Here inside **jobName** you are getting name of each Schedule.
                                        d=d+1;
                                    }

                                    console.log("number of jobs:"+d)                                                   
                                }    
                                
                                
                    }
                })           

            });  
           
        }
    })
       
    
}; 

   

fillingScheduledJobs();


/**
 * Send to client all events information
*/

eventsTable.get('/', function(req, res) {
     //counting all scheduled jobs
     var jobList = schedule.scheduledJobs;
     var d=0;
     for(jobName in jobList){
         // Here inside **jobName** you are getting name of each Schedule.
         console.log(JSON.stringify(jobName))
         d=d+1;
     }

     console.log("number of jobs:"+d)                                                   
    
    
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

    //counting all scheduled jobs
    var jobList = schedule.scheduledJobs;
    var d=0;
    for(jobName in jobList){
        // Here inside **jobName** you are getting name of each Schedule.
        console.log(JSON.stringify(jobName))
        d=d+1;
    }

    console.log("number of jobs:"+d)                                                   
   
     

    pool.query('Select * from EventsTable where pacientId=?',[idAb], function(err, result, fields) {
        if (err) {
     
            res.send(err).status(404);            
            return;
        }
        else{
     
            res.send(result);            
            return;
        }
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
    let date_int=JSON.parse(received2.dateTime);//
    console.log(date_int)
    let stringTime=JSON.parse(date_int);
    
    let type =( received2.type);
    console.log("pacientId:"+pacientId);
    console.log("tipo:"+type);
    let note =( received2.note);
    console.log("nota:"+note);
    console.log("datetime:"+(stringTime));

    //deleting all scheduled jobs
    try {
        for (const job in schedule.scheduledJobs) schedule.cancelJob(job);   
    }catch(e){console.log(e);}

    pool.query(
        'INSERT INTO EventsTable(`pacientId`, `type`, `dateTime`, `note`) \
        VALUES (?,?,?,?)',[pacientId,type,stringTime,note], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            console.log("error"+err);   
            fillingScheduledJobs();
            return;
        }
        else{
        res.send(result).status(201);
        console.log("done");   
        fillingScheduledJobs();
        }
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


    
    //deleting all scheduled jobs
    try {
        for (const job in schedule.scheduledJobs) schedule.cancelJob(job);
   
    }catch(e){console.log(e);}

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
            fillingScheduledJobs();
            return;
        }
        else{
        res.send(result).status(201);
        fillingScheduledJobs();
        return;
        }


    });

});

//API for deleting scheduled events
/**
 * body format: 
 * any
 */

 eventsTable.delete('/:id', async function(req, res) {
    console.log(req.body);
    let eventId=parseInt(req.params.id);

    
    //deleting all scheduled jobs
    try {
        for (const job in schedule.scheduledJobs) schedule.cancelJob(job);
   
    }catch(e){console.log(e);}
    

    
    
    console.log("deleting event:"+eventId)        
    pool.query(
        'DELETE FROM EventsTable        \
        WHERE \
         `EventsTable`.`eventId` = ?;',[eventId], function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            fillingScheduledJobs();
            return;
        }
        else{
        res.send(result).status(201);
        fillingScheduledJobs();
        return;
        }
        
    });
    

});

module.exports = eventsTable;
