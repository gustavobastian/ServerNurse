//=======[ Settings, Imports & Data ]==========================================
require('dotenv').config({ encoding: 'latin1' })
var PORT    = process.env.PORT_LOCAL;
var mqtt=require('mqtt')
var express = require('express');
var jwt = require('express-jwt');
var auth = require('./middleware/authentication');
var BedsList = require('./Monitoring/Bed-mon');
const cookieParser = require('cookie-parser')

//setting timezone
process.env.TZ = "America/Argentina/Buenos_Aires";


//require('dotenv').config({path:'./.env'});

//const connection = require('./mysql-connector');
var app     = express();
var UserList = require('./Monitoring/User-mon');

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

var routerPatient = express = require('./routes/patient');
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
var routerPatientSpecTable = express = require('./routes/patientTreatment');

app.use('/api/patient',auth.isAuthenticated,routerPatient);
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
app.use('/api/specTable',auth.isAuthenticated,routerSpecTable);
app.use('/api/nurseSpecTable',auth.isAuthenticated,routerNurseSpecTable);
app.use('/api/treatment',auth.isAuthenticated,routerPatientSpecTable);


//=======[ Main module code ]==================================================
app.listen(PORT, function(req, res) {
  
  console.log("NodeJS API running correctly");
});
//=======[ End of file ]=======================================================
