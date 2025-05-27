//=======[ Settings, Imports & Data ]==========================================
require('dotenv').config({ encoding: 'latin1' })
let PORT    = process.env.PORT_LOCAL;
let mqtt=require('mqtt')
let express = require('express');
let jwt = require('express-jwt');
let auth = require('./middleware/authentication');
let BedsList = require('./Monitoring/Bed-mon');
const cookieParser = require('cookie-parser')

//setting timezone
process.env.TZ = "America/Argentina/Buenos_Aires";


require('dotenv').config({path:'../.env'});

//const connection = require('./mysql-connector');
let app     = express();
let UserList = require('./Monitoring/User-mon');

let cors = require('cors');
let corsOptions={origin:'*' , optionsSuccessStatus:200};
console.log(PORT)

let mqttClientLocal = require('./mqtt/mqtt')

console.log(mqttClientLocal.connected)

let MQTT_TOPIC = "test"



// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(cookieParser())
//for letting api to work with cors
app.use(cors(corsOptions));
//configuring cors for sending credentials at login
// to parse received data
let bodyParser = require('body-parser');
const { request } = require('express');

// looking for router

let routerPatient = express = require('./routes/patient');
let routerUser = express = require('./routes/user');
let routerMessages = express = require('./routes/messages');
let routerNotes = express = require('./routes/notes');
let routerBeds = express = require('./routes/beds');
let routerUsersTable = express = require('./routes/usersTable');
let routerMedicalTable = express = require('./routes/medicalTable');
let routerQR = express = require('./routes/qr');
let routerEvents = express = require('./routes/events');
let routerLogEvents = express = require('./routes/logEvents');
let routerStatistics = express = require('./routes/Statistics');
let routerAuthenticate = express = require('./routes/authenticate');
let routerSpecTable = express = require('./routes/SpecTable');
let routerNurseSpecTable = express = require('./routes/nurseSpecTable');
let routerPatientSpecTable = express = require('./routes/patientTreatment');

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
