//=======[ Settings, Imports & Data ]==========================================

var mysql = require('mysql');


  

  var connection = mysql.createConnection({
    host     : 'mysql-server',
    port     : '3306',
    user     : 'root',
    password : 'userpass',
    database : 'NurseSystemDB'
});

//=======[ Main module code ]==================================================



connection.connect(function(err) {
    if (err) {
        console.error('Error while connect to DB: ' + err.stack);        
        
    }
   else{ 
       console.log('Connected to DB under thread ID: ' + connection.threadId);retry=1;
    }
});

module.exports = connection;

//=======[ End of file ]=======================================================
