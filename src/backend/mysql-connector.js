//=======[ Settings, Imports & Data ]==========================================

var mysql = require('mysql');


  async function init() {
    console.log(1);
    await sleep(1000);
    console.log(2);
  }
  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  sleep(15000);

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
