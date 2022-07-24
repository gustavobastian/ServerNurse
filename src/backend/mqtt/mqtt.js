const { json } = require('express');
var mqtt=require('mqtt');

var BedsList = require('../Monitoring/Bed-mon');
var UserList = require('../Monitoring/User-mon');

var MQTT_TOPIC = "test";
//var MQTT_ADDR = "mqtt://localhost";
//var MQTT_PORT = 1883;
var MQTT_ADDR = "ws://localhost";
var MQTT_PORT = 9001;
//=======[ Data ]================================
var pool = require('../mysql');



/**
 * playing with bedlist
 */
 
 BedsList.addBed(1);
 BedsList.addBed(2);
 BedsList.addBed(3);
 BedsList.addBed(4);
 BedsList.addBed(7);
 BedsList.addBed(6);

 UserList.addUser(1);
 UserList.addUser(2);
 UserList.addUser(3);
 UserList.addUser(4);
 UserList.addUser(5);
 UserList.addUser(6);
 

/**
 * Connecting to MQTT broker
 */ 

var client = mqtt.connect('ws://192.168.1.100:9001');
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

  //Publish beds initial state
  setInterval(publishBedStates, 10000);
  
})

/**
 * Function that publishes the state of each bed in the broker
 * @param {}  
 */
 function publishBedStates(){
 // console.log("publishing state");
  let topic= "/Beds/status";
  var response = BedsList.getBedStats();
  client.publish(topic, response);  
  
 }



/***
 * Functions that sets the status of the user in 1 and sends to the app the mode of use
 */
function loginHere(username){
  console.log(username.toString()); 
  //client.publish('/User/Info', c) ;
  pool.query('Select * from User WHERE username=?',[username], function(err, result, fields) {
    if (err) {
        console.log(error)
        return;
    }
    console.log(result);

    ///User/System/{"idNumber":1,"mode":"doctor"}
    let response_conform={idNumber:result[0].userId, mode:result[0].occupation};
    //var response= "{idNumber:"+result[0].userId+",mode:"+result[0].occupation+"}";
    var response = JSON.stringify(response_conform);
    console.log(response);
    //client.publish('/User/System/response', response);  
    client.publish('/User/'+username+'/response', response);  

    //client.publish('/User/Info', JSON.parse(c));  
    //var d= JSON.parse(result);
    let data=result[0].userId;
    console.log("data:"+data);
    UserList.setStatus(data,1);
    //check if user is logged
    UserList.printUserList();
    //
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

  });
}


/**
 * function that gets all the beds with pacients of a specified  doctor 
 * @param {message}: username of the doctor
 */

 function getListOfBeds(message){
  console.log("Aqui:"+message);
  console.log("Doctor:"+message);
  let topiclocal= "/User/"+message+"/Beds";
  pool.query('\
  SELECT DISTINCT bedId,pacientId \
  FROM `Pacient` as p JOIN `MedicalTable` as Mt JOIN `User` as u JOIN `UsersTable` as uT \
  WHERE p.userTableId = uT.userTableId AND Mt.userTableId=uT.userTableId  AND u.userId = Mt.userId AND u.username=? \
  ',[message], function(err, result, fields) {
    if (err || result.length==0) {
        console.log("error")
        client.publish(topiclocal, JSON.stringify("Error"));          
    }    
    else{
    client.publish(topiclocal, JSON.stringify(result));  }
  });  

 }

/**
 * Function that returns the pacient information to topic
 * @param {*} pacientId :number that identifies the pacient
 */
function getPacientInfoPacientId(pacientId){
  console.log("pacient:"+pacientId);
  
  let topic= "/Pacient/"+pacientId+"/info";
  pool.query('Select * from Pacient where pacientId = ?',pacientId, function(err, result, fields) {
    if (err || result.length==0) {
        console.log("error")
        client.publish(topic, JSON.stringify("Error"));          
    }
    //console.log(result)
    else{
    client.publish(topic, JSON.stringify(result));  }
  });  
  
   
}

/**
 * Function that returns the pacient notes to topic
 * @param {*} pacientId :number that identifies the pacient
 */
 function getPacientNotesPacientId(pacientId){
  console.log("pacient:"+pacientId);
  // system publising last 2 notes only
  let topic= "/Pacient/"+pacientId+"/notes";
  pool.query('SELECT DISTINCT notesId,note,state \
  FROM `Notes` as n JOIN `NotesTable` as nt JOIN `Pacient` as p \
  WHERE n.notesTableId = nt.notesTableId AND p.notesTableId = nt.notesTableId AND pacientId = ? ORDER BY notesId DESC LIMIT 2',pacientId, function(err, result, fields) {
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
 * Function that put a note on the pacient(saves it to the database)
 * @param {*} pacientId :number that identifies the pacient
 */
 function setPacientNotesPacientId(pacientId, note){
  //console.log("pacient:"+pacientId);
  //console.log("note:"+note);  
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
 function getBedPacientInfo(bedId){
  console.log("bed:"+JSON.parse(bedId));
  // system publising last 2 notes only
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
 * Function that compares qr
 * @param {*} bedId :number that identifies the pacient
 */
 function compareQR(message,_bedId){
  console.log("bed:"+JSON.parse(bedId));
  BedsList.setStatus(_bedId,3);
  // system publising last 2 notes only
  /*let topic= "/Beds/"+bedId+"/Pacient";

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
  });  */
  
}

/**
 * Functions for subscribe to topics and reroute to api functions
*/
client.on('message', function (topic, message,packet) {
  // message is Buffer
  //console.log(packet, packet.payload.toString()); 
  let message_data=JSON.parse(message);
  /*console.log(JSON.parse(message));
  /*console.log("***********************************");
  console.log(topic);
  console.log("***********************************");
  console.log(message_data._content); */

  //received an alarm from a caller device, update state of bed
  if(topic==="/Beds/caller-events"){
    //message_content {"_bedId":2,"_content":"alert","_time":"today","_username":"system"}
    BedsList.setStatus(message_data._bedId,2);
  }

  if(message_data._type=== 1){
    loginHere(message_data._username)
    
  }
  if(message_data._type=== 2){
    loginOut(message_data._username)    
  }

  /*if(message_data._command=== 8){
    getPacientInfoBed(message_data._bedId);
  }*/
  
  
  if((message_data._type=== 3)){//&&(topic==="Pacient/#")){
    console.log("escribiendo nota");
    setPacientNotesPacientId(1,message_data._content);    
  }
  if((message_data._type=== 4)){//&&(topic==="Pacient/#")){
    getPacientInfoPacientId(message_data._content);
  }
  if((message_data._type=== 5)){//&&(topic==="Pacient/#")){
    getPacientNotesPacientId(message_data._content);
  }
  if((message_data._type=== 8)){//&&(topic==="Pacient/#")){
    console.log("bedInfo");
    getBedInfo(message_data._content);    
  }
  if((message_data._type=== 9)){//&&(topic==="Pacient/#")){
    console.log("listofBeds");
    getListOfBeds(message_data._username);    
  }
  if((message_data._type=== 10)){//&&(topic==="Pacient/#")){
    console.log("pacient_from_bed");
    
    getBedPacientInfo(message_data._content);    
  }
  if((message_data._type=== 11)){//&&(topic==="Pacient/#")){
    console.log("get QR");
    
    compareQR(message_data._content,message_data._bedId);        
  }    
})


  module.exports = client;
