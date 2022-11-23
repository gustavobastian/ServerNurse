
/**
 * class bedUserList contains information about who is attending the patient and type of event
 * 1:caller
 * 2:calendar
 */
class  BedsUserList  
{   
    constructor() 
    {
         this.beduserlist=[{bedId:0,userId:0,type:0}];                        
    }
  /**
   * This function adds a bed - user to the list, it is used only when adding a bed
   * @param {} id bedId
   * @returns 1
   */
    addBedUser(bedid,userid,typeP) 
    {
        this.beduserlist.push({bedId:bedid,userId:userid,type:typeP});
        return 1;
    }
    
    /**
     * for testing porpuses
     * @returns 
     */
    printBedUserlist()
    {
        this.beduserlist.forEach(element => 
            {
                console.log("bedId:"+element.bedId,"|userId:"+element.userId,"|type:"+element.type);
            });
        return 1;
    }
    
   /**
    * Get the id of the nurse attending
    * @param {} bedId 
    */
    getId(bedId)
    {    
        var index=this.beduserlist.findIndex(item=>item.bedId===bedId);           
        if(index>0)
        {
            return this.beduserlist[index].userId;
        }
        else
        {
            return this.beduserlist[0].userId;
        }    
    }
    /**
    * Get the kind of event
    * @param {} bedId 
    */
    getTypeId(bedId)
    {
        var index=this.beduserlist.findIndex(item=>item.bedId===bedId);           
        if(index>0)
        {            
            return this.beduserlist[index].type;
        }
        else
        {
            return this.beduserlist[0].type;
        }    
    }

    removeData(bedId)
    {
        var index=this.beduserlist.findIndex(item=>item.bedId===bedId);   
        if (index > -1) 
        { 
            this.beduserlist.splice(index, 1);
        }        
        console.log(JSON.stringify(this.beduserlist));        
    }
    
    /**
     * 
     */
    getBedUserStats()
    {
        return JSON.stringify(this.beduserlist);
    }
};  

module.exports = BedsUserList;

