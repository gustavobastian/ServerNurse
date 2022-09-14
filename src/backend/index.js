//=======[ Settings, Imports & Data ]==========================================
require('dotenv').config({ encoding: 'latin1' })
var PORT    = process.env.PORT_LOCAL;
var mqtt=require('mqtt')
var express = require('express');
var jwt = require('express-jwt');
var auth = require('./middleware/authentication');
const cookieParser = require('cookie-parser')


//require('dotenv').config({path:'./.env'});

//const connection = require('./mysql-connector');
var app     = express();
//var utils   = require('./mysql-connector');
var BedsList = require('./Monitoring/Bed-mon');
var UserList = require('./Monitoring/User-mon');
var PriorityList = require('./Monitoring/P-mon');



var cors = require('cors');
var corsOptions={origin:'*' , optionsSuccessStatus:200};
console.log(PORT)

var mqttClientLocal = require('./mqtt/mqtt')
var MQTT_TOPIC = "test"



// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(cookieParser())
//for letting api to work with cors
app.use(cors(corsOptions));
//configuring cors for sending credentials at login


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
var routerLogEvents = express = require('./routes/logEvents');
var routerStatistics = express = require('./routes/Statistics');
var routerAuthenticate = express = require('./routes/authenticate');
var routerSpecTable = express = require('./routes/SpecTable');
var routerNurseSpecTable = express = require('./routes/nurseSpecTable');
/*
app.use('/api/pacient',auth.isAuthenticated,routerPacient);
app.use('/api/user',auth.isAuthenticated,routerUser);
app.use('/api/messages',auth.isAuthenticated,routerMessages);
app.use('/api/notes',auth.isAuthenticated,routerNotes);
app.use('/api/beds',auth.isAuthenticated,routerBeds);
app.use('/api/usersTable',auth.isAuthenticated,routerUsersTable);
app.use('/api/medicalTable',auth.isAuthenticated,routerMedicalTable);
app.use('/api/QR',auth.isAuthenticated,routerQR);
app.use('/api/events',auth.isAuthenticated,routerEvents);
app.use('/api/logEvents',auth.isAuthenticated,routerLogEvents);
app.use('/api/Statistics',auth.isAuthenticated,routerStatistics);
app.use('/api/authentication',routerAuthenticate);
*/
//without aut...for development
app.use('/api/pacient',routerPacient);
app.use('/api/user',routerUser);
app.use('/api/messages',routerMessages);
app.use('/api/notes',routerNotes);
app.use('/api/beds',routerBeds);
app.use('/api/usersTable',routerUsersTable);
app.use('/api/medicalTable',routerMedicalTable);
app.use('/api/QR',routerQR);
app.use('/api/events',routerEvents);
app.use('/api/logEvents',routerLogEvents);
app.use('/api/Statistics',routerStatistics);
app.use('/api/authentication',routerAuthenticate);
app.use('/api/specTable',routerSpecTable);
app.use('/api/nurseSpecTable',routerNurseSpecTable);


//=======[ Initialization of beds and user States]================================


/**
 * playing with bedlist
 */ 


//=======[ Main module code ]==================================================
app.listen(PORT, function(req, res) {
  
  console.log("NodeJS API running correctly");
});
//=======[ End of file ]=======================================================
