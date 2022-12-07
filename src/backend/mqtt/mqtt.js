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
client.on('connect', function () 
{
  client.subscribe('/User/#', function (err) 
  {
    if (err) 
    {
      console.log("error:"+err);
    }
  })  
  client.subscribe('/Pacient/#', function (err) 
  {
    if (err) 
    {      
      console.log("error:"+err);
    }
  })
  client.subscribe('/Beds/#', function (err) 
  {
    if (err) 
    {      
      console.log("error:"+err);
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
function publishBedStates()
{
  var now = new Date();
  // convert date to a string in UTC timezone format:
  console.log(now.toTimeString());   
  let topic= "/Beds/status";
  var response = BedsList.getBedStats();
  client.publish(topic, response);    
}

 
/**
 * Function that publishes the state of each user in the broker
 * @param {}  
 */
function publishUserStates()
{
   let topic= "/User/status";
   var response = UserList.getUserStats();
   client.publish(topic, response);     
}
/**
 * Function that compares qr
 * @param {*} bedId :number that identifies the patient
 */
function compareQR(message,_bedId)
 {
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
  if(typeofEvent!=3)
  {
    console.log("starting an event")
    console.log("bedId:"+bedId);
    userIdLocal=0;
    note=" ";
    note2=" ";
    pool.query('SELECT patientId from   \
    Patient  WHERE `Patient`.`bedId`= ?',[bedId], function(err, result, fields) 
    {
      if (err|| result.length==0) 
      {
          console.log("error")
      }
      else
      {
        let patientIdLocal=result[0].patientId;
        console.log(result[0].patientId);
        const isoDate = new Date();
        isoDate.setHours(isoDate.getHours() - 3);//argentine
        const mySQLDateString = isoDate.toJSON().slice(0, 19).replace('T', ' ');
        console.log(mySQLDateString)
      
        pool.query('INSERT INTO `LogEvents`   \
              (`type`,`patientId`,`userId`,`init`,`Note`,`Note2`) VALUES(?,?,?,?,?,?)',[typeofEvent,patientIdLocal,userIdLocal,mySQLDateString,'','' ], 
              function(err, result, fields) {
              if (err|| result.length==0) {
                  console.log("error",err)
                }}
        );
      }
    });  
  }
  else 
  { 
    let type=1;      
    let calendarId =await CalendarList.getCalendarId(bedId);        
    if(calendarId!=-1)
    {
      console.log("cerrando evento calendario");
      type=2;
      CalendarList.removeCalendar(calendarId);   
    }
    pool.query('SELECT patientId from   \
    Patient  WHERE `Patient`.`bedId`= ?',[bedId], function(err, result, fields) 
    {
      if (err|| result.length==0) 
      {
          console.log("error")
      }
      else
      {
        patientLocal=result[0].patientId;  
        pool.query('SELECT userId from   \
        User  WHERE `User`.`username`= ?',[username], function(err, result, fields) {
          if (err|| result.length==0) {
              console.log("error")
          }
          else
          {
            userId=result[0].userId;  
            pool.query('SELECT logEventId from  LogEvents \
            WHERE `LogEvents`.`patientId`= ? ORDER BY logEventId DESC LIMIT 1',[patientLocal], function(err, result, fields) 
            {
              if (err|| result.length==0) 
              {
                  console.log("error1:",err )
              }
              else
              {
                  logId= result[0].logEventId; 
                  console.log(result[0].logEventId)
                  console.log("closing event log")
                  const isoDate = new Date();
                  isoDate.setHours(isoDate.getHours() - 3);//argentine
                  const mySQLDateString = isoDate.toJSON().slice(0, 19).replace('T', ' ');
                  console.log(mySQLDateString)
                  
                  
                  if(isNaN(userId))
                  {
                    userIdLocal=0;
                  }   
                  else{
                    userIdLocal=userId;
                  }                  
                  pool.query('UPDATE `LogEvents` SET `type`= ?,`finish` =?,`userId`=?, `Note2`=? , `Note`=? \
                  WHERE `LogEvents`.`logEventId` = ?',[type,mySQLDateString, userIdLocal , note2 , note , logId ], function(err, result, fields) 
                  {
                    if (err|| result.length==0) 
                    {
                        console.log("error:",err)
                    }
                  })
              }
            })
        }
        })
      }
    })      
  }      
}

async function getBedIdCaller(callerId){
  let device=JSON.parse(callerId);
  pool.query('SELECT * from  Bed WHERE `callerId`= ?',[device.callerId],  function(err, result, fields) 
  {
    if (err|| result.length==0) 
    {
        console.log("error:"+err)
        return; 
    }
    else
    {
      console.log("Caller data is correct")
      let bedId=result[0].bedId;
      console.log(bedId)
      BedsList.setStatus(bedId,2);
      publishBedStates();      
      saveNewEvent(1,bedId,"system","","");
      return ;
    }
  })
}
/**
 * Functions for subscribe to topics and reroute to api functions
*/
client.on('message', async function (topic, message,packet) 
{
 
  let message_data=JSON.parse(message);

  //received an alarm from a caller device, update state of bed
  if(topic==="/Beds/Caller-events")
  {
    let message2=packet.payload.toString();
    await getBedIdCaller(message2);
  }

  /**
   * Disconnection(MQTT last will testament)
   */
 
  if(topic.indexOf('CalendarNote')!=-1)
  {
    console.log("aqui");
    let parsetTopic=topic.split("/")    
    console.log(parsetTopic[2]);
    saveNewEvent(2,parseInt(parsetTopic[2]),"system","","");
  }

  /**
   * Initiate a calendar event
   */
 
   if(topic==="/User/Disconnection")
   {
     console.log("aqui");
     console.log(packet.payload.toString());
     User.loginOut(message_data._user,client,UserList)      
   }



  /**
   * login/logout functions
   */

  if(message_data._type=== 1)
  {	
    User.loginHere(message_data._username, message_data._content,client,UserList)    
  }
  if(message_data._type=== 2)  
  {
    User.loginOut(message_data._username,client,UserList)     
  }  
  /**
   *Asking/editing Patients  information/notes
   **/  
  if((message_data._type=== 3))
  {
    console.log("writing note");
    let d= topic.split('/')  
    if(d[2]==null)
    {
      return;
    }
    if(message_data._content=="")
    {
      return;
    }
    Patient.setPatientNotesPatientId(d[2],message_data._content,client);    
  }
  if((message_data._type=== 4))
  {
	  console.log(packet.payload.toString());
	  console.log("asking info")  
	  console.log(message_data._content)  
    Patient.getPatientInfopatientId((message_data._content),client);
  }
  if((message_data._type=== 5))
  {
	  console.log(packet.payload.toString());
	  console.log("asking notes")  
	  console.log(message_data._content)  
    Patient.getPatientNotesPatientId(message_data._content,client);
  }
  /**
   *Asking bed info... for nurses
   **/  
  if((message_data._type=== 8))
  {
    Beds.getBedInfo(message_data._content,client);    
  }
  /**
   * Ask for beds for the current doctor
   */
  if((message_data._type=== 9))
  {
	  console.log("Doctor:"+message);
    Patient.getPatientsBeds(message_data._content,client); 
  }
  if((message_data._type=== 10))
  {
    Patient.getBedPatientInfo(message_data._content,client);    
  }
  /**
   * Received a QR, check it and update the status of the bed
   */
  if((message_data._type=== 11))
  {
    await compareQR(message_data._content,message_data._bedId);   
    await publishBedStates();       
  }    
  /**
   * Received a acceptance from nurse... going to room,  update the status of the bed
   */
  if((message_data._type=== 12))
  {
    console.log("going to room");
    console.log("******************************************************************************************************************************");
    console.log("receiver id:" + message_data._content);   
    let id=parseInt(message_data._content)  
    console.log("******************************************************************************************************************************");
    await   UserList.setStatus(id,2);    
    await publishUserStates();
    BedUserList.addBedUser(message_data._bedId,id);
    await   BedsList.setStatus(message_data._bedId,3);    
    await   publishBedStates();      
  }    
  /**
   * Received a End of work, check it and update the status of the bed
   */
  if((message_data._type=== 13))
  {
    console.log("get end of work");
    let id=BedUserList.getId(message_data._bedId);        
    if(id>0)
    {
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
  if((message_data._type=== 14))
  {
    console.log("ASK for help");
    console.log(message_data)
    await BedsList.setStatus(message_data._bedId,6);    
    await publishBedStates();      
  } 
  
  /**
   * Received a asking Specicalization of nurse
   */
  if((message_data._type=== 16))
  {
    console.log("ASK for nurseSec");
    console.log(message_data)
    await Nurse.getNurseSpecs(message_data._username,client);      
  } 
  /**
     * Ask for list of medicalTable
     */
  if((message_data._type=== 17))
  {
    console.log("ASKing list of doctors");
    console.log(message_data)
    await Beds.getBedMedicalTableInfo(message_data._bedId,client);    
  } 
  /**
     * removin patient notes
     */
  if((message_data._type=== 18))
  {
    console.log("removing patient note");
    console.log(message_data)
    await Patient.deletePatientNotesNotesId(message_data,client);    
  } 

  /**
  * cancelling call
  */
  if((message_data._type=== 19))
  {
    console.log("cancelling call");
    console.log(message_data)
    let id=BedUserList.getId(message_data._bedId);
    if(id>0)
    {
      await UserList.setStatus(id,1);    
      await publishUserStates();
    }
    BedUserList.removeData(message_data._bedId);    
    await BedsList.setStatus(message_data._bedId,2);    
    await publishBedStates();      
  }    
  /**
     * Ask for notes of a calendar event
     */
  if((message_data._type=== 20))
  {
    console.log("Asking for notes of a calendar event")
    await Calendar.getCalendarNotes(message_data._bedId,client,CalendarList);
  }

/**
 * message type 23===>> prepared for updating pass... not used
 */
  if(message_data._type=== 23)
  {
     data=message_data._content.split("Ç");
   // uncomment next lines for enabling pass modifications from MQTT clients 
   //  if(message_data._username==data[1]){
   //  User.updatePass(message_data._username,data[0],client)    ; }
  }
})

  
  module.exports = client;
