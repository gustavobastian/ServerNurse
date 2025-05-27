let pool = require('../mysql/index');

/**
  *In this class we save all the calendar related functions
  */
class CalendarClass
{
  
  async getCalendarNotes(bedId,client,CalendarList)
  {
    let topic= "/Beds/"+bedId+"/CalendarNote";
    console.log("asking for calendar events ...inside function")
    let note =CalendarList.getNoteBed(bedId);    
    console.log("note:" + note)
    client.publish(topic, JSON.stringify(note));  
    console.log("*********************")
  }
}

let Calendar= new CalendarClass();
module.exports= Calendar;