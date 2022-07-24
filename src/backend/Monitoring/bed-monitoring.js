var pool = require('../mysql/index');
/**
 * class bedList contains information about states of beds
 * status==0 empty
 * status==1 with a pacient(pending)
 * status==2 with a call
 * status==3 accepted call
 * status==4 in progress
 * status==5 with message
 * status==6 done=>1
 */
 class  BedsList  {    
    constructor() {
         this.bedlist=[{id:0,st:0}];                        
    }
  /**
   * This function adds a bed to the status list, it is used only when adding a bed
   * @param {} id bedId
   * @returns 1
   */
    addBed(id) {
         this.bedlist.push({id:id,st:0});
         return 1;
    }
    /**
     * for testing porpuses
     * @returns 
     */
    printBedlist(){
     /*    this.bedlist.forEach(element => {
            console.log("id:"+element.id,"|st:"+element.st);
        });*/
        return 1;
    }
    /**
     * Alters the status of the bed
     * @param {} bedId 
     * @param {*} statusP 
     */
    setStatus(bedId,statusP){
        var index=this.bedlist.findIndex(item=>item.id===bedId);       
        
        this.bedlist[index].st=statusP;
        //this.printBedlist();
   }
   /**
    * Get the current status of the bed
    * @param {} bedId 
    */
   getStatus(bedId){
    var index=this.bedlist.findIndex(item=>item.id===bedId);           
    this.bedlist[index].st=statusP;
    //this.printBedlist();
    }
    /**
     * 
     */
    getBedStats(){
        return JSON.stringify(this.bedlist);
    }
};  

module.exports = BedsList;

