//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;
var mqtt=require('mqtt')
var express = require('express');
//const connection = require('./mysql-connector');
var app     = express();
//var utils   = require('./mysql-connector');
var BedsList = require('./Monitoring/Bed-mon');
var UserList = require('./Monitoring/User-mon');



var cors = require('cors');
var corsOptions={origin:'*' , optionsSuccessStatus:200};


var mqttClientLocal = require('./mqtt/mqtt')
var MQTT_TOPIC = "test"



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
var routerQR = express = require('./routes/qr');
var routerEvents = express = require('./routes/events');

app.use('/api/pacient',routerPacient);
app.use('/api/user',routerUser);
app.use('/api/messages',routerMessages);
app.use('/api/notes',routerNotes);
app.use('/api/beds',routerBeds);
app.use('/api/usersTable',routerUsersTable);
app.use('/api/medicalTable',routerMedicalTable);
app.use('/api/QR',routerQR);
app.use('/api/events',routerEvents);



//=======[ Initialization of beds and user States]================================


/**
 * playing with bedlist
 */ 


//=======[ Main module code ]==================================================
app.listen(PORT, function(req, res) {
  
  console.log("NodeJS API running correctly");
});
//=======[ End of file ]=======================================================
