//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

var express = require('express');
const connection = require('./mysql-connector');
var app     = express();
var utils   = require('./mysql-connector');

var mqtt=require('mqtt');

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));
// to parse received data
var bodyParser = require('body-parser');
const { request } = require('express');


var MQTT_TOPIC = "test";
var MQTT_ADDR = "mqtt://localhost";
var MQTT_PORT = 1883;
//=======[ Data ]================================


console.log("hola");
var client = mqtt.connect('mqtt://localhost:1883');
client.on('connect', function () {
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

//=======[ MQTT ]================================
/*
var client = mqtt.connect(MQTT_ADDR, {
    port: MQTT_PORT,
    clientId: 'bgtestnodejs232323',
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    connectTimeout: 1000,
    debug: true
  });

    client.on("connect",function(){	
        console.log("connected");
    });

    client.on('error', function (err) {
        console.log(err)``
        client.end()
    })
*/
//=======[ Main module code ]==================================================


//=======[ End of file ]=======================================================
