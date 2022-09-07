var pool = require('../mysql/index');
/**
 * class PriorityList contains information about priority of beds
 * priority 0....5
 */
 class  PriorityList  {    
    constructor() {
         this.prioritylist=[{id:0,priority:0}];                        
    }
  /**
   * This function adds a bed to the priority list, it is used only when adding a bed
   * @param {} id bedId
   * @returns 1
   */
    addBedPriority(id,priorityP) {
         this.prioritylist.push({id:id,priority:priorityP});
         return 1;
    }
    /**
     * for testing porpuses
     * @returns 
     */
    printBedPrioritylist(){
         this.bedlist.forEach(element => {
            console.log("id:"+element.bedid,"|priority:"+element.priority);
        });
        return 1;
    }
    /**
     * Alters the priority of the bed
     * @param {} bedId 
     * @param {*} priority 
     */
    setPriority(bedId,priorityP){
        var index=this.prioritylist.findIndex(item=>item.id===bedId);       
        if(index>=0){
        this.prioritylist[index].priority=priorityP;}
        else{return}

       this.getBedPriority();
   }
   /**
    * Get the current status of the bed
    * @param {} bedId 
    */
   getPriority(bedId){
    var index=this.prioritylist.findIndex(item=>item.id===bedId);           
    return this.prioritylist[index].priority;    
    }
    /**
     * 
     */
    getBedPriority(){
        return JSON.stringify(this.prioritylist);
    }
};  

module.exports = PriorityList;