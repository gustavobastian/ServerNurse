const { json } = require('express');
var mqtt=require('mqtt');
const bcrypt = require("bcrypt");
var BedsList = require('../Monitoring/Bed-mon');
var UserList = require('../Monitoring/User-mon');

require('dotenv').config({ encoding: 'latin1' })


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
  setInterval(publishUserStates, 10000);
  
  
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
 



/***
 * Functions that sets the status of the user in 1 and sends to the app the mode of use
 */
async function  loginHere(username, password){
  console.log(username.toString()); 
  password2=password.toString();

  
  console.log(password2)
  let logeado=false;
  let response_conform={idNumber:0, mode:99};
  //client.publish('/User/Info', c) ;
  await pool.query('Select * from User WHERE username=?',[username], function(err, result, fields) {
    if (err) {
        console.log("error:"+err)
        var response = JSON.stringify(response_conform);
        console.log(response);
    //client.publish('/User/System/response', response);  
        client.publish('/User/'+username+'/response', response); 
        return;
    }
    else{
    
    
    if(result[0]!=null){ ///I have a user in the database

      let estado=UserList.getStatus(result[0].userId)
      console.log("Estado:"+estado) 
      UserList.setStatus(result[0].userId,1);

     if(estado<1){                           ///The user is not already logged
      bcrypt.compare(password, result[0].password, (err, resultComp) => {
          if(resultComp==true)
          {
            console.log('logueado');
            
            ///User/System/{"idNumber":1,"mode":"doctor"}
           response_conform={idNumber:result[0].userId, mode:result[0].occupation};
            logeado=true;
            let data=result[0].userId;
            console.log("data:"+data);
            UserList.setStatus(data,1);
            //check if user is logged
              UserList.printUserList();
          }
          if(resultComp==false)
          {
            console.log('no logueado');
            logeado=false;
          }
         });
        }

        if((estado<1)){
          response_conform={idNumber:result[0].userId, mode:result[0].occupation};//------------------------------>Quitar cuando use el hash
          }
    } 
    
    var response = JSON.stringify(response_conform);
    console.log(response);
    client.publish('/User/'+username+'/response', response);  

    publishUserStates();

    


    }
  });
}

/***
 * Functions that sets the status of the user in 0 and response ok to the app
 */
function loginOut(username){
  pool.query('Select * from User WHERE username=?',[username], function(err, result, fields) {
    if (err) {
        console.log(error)
        return;
    }   


    let response_conform={idNumber:result[0].userId, mode:"ok"};

    var response = JSON.stringify(response_conform);
    console.log(response);
    client.publish('/User/'+username+'/response', response);  
   
    
    let data=result[0].userId;
    console.log("data:"+data);
    UserList.setStatus(data,0);
    publishUserStates();
  });
}


/**
 * function that gets all the beds with pacients of a specified  doctor 
 * @param {message}: username of the doctor
 */

 function getListOfBeds(message){  
  console.log("Doctor:"+message);
 }

 /**
  * Get nurse caracteristics
  * @param {*} message 
  * {"_username":"robertop","_content":"1","_bedId":0,"_time":"0","_type":43}
  */
 
 function getNurseSpecs(message){
  console.log(message);
  
  pool.query('Select NurseSpecTable.nurseSpecId,User.userId, SpecTable.Name, NurseSpecTable.specId  \
  from NurseSpecTable \
  INNER JOIN SpecTable on SpecTable.id= NurseSpecTable.specId\
  INNER JOIN User ON User.userId=NurseSpecTable.userId \
  WHERE username=?',[message], function(err, result, fields) {
    if (err || result.length==0) {
        console.log("error-asking for beds")
        console.log("error:"+err)        
        client.publish(topiclocal, JSON.stringify("Error"));          
    }    
    else{
    let topiclocal= "/User/"+result[0].userId+"/Specs";
    client.publish(topiclocal, JSON.stringify(result)); }
  });
 }

 /**
 * function that gets all the pacients  of a specified  doctor 
 * @param {message}: username of the doctor
 */

 function getPatientsBeds(message){
  //console.log("Aqui:"+message);
  console.log("Doctor:"+message);
  let topiclocal= "/User/"+message+"/Pacients";
  
  pool.query('\
  SELECT DISTINCT bedId,pacientId \
  FROM `Pacient` as p JOIN `MedicalTable` as Mt JOIN `User` as u JOIN `UsersTable` as uT \
  WHERE p.userTableId = uT.userTableId AND Mt.userTableId=uT.userTableId  AND u.userId = Mt.userId AND u.userId=? \
  ',[message], function(err, result, fields) {
    if (err || result.length==0) {
        console.log("error-asking for beds")
        console.log("error:"+err)
        client.publish(topiclocal, JSON.stringify("Error"));          
    }    
    else{
    client.publish(topiclocal, JSON.stringify(result)); }
  });  

 }

/**
 * Function that returns the pacient information to topic
 * @param {*} pacientId :number that identifies the pacient
 */
function getPatientInfoPacientId(pacientId){
  console.log("pacient:"+pacientId);
  
  
  
  let topic= "/Pacient/"+pacientId+"/info";
  pool.query('Select * from Pacient where pacientId = ?',pacientId, function(err, result, fields) {
    if (err || result.length==0) {
        console.log("error:",err)
        client.publish(topic, JSON.stringify("Error"));          
    }
    //console.log(result)
    else{
    client.publish(topic, JSON.stringify(result));  }
  });  
  
   
}

/**
 * Function that returns the pacient notes to topic
 * @param {*} patientId :number that identifies the pacient
 */
  function getPatientNotesPatientId(patientId){
  console.log("patient:"+(patientId));
  console.log("asking for notes:");
  // system publising last 2 notes only
  let topic= "/Pacient/"+patientId+"/notes";
   pool.query('SELECT DISTINCT notesId,note,state \
  FROM `Notes` as n JOIN `NotesTable` as nt JOIN `Pacient` as p \
  WHERE n.notesTableId = nt.notesTableId AND p.notesTableId = nt.notesTableId AND pacientId = ? ORDER BY notesId DESC ',patientId, function(err, result, fields) {
    if (err || result.length==0) {
        console.log("error:",err)
        client.publish(topic, JSON.stringify("Error"));          
        
    }
    else{
   // console.log(result)
     client.publish(topic, JSON.stringify(result));  }
  });
  
}

/**
 * Function that returns the pacient notes to topic
 * @param {*} notesId :number that identifies the pacient
 */
  function deletePatientNotesNotesId(notesId){
  console.log("noteId:"+(notesId._content));
  console.log("deleting:");
  // system publising last 2 notes only
  
   pool.query('DELETE FROM Notes WHERE `Notes`.`notesId` = ?', [notesId._content], function(err, result, fields) {
    if (err || result.length==0) {
        console.log("error:",err)           
    }
    else{
    console.log(result)  
  }});   
  
}

/**
 * Function that put a note on the patient(saves it to the database)
 * @param {*} pacientId :number that identifies the patient
 */
 function setPatientNotesPatientId(pacientId, note){
  
  
  pool.getConnection(function(err, connection) {
    connection.beginTransaction(function(err) {
        if (err) {                  //Transaction Error (Rollback and release connection)
            connection.rollback(function() {
              console.log("aqui no estoy")
                connection.release();
                //Failure
            });
        } else {
            console.log("aqui estoy")
            connection.query('INSERT INTO `Notes` (`note`,`state`,`notesTableId`)\
            VALUES (?,?,?)', [note,"activa",pacientId], function(err, results) {
                if (err) {          //Query Error (Rollback and release connection)
                    console.log(err);
                    connection.rollback(function() {
                        connection.release();
                        //Failure
                    });
                } else {
                    connection.commit(function(err) {
                        if (err) {
                            connection.rollback(function() {
                                connection.release();
                                //Failure
                            });
                        } else {
                            connection.release();
                            //Success
                        }
                    });
                }
            });
        }
      });
    });    
}


/**
 * Function that publish the bed info to topic
 * @param {*} bedId :number that identifies the pacient
 */
 function getBedInfo(bedId){
  console.log("bed:"+JSON.parse(bedId));
  // system publising last 2 notes only
  let topic= "/Beds/"+bedId+"/info";

  pool.query('SELECT *  \
  FROM `Bed` as b \
  WHERE b.bedId = ?',[bedId], function(err, result, fields) {
    if (err|| result.length==0) {
        console.log("error")
        client.publish(topic, JSON.stringify("Error"));          
        
    }
    else{
   // console.log(result)
     client.publish(topic, JSON.stringify(result));  }
  });
  
}


/**
 * Function that publish the pacient id to topic
 * @param {*} bedId :number that identifies the pacient
 */
 function getBedPatientInfo(bedId){
  console.log("bed:"+JSON.parse(bedId));
  
  let topic= "/Beds/"+bedId+"/Pacient";

  pool.query('SELECT pacientId  \
  FROM `Bed` as b JOIN `Pacient` as P\
  USING (bedId) \
  WHERE b.bedId = ?',[bedId], function(err, result, fields) {
    if (err|| result.length==0) {
        console.log("error")
        client.publish(topic, JSON.stringify("Error"));          
        
    }
    else{
   // console.log(result)
     client.publish(topic, JSON.stringify(result));  }
  });  
}
/**
 * Function that publish the medical Table id to topic
 * @param {*} bedId :number that identifies the pacient
 * Message form:
 * {"_bedId":1,"_content":"consulta lista MDT"
 * ,"_time":"today","_username":"system","_type":17}
 */
 function getBedMedicalTableInfo(bedId){
  console.log("bed:"+JSON.parse(bedId));
  
  let topic= "/Beds/"+bedId+"/MDT";
  
  pool.query('SELECT User.lastname, User.userId from   \
  MedicalTable JOIN Pacient USING (userTableId) \
  JOIN User USING (userId) \
  WHERE `Pacient`.`bedId`= ?',[bedId], function(err, result, fields) {
    if (err|| result.length==0) {
        console.log("error")
        client.publish(topic, JSON.stringify("Error"));       
        
    }
    else{
   // console.log(result)
     client.publish(topic, JSON.stringify(result));  }
  });  
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
	publishBedStates();  
  
}

function saveNewEvent(typeofEvent, bedId, username, note, note2){
  console.log("tipo de evento:"+typeofEvent);
  console.log("username:"+username);
  console.log("Note:"+note2);


 /* 3 kinds of events :
 1:start a caller event log 
 2:start a calendar event log
 3:close ticket/finish 
*/
if(typeofEvent==1){
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
else if(typeofEvent==3){ 
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
                            pool.query('UPDATE `LogEvents` SET `finish` =?,`userId`=?, `Note2`=? , `Note`=?  WHERE `LogEvents`.`logEventId` = ?',[mySQLDateString, userIdLocal , note2 , note , logId ], function(err, result, fields) {
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
else if(typeofEvent==2){ 
  console.log("saving event 3");
  userIdLocal=0;
  note=note.toString();
  note2=" ";

  pool.query('SELECT pacientId from   \
  Pacient  WHERE `Pacient`.`bedId`= ?',[bedId], function(err, result, fields) {
    if (err|| result.length==0) {
        console.log("error")
    }
    else{
      let pacientIdLocal=result[0].pacientId;
    console.log(result[0].pacientId)
     //client.publish(topic, JSON.stringify(result));  }
     /**INSERT INTO `LogEvents` (`logEventId`, `type`, `init`, `finish`,
      *  `pacientId`, `userId`, `Note`, `Note2`)
      *  VALUES (NULL, '1', '2022-08-10 01:28:30.000000', '2022-08-10 01:28:30.000000', '3', '0', '', '');*/
     pool.query('INSERT INTO `LogEvents`   \
          (`type`,`pacientId`,`userId`,`Note`,`Note2`) VALUES(?,?,?,?,?)',[typeofEvent,pacientIdLocal,userIdLocal,'','' ], 
          function(err, result, fields) {
          if (err|| result.length==0) {
              console.log("error",err)
            }}
     );
  }});  
  }

}



/**
 * Functions for subscribe to topics and reroute to api functions
*/
client.on('message', function (topic, message,packet) {
  // message is Buffer
  //console.log(packet, packet.payload.toString()); 
  let message_data=JSON.parse(message);
  /*console.log(JSON.parse(message));*/
  console.log("***********************************");
  console.log(topic);
  console.log("***********************************");
  //console.log(message_data._content); 
  //console.log(message_data._bedId); 

  //received an alarm from a caller device, update state of bed
  if(topic==="/Beds/caller-events"){
    //message_content {"_bedId":2,"_content":"alert","_time":"today","_username":"system"}
    //console.log(JSON.stringify(message_data));
    BedsList.setStatus(message_data._bedId,2);
    publishBedStates();
    saveNewEvent(1,message_data._bedId,"system","","");
  }
 /* if(topic==="/Beds/"){
    //message_content {"_bedId":2,"_content":"alert","_time":"today","_username":"system"}
    //console.log(JSON.stringify(message_data));        
    saveNewEvent(2,,0,message_data,"");
  }*/
  /**
   * login/logout functions
   * TODO: check passwords
   * 
   */
  if(message_data._type=== 1){	  
    loginHere(message_data._username, message_data._content)    
  }
  if(message_data._type=== 2){
    loginOut(message_data._username)    
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
    setPatientNotesPatientId(d[2],message_data._content);    
  }
  if((message_data._type=== 4)){//&&(topic==="Pacient/#")){
	console.log("asking info")  
    getPatientInfoPacientId((message_data._content));
  }
  if((message_data._type=== 5)){//&&(topic==="Pacient/#")){
	  console.log("asking notes")  
    getPatientNotesPatientId(message_data._content);
  }

  /**
   *Asking bed info... for nurses
   **/  
  if((message_data._type=== 8)){//&&(topic==="Pacient/#")){
    //console.log("bedInfo");
    getBedInfo(message_data._content);    
  }
  /**
   * Ask for beds for the current doctor
   */
  if((message_data._type=== 9)){//&&(topic==="Pacient/#")){    
	console.log("Doctor:"+message);
    //getListOfBeds(message_data._content);    
    getPatientsBeds(message_data._content); 
  }
  if((message_data._type=== 10)){//&&(topic==="Pacient/#")){
    //console.log("pacient_from_bed");
    
    getBedPatientInfo(message_data._content);    
    
  }

  /**
   * Received a QR, check it and update the status of the bed
   */
  if((message_data._type=== 11)){//&&(topic==="Pacient/#")){
//    console.log("get QR");
    
    compareQR(message_data._content,message_data._bedId);        
  }    
  /**
   * Received a acceptance from nurse... going to room,  update the status of the bed
   */
   if((message_data._type=== 12)){//&&(topic==="Pacient/#")){
    //    console.log("get QR");
        console.log("going to room");
        
        BedsList.setStatus(message_data._bedId,3);    
        publishBedStates();      
      }    

  /**
   * Received a End of work, check it and update the status of the bed
   */
   if((message_data._type=== 13)){
        console.log("get end of work");
        BedsList.setStatus(message_data._bedId,1); 
        publishBedStates(); 
        saveNewEvent(3,message_data._bedId,message_data._username,"","");        
      }
  
  /**
   * Received a asking Question, check it and update the status of the bed
   */
   if((message_data._type=== 14)){
    console.log("ASK");
    BedsList.setStatus(message_data._bedId,5); 
    publishBedStates();         
  }    
  /**
   * Received a close command, check it and update the status of the bed
   */
   if((message_data._type=== 16)){
    console.log("END ASK");
    console.log(message_data)
    BedsList.setStatus(message_data._bedId,4);    
    publishBedStates();      
  } 

  /**
   * Received a asking for help command, check it and update the status of the bed
   */
   if((message_data._type=== 44)){
    console.log("ASK for help");
    console.log(message_data)
    BedsList.setStatus(message_data._bedId,6);    
    publishBedStates();      
  } 
  /**
   * Ask for list of medicalTable
   */
   if((message_data._type=== 17)){
    console.log("ASKing list of doctors");
    console.log(message_data)
    getBedMedicalTableInfo(message_data._bedId);    
  }    


  /**
   * Received a asking for help command, check it and update the status of the bed
   */
   if((message_data._type=== 43)){
    console.log("ASK for nurseSec");
    console.log(message_data)
    
    getNurseSpecs(message_data._username);      
  } 
  
  /**
   * removin pacient notes
   */
   if((message_data._type=== 18)){
    console.log("removing pacient note");
    console.log(message_data)
    deletePatientNotesNotesId(message_data);    
  } 
  
  
  /**
   * removin pacient notes
   */
   if((message_data._type=== 19)){
    console.log("cancelling call");
    console.log(message_data)
    BedsList.setStatus(message_data._bedId,2);    
    publishBedStates();      
  }    

})


  module.exports = client;
