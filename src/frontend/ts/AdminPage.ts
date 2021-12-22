
function makeAdminPage(myMain:mainWindow){
    let page=document.getElementById("Panel Admin");    
    let content=` 
       
    <div>
    
        <nav  class="nav-extended" >
            <div style="background-color:#2196F3" class="nav-wrapper"  >
            <a href="#" class="brand-logo">Surix</a>
            <a href="#" data-target="mobile-demo" style="background-color:#2196F3;" class="sidenav-trigger"><i class="material-icons">menu</i></a>
            <ul id="nav-mobile" style="background-color:#2196F3" class="right hide-on-med-and-down">
                <li><a href="sass.html">Sass</a></li>
                <li><a href="badges.html">Components</a></li>
                <li><a href="collapsible.html">JavaScript</a></li>
            </ul>
            </div>
            <div class="nav-content">
            <ul class="tabs tabs-transparent" style="background-color:#2196F3;" >
                <li class="tab"><a href="#test1">Test 1</a></li>
                <li class="tab"><a class="active" href="#test2">Test 2</a></li>
                <li class="tab disabled"><a href="#test3">Disabled Tab</a></li>
                <li class="tab"><a href="#test4">Test 4</a></li>
            </ul>
            </div>
        </nav>

        <ul class="sidenav" id="mobile-demo">
            <li><a href="sass.html">Sass</a></li>
            <li><a href="badges.html">Components</a></li>
            <li><a href="collapsible.html">JavaScript</a></li>
        </ul>

        <div id="test1" class="col s12">Test 1</div>
        <div id="test2" class="col s12">Test 2</div>
        <div id="test3" class="col s12">Test 3</div>
        <div id="test4" class="col s12">Test 4</div>
                
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