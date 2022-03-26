
function makeAdminPage(myMain:mainWindow){
    let page=document.getElementById("Panel Admin");    
    let pageAside=document.getElementById("plantillaLateral"); 
    
    
    let contentLateral=` 
    <section>
    <aside>
    <button type="button">Boton1</button>
    <br>
    <button type="button">Boton2</button>
    <br>
    <button type="button">Boton3</button>
    <br>
    </aside>
        <article>
        <p>Hola como estas jugando</p>
        </article>
    <aside>
    <button type="button">Boton1</button>
    <br>
    <button type="button">Boton2</button>
    <br>
    <button type="button">Boton3</button>
    <br>
    </aside>

    </section>
    `;
    pageAside.innerHTML =contentLateral;

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