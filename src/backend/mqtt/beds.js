var pool = require('../mysql/index');
//var BedsList = require('../Monitoring/Bed-mon');
/**
  *In this class we save all the bed related functions
  */
  class BedClass{
    constructor() {
   }

   

/**
 * Function that publish the bed info to topic
 * @param {*} bedId :number that identifies the pacient
 */
   getBedInfo(bedId,client){
    console.log("bed:"+JSON.parse(bedId));
    // system publising last 2 notes only
    let topic= "/Beds/"+bedId+"/info";
  
    pool.query('SELECT *  \
    FROM `Bed` as b \
    WHERE b.bedId = ?',[bedId], function(err, result, fields) {
      if (err|| result.length==0) {
          console.log("error")
          client.publish(topic, JSON.stringify("Error"));          
          
      }
      else{
     // console.log(result)
       client.publish(topic, JSON.stringify(result));  }
    });
    
  }
    /**
     * Function that publish the medical Table id to topic
     * @param {*} bedId :number that identifies the patient
     * Message form:
     * {"_bedId":1,"_content":"consulta lista MDT"
     * ,"_username":"system","_type":17}
     */
    getBedMedicalTableInfo(bedId,client){
        console.log("bed:"+JSON.parse(bedId));
        
        let topic= "/Beds/"+bedId+"/MDT";
        
        pool.query('SELECT User.lastname, User.userId from   \
        MedicalTable JOIN Patient USING (userTableId) \
        JOIN User USING (userId) \
        WHERE `Patient`.`bedId`= ?',[bedId], function(err, result, fields) {
        if (err|| result.length==0) {
            console.log("error")
            client.publish(topic, JSON.stringify("Error"));       
            
        }
        else{
        // console.log(result)
        client.publish(topic, JSON.stringify(result));  }
        });  
    }

  
  
}
var Beds= new BedClass();
module.exports= Beds;