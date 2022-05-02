//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

var express = require('express');
//const connection = require('./mysql-connector');
var app     = express();
//var utils   = require('./mysql-connector');
var cors = require('cors');
var corsOptions={origin:'*' , optionsSuccessStatus:200};


var mqtt=require('mqtt');

// to parse application/json
app.use(express.json()); 
// to serve static files

//for letting api to work with cors
app.use(cors(corsOptions));

// to parse received data
var bodyParser = require('body-parser');
const { request } = require('express');


// looking for router

var routerPacient = express = require('./routes/pacient');
var routerUser = express = require('./routes/user');
var routerMessages = express = require('./routes/messages');
var routerNotes = express = require('./routes/notes');
var routerBeds = express = require('./routes/beds');
var routerUsersTable = express = require('./routes/usersTable');
var routerMedicalTable = express = require('./routes/medicalTable');

app.use('/api/pacient',routerPacient);
app.use('/api/user',routerUser);
app.use('/api/messages',routerMessages);
app.use('/api/notes',routerNotes);
app.use('/api/beds',routerBeds);
app.use('/api/usersTable',routerUsersTable);
app.use('/api/medicalTable',routerMedicalTable);


var MQTT_TOPIC = "test";
var MQTT_ADDR = "mqtt://localhost";
var MQTT_PORT = 1883;
//=======[ Data ]================================



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

//response from server
app.post('/users/',function(req,res){
  
  let idAb=0;//req.params.id;
  console.log(req.body);
  
  if(req.body.pass>1000){response="admin";}
  else if(req.body.pass>100){response="medical";}
  else if(req.body.pass!=0) {response="nurse";}
  else {response="error";}

 
  res.send(response).status(200);  

  res.end();
});

//=======[ Main module code ]==================================================
app.listen(PORT, function(req, res) {
    
  console.log("NodeJS API running correctly");
});
//=======[ End of file ]=======================================================
