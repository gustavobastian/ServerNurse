const { json } = require('express');
var mqtt=require('mqtt');

var MQTT_TOPIC = "test";
//var MQTT_ADDR = "mqtt://localhost";
//var MQTT_PORT = 1883;
var MQTT_ADDR = "ws://localhost";
var MQTT_PORT = 9001;
//=======[ Data ]================================
var pool = require('../mysql');





var client = mqtt.connect('ws://192.168.1.101:9001');
/*client.on('connect', function () {
    client.subscribe('presence', function (err) {
      if (!err) {
        client.publish('presence', 'Hello mqtt')
      }
    })
  })
  
  client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString())
    client.end()
  })
*/
//listening to  messages
client.on('connect', function () {
  client.subscribe('/User/general', function (err) {
    if (!err) {
      client.publish('/User/Info', 'Bienvenidos al sistema enfermera')
    }
  })
  client.subscribe('/Pacient/#', function (err) {
    if (!err) {
      console.log("ok");
      //client.publish('/Pacient/Info', 'Bienvenidos al sistema enfermera')
    }
  })
})

//API for making changes in database or ask for data
function loginHere(c){
  console.log(c.toString()); 
  //client.publish('/User/Info', c) ;
  pool.query('Select * from User WHERE username=?',[c], function(err, result, fields) {
    if (err) {
        console.log(error)
        return;
    }
    console.log(result);
    //client.publish('/User/Info', JSON.parse(c));  
    //var d= JSON.parse(result);

    ///User/System/{"idNumber":1,"mode":"doctor"}
    let response_conform={idNumber:result[0].userId, mode:result[0].occupation};
    //var response= "{idNumber:"+result[0].userId+",mode:"+result[0].occupation+"}";
    var response = JSON.stringify(response_conform);
    console.log(response);
    client.publish('/User/System/response', response);  
  });
}

function getPacientInfoBed(bedId){
  console.log("bedId");
 /* console.log(c.toString()); 
  //client.publish('/User/Info', c) ;
  pool.query('Select * from User WHERE username=?',[c], function(err, result, fields) {
    if (err) {
        console.log(error)
        return;
    }
    console.log(result);
    //client.publish('/User/Info', JSON.parse(c));  
    //var d= JSON.parse(result);

    ///User/System/{"idNumber":1,"mode":"doctor"}
    let response_conform={idNumber:result[0].userId, mode:result[0].occupation};
    //var response= "{idNumber:"+result[0].userId+",mode:"+result[0].occupation+"}";
    var response = JSON.stringify(response_conform);
    console.log(response);
    client.publish('/User/System', response);  
  });*/
}

/**
 * Function that returns the pacient information to topic
 * @param {*} pacientId :number that identifies the pacient
 */
function getPacientInfoPacientId(pacientId){
  console.log("pacient:"+pacientId);
  
  let topic= "/Pacient/"+pacientId+"/info";
  pool.query('Select * from Pacient where pacientId = ?',pacientId, function(err, result, fields) {
    if (err) {
        console.log("error")
        return;
    }
    //console.log(result)
    client.publish(topic, JSON.stringify(result));  
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
    if (err) {
        console.log("error")
        return;
    }
   // console.log(result)
     client.publish(topic, JSON.stringify(result));  
  });
  
}
/**
 * Function that put a note on the pacient
 * @param {*} pacientId :number that identifies the pacient
 */
 function setPacientNotesPacientId(pacientId, note){
  console.log("pacient:"+pacientId);
  console.log("note:"+note);
  // system publising last 2 notes only
  /*let topic= "/Pacient/"+pacientId+"/notes";
  pool.query('SELECT DISTINCT notesId,note,state FROM `Notes` as n JOIN `NotesTable` as nt JOIN `Pacient` as p WHERE n.notesTableId = nt.notesTableId AND pacientId = ? ORDER BY notesId DESC LIMIT 2',pacientId, function(err, result, fields) {
    if (err) {
        console.log("error")
        return;
    }
   // console.log(result)
     client.publish(topic, JSON.stringify(result));  
  });*/
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
 * Functions for subscribe to topics and reroute to api functions
*/
client.on('message', function (topic, message,packet) {
  // message is Buffer
  console.log(packet, packet.payload.toString()); 
  let message_data=JSON.parse(message);
  console.log(JSON.parse(message));
  console.log("***********************************");
  console.log(topic);
  console.log("***********************************");
  console.log(message_data._content); 

  if(message_data._type=== 1){
    loginHere(message_data._username)
  }
  /*if(message_data._command=== 8){
    getPacientInfoBed(message_data._bedId);
  }*/
  if((message_data._type=== 2)){//&&(topic==="Pacient/#")){
    getPacientInfoPacientId(message_data._content);
  }
  if((message_data._type=== 5)){//&&(topic==="Pacient/#")){
    getPacientNotesPacientId(message_data._content);
  }
  if((message_data._type=== 3)){//&&(topic==="Pacient/#")){
    console.log("escribiendo nota");
    setPacientNotesPacientId(1,message_data._content);
    
  }
  //client.end()
})



  module.exports = client;