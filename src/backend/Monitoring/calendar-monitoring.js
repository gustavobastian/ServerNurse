var pool = require('../mysql/index');

/**
 * class CalendarList contains information about events that has been launched recently... it is supossed to be cleaned right after the event is closed
 * 
 */
 class  CalendarList  {
    
    constructor() {
         this.CalendarList=[{calendarId:0,bedId:0,note:null}];                
        
    }
  /**
   * This function adds a user to the status list, it is used only when adding a user
   * @param {} calendarIdP: id of calendar event
   * @param {} bedIdP : number of bed of the event
   * @param {} noteP :note of the event
   * @returns 1
   */
    addCalendar(calendarIdP,bedIdP,noteP) {
         this.CalendarList.push({calendarId:calendarIdP,bedId:bedIdP,note:noteP});
         this.printCalendarList();
         return 1;
    }
    /**
     * for testing porpuses
     * @returns 
     */
    printCalendarList(){
         this.CalendarList.forEach(element => {
            console.log("id:"+element.calendarId,"|bedID:"+element.bedId,"note:"+element.note);
        });
        return 1;
    }
   /**
    * Get the note of the event
    * @param {} calendarId 
    */
   getNote(calendarIdP){
    var index=this.CalendarList.findIndex(item=>item.calendarId===calendarIdP);           
    return this.CalendarList[index].note;
    
    }

    /**
    * Get the calendarIp
    * @param {} calendarId 
    */
   getCalendarId(bedIdP){
    var index=this.CalendarList.findIndex(item=>item.bedId===bedIdP);           
    return this.CalendarList[index].calendarId;
    
    }

    /**
    * remove the calendar event from list
    * @param {} calendarId 
    */
    removeCalendar(calendarIdP){
        var index=this.CalendarList.findIndex(item=>item.calendarId===calendarIdP);           
        this.CalendarList.splice(index,1);
        this.printCalendarList();
        }
    
    /**
    * remove the calendar event from list
    * @param {} bedId 
    */
     removeCalendarBed(bedIdP){
        var index=this.CalendarList.findIndex(item=>item.bedId===bedIdP);           
        this.CalendarList.splice(index,1);
        
        }    

    /**
     * get the list of the calendar events 
     */
    getCalendarList(){
        return JSON.stringify(this.CalendarList);
    }
};  

module.exports = CalendarList;

