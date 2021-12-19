function makeLogForm(id:HTMLElement){
    //let form=document.getElementById("log-form");
    let form=id;
    let content='<div>';

    content += `
               <div class="row">
                    <div class="col s12 m4 offset-m4">
                            <div class="card">
                                    <div class="card-action teal lighten-1 white-text">
                                        <center>
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
                                                <button class= "btn-large waves-effect waves-dark" style="width:100%;">SEND</button>
                                                
                                            </div><br>
                                        </center>    
                                    </div>
                            </div>
                    </div>        
                </div>`;    
    
    content +='</div>';
    form.innerHTML = content;
}

window.onload = function(){
    
    let form=document.getElementById("log-form");
    makeLogForm(form);
    
}