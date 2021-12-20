
function makeAdminPage(myMain:mainWindow){
    let page=document.getElementById("Panel Admin");    
    let content=` 
        <nav class="navbar blue navbar-default navbar-">Application</nav>
    <div>
    <h3>Admin</h3>
    <button id="myLogout" class= "btn-large blue waves-effect waves-dark" style="width:100%;">LOGOUT</button>
    </div>` ;
    page.innerHTML =content;
    let button_logout = myMain.getElement("myLogout");
    button_logout.addEventListener("click", myMain);
}    

function closeAdminPage(myMain:mainWindow){
    let form=document.getElementById("Panel Admin");    
    form.innerHTML="";
}