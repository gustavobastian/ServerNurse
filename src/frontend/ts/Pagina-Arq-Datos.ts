export function makeArquitecturaPage(myMain:mainWindow){
    let page=document.getElementById("ArquitecturaDatos");    
    let content=` 
    <nav style="background-color:gray">
    <div class="nav-wrapper">
        <a href="#!" class="brand-logo left" style="margin-left: 15px;">Arquitectura de Datos</a>
        <ul id="nav-mobile" class="right" style="margin-right: 15px;">
        <!--<li><a href="#">LOGOUT</a></li>
        <li><button class="myLogout" id="myLogout">LOGOUT</button></li>
        </ul>     -->       
    </div>
    </nav>
    <div>            
    <h3>Datos</h3>
    
    <!--part of forms-->

    <div id="bed">
    <button  id="bed-page" style="width:20%;height:30px" >Camas</button>
    </div>
    <div id="medical">
    <button id="medical-page" style="width:20%;height:30px" >Medicos</button>
    </div>
    <div id="pacient">
    <button id="pacient-button" style="width:20%;height:30px" >Pacientes</button>
    </div>
    <div id="mensaje">
    <button id="mensaje-page" style="width:20%;height:30px" >Mensajes</button>
    </div>   


    <button id="myLogout" class= "btn-large  waves-effect waves-dark" style="width:100%;background-color:gray;">home</button> 
    </div>` ;
    page.innerHTML =content;
    let button_logout = myMain.getElement("myLogout");
    button_logout.addEventListener("click", myMain);
    
    let button_beds = myMain.getElement("bed-page");
    button_beds.addEventListener("click", myMain);

    let button_Medical = myMain.getElement("medical-page");
    button_Medical.addEventListener("click", myMain);

    let button_Mensaje = myMain.getElement("mensaje-page");
    button_Mensaje.addEventListener("click", myMain);

    let button_Paciente = myMain.getElement("pacient-button");
    button_Paciente.addEventListener("click", myMain);

}

export function BedsCall(myMain:mainWindow){

    let page=document.getElementById("ArquitecturaDatos");    
    let content=` 
    <nav style="background-color:gray">
    <div class="nav-wrapper">
        <a href="#!" class="brand-logo left" style="margin-left: 15px;">Arquitectura de Datos</a>
        <ul id="nav-mobile" class="right" style="margin-right: 15px;">
        <!--<li><a href="#">LOGOUT</a></li>
        <li><button class="myLogout" id="myLogout">LOGOUT</button></li>
        </ul>     -->       
    </div>
    </nav>
    <div>            
    <h3>Camas</h3>
    
    <!--part of forms-->
    <ul>
    <li>    <div id="ver_camas">
        <button  id="vercamas" style="width:50%;height:30px" >VerCamas</button>
        </div>
    </li>         
    <li>
        <div id="agregar_camas">
        <button  id="vercamas" style="width:50%;height:30px" >agregarCamas</button>
        </div>
    </li>  
    </ul>

    <button id="myLogout" class= "btn-large  waves-effect waves-dark" style="width:100%;background-color:gray;">home</button> 
    </div>` ;
    page.innerHTML =content;
    let button_logout = myMain.getElement("myLogout");
    button_logout.addEventListener("click", myMain);
    
    let button_beds = myMain.getElement("bed-page");
    button_beds.addEventListener("click", myMain);

    let button_Medical = myMain.getElement("medical-page");
    button_Medical.addEventListener("click", myMain);

    let button_Mensaje = myMain.getElement("mensaje-page");
    button_Mensaje.addEventListener("click", myMain);

    let button_Paciente = myMain.getElement("pacient-button");
    button_Paciente.addEventListener("click", myMain);

}



export function closeArquitecturaPage(myMain:mainWindow){
    let form=document.getElementById("ArquitecturaDatos");    
    form.innerHTML="";
}

