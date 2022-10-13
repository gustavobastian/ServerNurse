var pool = require('../mysql/index');
const bcrypt = require("bcrypt");
const userList = require('../Monitoring/User-mon');

/**
  *In this class we save all the calendar related functions
  */
  class UserClass{
    constructor() {
   }
    /**
     * Function that publishes the state of each user in the broker
     * @param {}  
     */
    publishUserStates(client,UserList){
        
        let topic= "/User/status";
        var response = UserList.getUserStats();
        client.publish(topic, response);  
        
    }
   /***
 * Functions that sets the status of the user in 1 and sends to the app the mode of use
 */
    async loginHere(username, password,client,UserList){
    console.log("user:"+username.toString()); 
    console.log("pass:"+password.toString()); 
    //password2=password.toString();  
    //console.log(password2)
    let logeado=false;
    let response_conform={idNumber:0, mode:99};
    //client.publish('/User/Info', c) ;
    pool.query('Select * from User WHERE username=?', [username], function (err, result, fields) {
            if (err) {
                console.log("error:" + err);
                var response = JSON.stringify(response_conform);
                console.log(response);
                //client.publish('/User/System/response', response);  
                client.publish('/User/' + username + '/response', response);
                return;
            }
            else {


                if (result[0] != null) { ///I have a user in the database

                    let estado = UserList.getStatus(result[0].userId);
                    console.log("Estado:" + estado);
                    UserList.setStatus(result[0].userId, 1);

                    if (estado < 1) { ///The user is not already logged
                        bcrypt.compare(password, result[0].password, (err, resultComp) => {
                            if (resultComp == true) {
                                console.log('logueado');

                                ///User/System/{"idNumber":1,"mode":"doctor"}
                                response_conform = { idNumber: result[0].userId, mode: result[0].occupation };
                                logeado = true;
                                let data = result[0].userId;
                                console.log("data:" + data);
                                UserList.setStatus(data, 1);
                                //check if user is logged
                                UserList.printUserList();
                            }
                            if (resultComp == false) {
                                console.log('no logueado');
                                logeado = false;
                            }
                        });
                    }

                    if ((estado < 1)) {
                        response_conform = { idNumber: result[0].userId, mode: result[0].occupation }; //------------------------------>Quitar cuando use el hash
                    }
                }

                var response = JSON.stringify(response_conform);
                console.log(response);
                client.publish('/User/' + username + '/response', response);

                let topic= "/User/status";
                var response = UserList.getUserStats();
                client.publish(topic, response);  

            }
        });
   }
   

    /***
 * Functions that sets the status of the user in 0 and response ok to the app
 */
    loginOut(username,client,UserList){
        pool.query('Select * from User WHERE username=?',[username], function(err, result, fields) {
        if (err) {
            console.log(error)
            return;
        }   
    
    
        let response_conform={idNumber:result[0].userId, mode:"ok"};
    
        var response = JSON.stringify(response_conform);
        console.log(response);
        client.publish('/User/'+username+'/response', response);  
        
        
        let data=result[0].userId;
        console.log("data:"+data);
        UserList.setStatus(data,0);
        let topic= "/User/status";
        var response = UserList.getUserStats();
        client.publish(topic, response);  
        });
    }
}
  
 
var User= new UserClass();
module.exports= User;