var pool = require('../mysql/index');

/**
 * class UserList contains information about states of users
 * status==0 not logged in
 * status==1  logged in
 * status==2  in action (only for nurses)
 */
class  UserList  
{
    constructor() 
    {
        this.UserList=[{id:0,st:0}];
    }
  /**
   * This function adds a user to the status list, it is used only when adding a user
   * @param {} id userId
   * @returns 1
   */
    addUser(id) 
    {
        this.UserList.push({id:id,st:0});
        return 1;
    }
    /**
     * for testing porpuses
     * @returns 
     */
    printUserList()
    {
        return 1;
    }
    /**
     * Alters the status of the user
     * @param {} userId 
     * @param {*} statusP 
     */
    setStatus(userId,statusP)
    {
        var index=this.UserList.findIndex(item=>item.id===userId);       
        this.UserList[index].st=statusP;
    }
   /**
    * Get the current status of the user(logged or not)
    * @param {} userId 
    */
    getStatus(userId)
    {
        var index=this.UserList.findIndex(item=>item.id===userId);           
        return this.UserList[index].st;
    }
    /**
     * 
     */
    getUserStats()
    {
        return JSON.stringify(this.UserList);
    }
};  
module.exports = UserList;

