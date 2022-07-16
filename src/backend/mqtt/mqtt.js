const { json } = require('express');
var mqtt=require('mqtt');

var MQTT_TOPIC = "test";
//var MQTT_ADDR = "mqtt://localhost";
//var MQTT_PORT = 1883;
var MQTT_ADDR = "ws://localhost";
var MQTT_PORT = 9001;
//=======[ Data ]================================
var pool = require('../mysql');





var client = mqtt.connect('ws://192.168.1.100:9001');
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
})

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
    client.publish('/User/System', response);  
  });
}

function getPacientIngo(pacientId){
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


client.on('message', function (topic, message,packet) {
  // message is Buffer
  console.log(packet, packet.payload.toString()); 
  let message_data=JSON.parse(message);
  console.log(JSON.parse(message));
  console.log(message_data._content); 

  if(message_data._content==="log in"){
    loginHere(message_data._username)
  }
  
  //client.end()
})



  module.exports = client;