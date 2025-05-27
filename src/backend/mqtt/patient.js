var pool = require('../mysql/index');

 /**
  *In this class we save all the Patient functions
  */
 class PatientClass
 {    

    /**
     * Function that publish the pacient id to topic
     * @param {*} bedId :number that identifies the pacient
     */
    getBedPatientInfo(bedId,client)
    {
        console.log("bed:"+JSON.parse(bedId));
        let topic= "/Beds/"+bedId+"/Pacient";
        pool.query('SELECT patientId FROM `Bed` as b JOIN `Patient` as P USING (bedId) WHERE b.bedId = ?',
            [bedId], function (err, result, fields) 
        {
            if (err|| result.length==0) 
            {
                console.log("error")
                client.publish(topic, JSON.stringify("Error"));                          
            }
            else
            {        
                client.publish(topic, JSON.stringify(result));  
            }
        });  
    }
    /**
     * function that gets all the pacients  of a specified  doctor 
     * @param {message}: username of the doctor
     */

    getPatientsBeds(message,client)
    {        
        console.log("Doctor:"+message);
        let topiclocal= "/User/"+message+"/Pacients";
        pool.query('SELECT DISTINCT bedId,patientId FROM `Patient` as p JOIN `MedicalTable` as Mt JOIN `User` as u JOIN `UsersTable` as uT WHERE p.userTableId = uT.userTableId AND Mt.userTableId=uT.userTableId  AND u.userId = Mt.userId AND u.userId=? ',[message], function(err, result, fields) 
        {
            if (err || result.length==0) 
            {
                console.log("error-asking for beds")
                console.log("error:"+err)
                client.publish(topiclocal, JSON.stringify("Error"));          
            }    
            else
            {
                client.publish(topiclocal, JSON.stringify(result)); 
            }
        });  
    }

    /**
     * Function that returns the pacient information to topic
     * @param {*} patientId :number that identifies the pacient
     */
    getPatientInfopatientId(patientId,client)
    {
        console.log("patient:"+patientId);                            
        let topic= "/Pacient/"+patientId+"/info";
        pool.query('Select * from Patient where patientId = ?',[patientId], function(err, result, fields) 
        {
            if (err || result.length==0) 
            {
                console.log("error:",err)
                client.publish(topic, JSON.stringify("Error"));          
            }    
            else
            {
                client.publish(topic, JSON.stringify(result));  
            }
        });         
    }

    /**
     * Function that returns the pacient notes to topic
     * @param {*} patientId :number that identifies the pacient
     */
    getPatientNotesPatientId(patientId,client)
    {
        console.log("patient:"+(patientId));
        console.log("asking for notes:");
        // system publising last 2 notes only
        let topic= "/Pacient/"+patientId+"/notes";
        pool.query('SELECT DISTINCT notesId,note,state FROM `Notes` as n JOIN `NotesTable` as nt JOIN `Patient` as p WHERE n.notesTableId = nt.notesTableId AND p.notesTableId = nt.notesTableId AND patientId = ? ORDER BY notesId DESC ',patientId, function(err, result, fields) 
        {
            if (err || result.length==0) 
            {
                console.log("error:",err)
                client.publish(topic, JSON.stringify("Error"));                          
            }
            else
            {
                client.publish(topic, JSON.stringify(result));  
            }
        });        
    }

    /**
     * Function that deletes the patient 
     * @param {*} notesId :number that identifies the note
     */
    deletePatientNotesNotesId(notesId,client)
    {
        console.log("noteId:"+(notesId._content));
        console.log("deleting:");
        // system publising last 2 notes only        
        pool.query('DELETE FROM Notes WHERE `Notes`.`notesId` = ?', [notesId._content], function(err, result, fields) 
        {
            if (err || result.length==0) 
            {
                console.log("error:",err)           
            }
            else
            {
                console.log(result)  
            }
        });   
    }

    /**
     * Function that put a note on the patient(saves it to the database)
     * @param {*} patientId :number that identifies the patient
     */
    setPatientNotesPatientId(patientId, note,client)
    {
        pool.getConnection(function(err, connection) 
        {
            connection.beginTransaction(function(err) 
            {
                if (err) 
                {                  //Transaction Error (Rollback and release connection)
                    connection.rollback(function() {
                        console.log("aqui no estoy")
                        connection.release();
                        //Failure
                    });
                    return;
                } 
                
                console.log("aqui estoy")
                connection.query('INSERT INTO `Notes` (`note`,`state`,`notesTableId`) VALUES (?,?,?)', [note,"activa",patientId], function(err, results) 
                {
                    if (err) 
                    {          //Query Error (Rollback and release connection)
                        console.log(err);
                        connection.rollback(
                            function (){
                                connection.release();     //Failure
                            });
                        return
                    } 
                    
                    connection.commit(function(err) 
                        {
                            if (err) 
                            {
                                connection.rollback(function() 
                                {
                                    connection.release();
                                    //Failure
                                });
                            } 
                            connection.release();                                
                        });
                    }
                );
            }
            );
        });    
    }

}
let Patient= new PatientClass();
module.exports= Patient;