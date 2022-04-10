class mainWindow implements EventListenerObject,PostResponseListener {
    public name: string;
    public mode: string;
    public localUser: User;
    public framework = new Framework();

    constructor(name: string, mode: string){
        this.name=name;
        this.mode=mode;
        this.localUser = new User();
    }


    public handleEvent(event: Event):void{
        
        const evInput =event.target as HTMLElement; 
        let evName=evInput.id.split("_"); 
        if(evInput.innerText=="LOGOUT")
                {
                closeMedicalPage(this);
                closeNursePage(this);
                closeAdminPage(this);
                makeLogForm(this);                
                this.mode="inLog";
                return;
               }

        if(this.mode=="inLog") {             
            
        if((event.type=="click")&&(evInput.innerText="SEND")){

            getForm(this);
            let information = {
                "id":this.localUser.name,
                "pass": this.localUser.password,
              }; 
            let data= JSON.stringify(information);  
            let url="http://localhost:8000/users/";
            this.framework.requestPost(url,this, data);

           }
           return;
        }
        else if(this.mode=="inMedical") {      
            if(event.type=="click"){
            /*    let information = {
                    "id":1,
                    "status": "jeje",
                  }; 
                let data= JSON.stringify(information);  
                let url="http://localhost:8000/users/";
                this.framework.requestPost(url,this, data);
*/
                }
            return;     
            } 

    }

    public getElement(id:string):HTMLElement{
        return document.getElementById(id);
    }

    public handlerPostResponse(status: number, response: string) {
        if(response=="error"){alert("Error");return;}
        else{
            console.log(response);
            if(response=="admin"){this.mode="inAdmin";}
            else if(response=="nurse"){this.mode="inNurse";}
            else if(response=="medical"){this.mode="inMedical";}
            else{return;}
            
            closeLogForm(this);
            if(this.mode=="inAdmin")
            {
                makeAdminPage(this);                
            }
            else if(this.mode=="inMedical")
            {
                makeMedicalPage(this);
            }
            else if(this.mode=="inNurse")
            {
                makeNursePage(this);
            }
        }


    }
}

window.onload = function(){
    let principal= new mainWindow("Principal","inLog");
    console.log("here");
    
    if(principal.mode=="inAdmin")
            {
                makeAdminPage(principal);                
            }
            else if(principal.mode=="inMedical")
            {
                makeMedicalPage(principal);
            }
            else if(principal.mode=="inNurse")
            {
                makeNursePage(principal);
            }
            else if(principal.mode=="inLog")
            {
                closeMedicalPage(principal);
                closeNursePage(principal);
                closeAdminPage(principal);
                makeLogForm(principal); 
            }


    
    
}