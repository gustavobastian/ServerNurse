var pool = require('../mysql/index');
/**
 * class bedList contains information about states of beds
 * status==0 empty
 * status==1 with a patient(pending)
 * status==2 with a call
 * status==3 accepted call
 * status==4 in progress
 * status==5 calendar
 * status==6 solicita ayuda
 * status==7 done=>1
 */
class  BedsList  
{    
    constructor() 
    {
            this.bedlist=[{id:0,st:0,spec:0}];                        
    }
  /**
   * This function adds a bed to the status list, it is used only when adding a bed
   * @param {} id bedId
   * @returns 1
   */
    addBed(id) 
    {
         this.bedlist.push({id:id,st:0,spec:0});
         return 1;
    }
    /**
     * for testing porpuses
     * @returns 
     */
    printBedlist()
    {
        this.bedlist.forEach(element => 
            {
                console.log("id:"+element.id,"|st:"+element.st+"|spec:"+element.spec);
            });
        return 1;
    }
    /**
     * Alters the status of the bed
     * @param {} bedId 
     * @param {*} statusP 
     */
    setStatus(bedId,statusP)
    {
        var index=this.bedlist.findIndex(item=>item.id===bedId);       
        if(index>=0)
        {
            this.bedlist[index].st=statusP;
        }
        else
        {
            return;
        }
        this.printBedlist();
    }
   /**
     * Alters the treatment of the bed
     * @param {} bedId 
     * @param {*} treatmentP 
     */
    setTreat(bedId,treatP)
    {
        var index=this.bedlist.findIndex(item=>item.id===bedId);       
        if(index>=0)
        {
            this.bedlist[index].spec=treatP;
        }
        else
        {   
            return;
        }
        this.printBedlist();
    }
   /**
    * Get the current status of the bed
    * @param {} bedId 
    */
    getStatus(bedId)
    {
        var index=this.bedlist.findIndex(item=>item.id===bedId);           
        return this.bedlist[index].st    
    }
    /**
     * 
     */
    getBedStats()
    {
        return JSON.stringify(this.bedlist);
    }     

    /**
     * 
     */
     clearBedList()
     {
        this.bedlist=[{id:0,st:0,spec:0}];                        
     }     
};  

module.exports = BedsList;

