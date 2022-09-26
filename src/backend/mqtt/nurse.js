var pool = require('../mysql/index');

 /**
  *In this class we save all the nurse functions
  */
 class NurseClass{
    constructor() {
   }
 
   getNurseSpecs(message, client){
    console.log(message);
    
    pool.query('Select NurseSpecTable.nurseSpecId,User.userId, SpecTable.Name, NurseSpecTable.specId  \
    from NurseSpecTable \
    INNER JOIN SpecTable on SpecTable.id= NurseSpecTable.specId\
    INNER JOIN User ON User.userId=NurseSpecTable.userId \
    WHERE username=?',[message], function(err, result, fields) {
      if (err || result.length==0) {
          console.log("error-asking for beds")
          console.log("error:"+err)        
          client.publish(topiclocal, JSON.stringify("Error"));          
      }    
      else{
      let topiclocal= "/User/"+result[0].userId+"/Specs";
      client.publish(topiclocal, JSON.stringify(result)); }
    });
    return;
   }
   
}
var Nurse= new NurseClass();
module.exports= Nurse;