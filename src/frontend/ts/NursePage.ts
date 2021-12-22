function makeNursePage(myMain:mainWindow){
    let page=document.getElementById("Panel Admin");    
    let content=` 
        <nav class="navbar green navbar-default navbar-">Application</nav>
    <div>
    <h3>Nurse</h3>
    <button id="myLogoutNurse" class= "btn-large green waves-effect waves-dark" style="width:100%;">LOGOUT</button>
    </div>` ;
    page.innerHTML =content;
    
    let button_logout = myMain.getElement("myLogoutNurse");
    button_logout.addEventListener("click", myMain);
}
function closeNursePage(myMain:mainWindow){
    let form=document.getElementById("Panel Nurse");    
    form.innerHTML="";
}