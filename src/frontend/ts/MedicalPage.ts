function makeMedicalPage(myMain:mainWindow){
    let page=document.getElementById("Panel Medical");    
    let content=` 
    <nav style="background-color:gray">
    <div class="nav-wrapper">
        <a href="#!" class="brand-logo left" style="margin-left: 15px;">Surix system</a>
        <ul id="nav-mobile" class="right" style="margin-right: 15px;">
        <!--<li><a href="#">LOGOUT</a></li>-->
        <li><button class="myLogout" id="myLogout">LOGOUT</button></li>
        </ul>        
    
    </div>
    </nav>
    <div>            
    <h3>Medical</h3>    
    </div>` ;
    page.innerHTML =content;
    let button_logout = myMain.getElement("myLogout");
    button_logout.addEventListener("click", myMain);
}    

function closeMedicalPage(myMain:mainWindow){
    let form=document.getElementById("Panel Medical");    
    form.innerHTML="";
}