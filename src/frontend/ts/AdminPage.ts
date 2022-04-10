
function makeAdminPage(myMain:mainWindow){
    let page=document.getElementById("Panel Admin");    
    
    let content=` 
       
    <div>
    
    
       
                
    <button id="myLogout" class= "btn-large  waves-effect waves-dark" style="width:100%;background-color:#2196F3;">LOGOUT</button>
    </div>` ;
    page.innerHTML =content;
    let button_logout = myMain.getElement("myLogout");
    button_logout.addEventListener("click", myMain);
}    

function closeAdminPage(myMain:mainWindow){
    let form=document.getElementById("Panel Admin");    
    form.innerHTML="";
}