function makeLogForm(myMain:mainWindow){
    let form=document.getElementById("log-form");    
    let content='<div>';

    content += `
               <div class="row">
                    <div class="col s12 m4 offset-m4">
                            <div class="card">
                                    <div id="title" class="card-action blue lighten-1 white-text">
                                        <center>
                                        <h10>SuriX Systems</h10>                                        
                                        <h3>LOGIN</h3>
                                        </center>
                                    </div>
                                    <div class="card-content">
                                        <center>
                                            <div class="form-field">
                                                <input type="text" id="username">
                                                <label for="username">Username</label>                                                
                                            </div><br>
                                            <div class="form-field" >
                                                <input type="password" id="password">
                                                <label for="password">PassWord</label>                                                
                                            </div><br>                                          
                                            <div class="form-field">
                                                <button id="send" class= "btn-large blue waves-effect waves-dark" style="width:100%;">SEND</button>
                                            </div><br>
                                        </center>    
                                    </div>
                            </div>
                    </div>        
                </div>`;    
    
    content +='</div>';
    form.innerHTML = content;
    let button_send = myMain.getElement("send");
    button_send.addEventListener("click", myMain);

}
function closeLogForm(myMain:mainWindow){
    let form=document.getElementById("log-form");    
    form.innerHTML="";
}

function getForm(myMain:mainWindow){
    let localName=<HTMLInputElement>myMain.getElement("username");
    let localPass=<HTMLInputElement>myMain.getElement("password");
    myMain.localUser.name=localName.value;
    myMain.localUser.password=localPass.value;
}