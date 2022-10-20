const { json } = require('express');
require('dotenv').config({ encoding: 'latin1' });
var mqtt=require('mqtt');
const bcrypt = require("bcrypt");
var BedsList = require('../Monitoring/Bed-mon');
var UserList = require('../Monitoring/User-mon');

var BedUserList = require('../Monitoring/Bed-user-mon');
var CalendarList = require('../Monitoring/Calendar-mon');

var Nurse = require('./nurse')
var Patient = require('./patient')
var Beds = require('./beds')
var Calendar = require('./calendar')
var User = require('./users')


//=======[ Data ]================================
var pool = require('../mysql');


/**
 * 
 * Connecting to MQTT broker
 */ 


var client = mqtt.connect(process.env.MQTT_CONNECTION)
//listening to  messages
client.on('connect', function () {
  client.subscribe('/User/general', function (err) {
    if (!err) {
    //  client.publish('/User/Info', 'Bienvenidos al sistema enfermera')
    }
  })
  client.subscribe('/Pacient/#', function (err) {
    if (!err) {      
      //client.publish('/Pacient/Info', 'Bienvenidos al sistema enfermera')
    }
  })
  client.subscribe('/Beds/#', function (err) {
    if (!err) {      
      //client.publish('/Pacient/Info', 'Bienvenidos al sistema enfermera')
    }
  })

  //task that will publish beds state each second
  setInterval(publishBedStates, 10000);
  //task that will publish users state each second
  setInterval(publishUserStates, 15000);
})

/**
 * Function that publishes the state of each bed in the broker
 * @param {}  
 */
 function publishBedStates(){
 // console.log("publishing state");
  var now = new Date();
 // convert date to a string in UTC timezone format:
   console.log(now.toUTCString());
  let topic= "/Beds/status";
  var response = BedsList.getBedStats();
  client.publish(topic, response);    
 }

 
/**
 * Function that publishes the state of each user in the broker
 * @param {}  
 */
 function publishUserStates(){
  // console.log("publishing state");
   let topic= "/User/status";
   var response = UserList.getUserStats();
   client.publish(topic, response);  
   
  }
 



/**
 * Function that compares qr
 * @param {*} bedId :number that identifies the pacient
 */
 function compareQR(message,_bedId){
  //console.log("bed:"+JSON.parse(bedId));
  console.log(message);
  console.log(JSON.stringify(_bedId)); 
  bedIdLocal=JSON.stringify(_bedId);
	let topic="/Beds/"+bedIdLocal+"/QRresponse";
  pool.query('SELECT QR  \
  FROM `QRbed` as b \
  WHERE b.bedId = ?',[_bedId], function(err, result, fields) {
    if (err|| result.length==0) {
        console.log("error")    
        client.publish(topic, JSON.stringify("Error"));                  
    }
    else{    
          if(message==JSON.stringify(result[0].QR)){
			  console.log("QR ok");
			  client.publish(topic, JSON.stringify("QR Ok")); 
			  BedsList.setStatus(_bedId,4);    
			               
			  }
			  
          else{
			  console.log("QR invalid");			  
			  client.publish(topic, JSON.stringify("QR invalid"));          
			  } 
          }
  });
	
  
}

async function saveNewEvent(typeofEvent, bedId, username, note, note2){
  console.log("tipo de evento:"+typeofEvent);
  console.log("username:"+username);
  console.log("Note:"+note2);


 /* 3 kinds of events :
 1:start a caller event log 
 2:start a calendar event log
 3:close ticket/finish 
*/
if(typeofEvent!=3){
  userIdLocal=0;
  note=" ";
  note2=" ";

  pool.query('SELECT pacientId from   \
  Pacient  WHERE `Pacient`.`bedId`= ?',[bedId], function(err, result, fields) {
    if (err|| result.length==0) {
        console.log("error")
    }
    else{
      let pacientIdLocal=result[0].pacientId;
    console.log(result[0].pacientId)
     
    pool.query('INSERT INTO `LogEvents`   \
          (`type`,`pacientId`,`userId`,`Note`,`Note2`) VALUES(?,?,?,?,?)',[typeofEvent,pacientIdLocal,userIdLocal,'','' ], 
          function(err, result, fields) {
          if (err|| result.length==0) {
              console.log("error",err)
            }}
     );
  }});  
  }
else { 
        let type=1;      
        let calendarId =await CalendarList.getCalendarId(bedId);    
        
        if(calendarId!=-1){
          console.log("cerrando evento calendario")
          type=2;
          CalendarList.removeCalendar(calendarId);   
        }

        pool.query('SELECT pacientId from   \
        Pacient  WHERE `Pacient`.`bedId`= ?',[bedId], function(err, result, fields) {
          if (err|| result.length==0) {
              console.log("error")
          }
          else{
            pacientLocal=result[0].pacientId;  
            pool.query('SELECT userId from   \
            User  WHERE `User`.`username`= ?',[username], function(err, result, fields) {
              if (err|| result.length==0) {
                  console.log("error")
              }
              else{
                        userId=result[0].userId;  
                        pool.query('SELECT logEventId from  LogEvents \
                        WHERE `LogEvents`.`pacientId`= ? ORDER BY logEventId DESC LIMIT 1',[pacientLocal], function(err, result, fields) {
                        if (err|| result.length==0) {
                            console.log("error1:",err )
                        }
                        else{
                            logId= result[0].logEventId; 
                            console.log(result[0].logEventId)
                            console.log("closing event log")
                            const isoDate = new Date();
                            const mySQLDateString = isoDate.toJSON().slice(0, 19).replace('T', ' ');
                            if(isNaN(userId)){userIdLocal=0;}   
                            else{userIdLocal=userId;}
                            //UPDATE `LogEvents` SET `finish` = '2022-08-10 01:54:55' WHERE `LogEvents`.`logEventId` = 2;
                            pool.query('UPDATE `LogEvents` SET `type`= ?,`finish` =?,`userId`=?, `Note2`=? , `Note`=? \
                             WHERE `LogEvents`.`logEventId` = ?',[type,mySQLDateString, userIdLocal , note2 , note , logId ], function(err, result, fields) {
                            if (err|| result.length==0) {
                                console.log("error:",err)
                            }})
                          }
                      }            
              //client.publish(topic, JSON.stringify(result));  
                    )
              }
          }
          )
        }

        })      
      }      


}

async function getBedIdCaller(callerId){
  console.log("here");
  console.log(callerId);
  console.log("here*");
  pool.query('SELECT * from  Bed WHERE `callerId`= ?',[callerId],  function(err, result, fields) {
    if (err|| result.length==0) {
        console.log("error:"+err)
        return; 
    }
    else{
      let bedId=result[0].bedId;
      console.log(bedId)
      BedsList.setStatus(bedId,2);
      publishBedStates();
      return ;
    }

})
}
/**
 * Functions for subscribe to topics and reroute to api functions
*/
client.on('message', async function (topic, message,packet) {
  // message is Buffer
 // console.log(packet, packet.payload.toString()); 
  let message_data=JSON.parse(message);
  //console.log(JSON.parse(message));
  console.log("***********************************");
  console.log(topic);
  console.log("***********************************");
  console.log(message_data._content); 

  //console.log(message_data._bedId); 
  //console.log("Message type:"+message_data._type); 
  //received an alarm from a caller device, update state of bed
  if(topic==="/Beds/caller-events"){
    //message_content {"_bedId":2,"_content":"alert","_time":"today","_username":"system"}
    //console.log(JSON.stringify(message_data));
    //BedsList.setStatus(message_data._bedId,2);
    //publishBedStates();
    //saveNewEvent(1,message_data._bedId,"system","","");
    
    await getBedIdCaller(message_data);
    
  }
  //else{console.log("Message type:"+message_data._type); }
 
  /**
   * login/logout functions
   * 
   * 
   */
  if(message_data._type=== 1){	  
    
    User.loginHere(message_data._username, message_data._content,client,UserList)    
  }
  if(message_data._type=== 2){
    
    User.loginOut(message_data._username,client,UserList)     
  }
  
  /**
   *Asking/editing Patients  information/notes
   **/  
  if((message_data._type=== 3)){//&&(topic==="Pacient/#")){
    console.log("escribiendo nota");
    let d= topic.split('/')
    //console.log("pacientID:"+d[2])
    if(d[2]==null){return;}
    if(message_data._content==""){return;}
    Patient.setPatientNotesPatientId(d[2],message_data._content,client);    
  }
  if((message_data._type=== 4)){//&&(topic==="Pacient/#")){
	console.log("asking info")  
    Patient.getPatientInfoPacientId((message_data._content),client);
  }
  if((message_data._type=== 5)){//&&(topic==="Pacient/#")){
	  console.log("asking notes")  
    Patient.getPatientNotesPatientId(message_data._content,client);
  }

  /**
   *Asking bed info... for nurses
   **/  
  if((message_data._type=== 8)){//&&(topic==="Pacient/#")){
    //console.log("bedInfo");
    Beds.getBedInfo(message_data._content,client);    
  }
  /**
   * Ask for beds for the current doctor
   */
  if((message_data._type=== 9)){//&&(topic==="Pacient/#")){    
	console.log("Doctor:"+message);
    //getListOfBeds(message_data._content);    
    Patient.getPatientsBeds(message_data._content,client); 
  }
  if((message_data._type=== 10)){//&&(topic==="Pacient/#")){
    Patient.getBedPatientInfo(message_data._content,client);    
    }

  /**
   * Received a QR, check it and update the status of the bed
   */
  if((message_data._type=== 11)){//&&(topic==="Pacient/#")){
//    console.log("get QR");    
    await compareQR(message_data._content,message_data._bedId);   
    await publishBedStates();       
  }    
  /**
   * Received a acceptance from nurse... going to room,  update the status of the bed
   */
   if((message_data._type=== 12)){
     console.log("going to room");
     
     console.log("******************************************************************************************************************************");
        
     console.log("receiver id:" + message_data._content);   
     let id=parseInt(message_data._content)  
     console.log("******************************************************************************************************************************");
     await   UserList.setStatus(id,2);    
     await publishUserStates();
     BedUserList.addBedUser(message_data._bedId,id);
     //UserList.setStatus(data,0);
     //publishUserStates();
     await   BedsList.setStatus(message_data._bedId,3);    
     await   publishBedStates();      
      }    

  /**
   * Received a End of work, check it and update the status of the bed
   */
   if((message_data._type=== 13)){
        console.log("get end of work");

        let id=BedUserList.getId(message_data._bedId);        

        if(id>0){
          await UserList.setStatus(id,1);    
          await publishUserStates();
          BedUserList.removeData(message_data._bedId);
          }

        BedsList.setStatus(message_data._bedId,1);         
        publishBedStates(); 
        saveNewEvent(3,message_data._bedId,message_data._username,"",message_data._content);        
      }
  
  /**
     * Received a asking for help command, check it and update the status of the bed
     */
  if((message_data._type=== 14)){
    console.log("ASK for help");
    console.log(message_data)
  await BedsList.setStatus(message_data._bedId,6);    
  await publishBedStates();      
  } 
  
  /**
   * Received a asking Specicalization of nurse
   */
   if((message_data._type=== 16)){
    console.log("ASK for nurseSec");
    console.log(message_data)
    
   await Nurse.getNurseSpecs(message_data._username,client);      
  } 
  /**
     * Ask for list of medicalTable
     */
  if((message_data._type=== 17)){
    console.log("ASKing list of doctors");
    console.log(message_data)
  await  Beds.getBedMedicalTableInfo(message_data._bedId,client);    
  } 

  /**
     * removin pacient notes
     */
  if((message_data._type=== 18)){
    console.log("removing patient note");
    console.log(message_data)
  await Patient.deletePatientNotesNotesId(message_data,client);    
  } 

  /**
     * cancelling call
     */
  if((message_data._type=== 19)){
    console.log("cancelling call");
    console.log(message_data)
    //BedUserList.printBedUserlist();

    let id=BedUserList.getId(message_data._bedId);
    if(id>0){
    await UserList.setStatus(id,1);    
    await publishUserStates();
    }

    BedUserList.removeData(message_data._bedId);
    //BedUserList.printBedUserlist();
    await BedsList.setStatus(message_data._bedId,2);    
    await publishBedStates();      
    }    


  /**
     * Ask for notes of a calendar event
     */

  if((message_data._type=== 20)){
    console.log("Asking for notes of a calendar event")
    
    await Calendar.getCalendarNotes(message_data._bedId,client,CalendarList);
    
  }

/**
 * message type 23===>> prepared for updating pass... not used
 */
  if(message_data._type=== 23){
    // console.log(JSON.stringify(message_data))
     data=message_data._content.split("Ç");
   
   //uncomment next lines for enabling  
   //  if(message_data._username==data[1]){
   //  User.updatePass(message_data._username,data[0],client)    ; }
   }


  })

  
  
  
  


  module.exports = client;
