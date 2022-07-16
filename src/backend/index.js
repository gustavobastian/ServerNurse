//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;
var mqtt=require('mqtt');
var express = require('express');
//const connection = require('./mysql-connector');
var app     = express();
//var utils   = require('./mysql-connector');

var mqttClientLocal = require('./mqtt/mqtt');

var cors = require('cors');
var corsOptions={origin:'*' , optionsSuccessStatus:200};



var MQTT_TOPIC = "test";


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
app.listen(PORT, function(req, res) {
  
  console.log("NodeJS API running correctly");
});
//=======[ End of file ]=======================================================
