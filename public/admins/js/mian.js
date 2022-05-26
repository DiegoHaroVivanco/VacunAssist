//Empieza js de vacunatorios
var vac;
var nomVac;

function mostrarVacunatorios(){
    document.getElementById('vacunatorios').style.display = 'block';
}

function mostrar1(){
    document.getElementById('formulario1').style.display = 'block';
    vac = document.getElementById("vacunatorio1");
}

function mostrar2(){
    document.getElementById('formulario2').style.display = 'block';
    vac = document.getElementById("vacunatorio2");
}

function mostrar3(){
    document.getElementById('formulario3').style.display = 'block';
    vac = document.getElementById("vacunatorio3");
}

function capturarInputA() {
    vac = document.getElementById("vacunatorio1");
}

function capturar1(){
    nomVac = document.getElementById('nomVac1').value;
    localStorage.setItem("nom1",nomVac);
    cambiar(nomVac);
}

function capturarInputB() {
    vac = document.getElementById("vacunatorio2");
}

function capturar2(){
    nomVac = document.getElementById('nomVac2').value;
    localStorage.setItem("nom2",nomVac);
    cambiar(nomVac);
}

function capturarInputC() {
    vac = document.getElementById("vacunatorio3");
}

function capturar3(){
    nomVac = document.getElementById('nomVac3').value;
    localStorage.setItem("nom3",nomVac);
    cambiar(nomVac);
}

function cambiar(nom){
    let vac1 = document.getElementById("vacunatorio1");
    let vac2 = document.getElementById("vacunatorio2");
    let vac3 = document.getElementById("vacunatorio3");
    if(nom.toUpperCase() != vac1.innerText.toUpperCase() && nom.toUpperCase() != vac2.innerText.toUpperCase() && nom.toUpperCase() != vac3.innerText.toUpperCase()){
        vac.innerText = nom;
    }
    else alert ('ya existe un vacunatorio con ese nombre');
}

//Empieza js de Stock

var stockNuevo;
var stockAct;

function mostrarVacunatorios2(){
    document.getElementById('vacunatorios2').style.display = 'block';
}

//Funciones stock vacunatorio 1

function mostrarStock1A(){
    document.getElementById('gripe1').style.display = 'block';
    document.getElementById('form1').style.display = 'block';
}

function capturarActual1() {
    stockAct = document.getElementById('gripe1');
}

function mostrarStock1B(){
    document.getElementById('fiebre1').style.display = 'block';
    document.getElementById('form2').style.display = 'block';
}

function capturarActual2() {
    stockAct = document.getElementById('fiebre1');
}

function mostrarStock1C(){
    document.getElementById('divM').style.display = 'block';
    document.getElementById('form3M').style.display = 'block';
    document.getElementById('divP').style.display = 'block';
    document.getElementById('form3P').style.display = 'block';
}

function capturarActual3M(){
    stockAct = document.getElementById('covid1M');
}

function capturarActual3P(){
    stockAct = document.getElementById('covid1P');
}

function capturarA(){
    stockNuevo = document.getElementById('nuevoStock1').value;
    cambiarStock(stockNuevo);
}

function capturarB(){
    stockNuevo = document.getElementById('nuevoStock2').value;
    cambiarStock(stockNuevo);
}

function capturarCM(){
    stockNuevo = document.getElementById('nuevoStock3M').value;
    cambiarStock(stockNuevo);
}

function capturarCP(){
    stockNuevo = document.getElementById('nuevoStock3P').value;
    cambiarStock(stockNuevo);
}

//Funciones stock vacunatorio 2

function mostrarStock2A(){
    document.getElementById('gripe2').style.display = 'block';
    document.getElementById('form4').style.display = 'block';
}

function capturarActual4() {
    stockAct = document.getElementById('gripe2');
}

function mostrarStock2B(){
    document.getElementById('fiebre2').style.display = 'block';
    document.getElementById('form5').style.display = 'block';
}

function capturarActual5() {
    stockAct = document.getElementById('fiebre2');
}

function mostrarStock2C(){
    document.getElementById('divM2').style.display = 'block';
    document.getElementById('form6M').style.display = 'block';
    document.getElementById('divP2').style.display = 'block';
    document.getElementById('form6P').style.display = 'block';
}

function capturarActual6M() {
    stockAct = document.getElementById('covid2M');
}

function capturarActual6P() {
    stockAct = document.getElementById('covid2P');
}

function capturarD(){
    stockNuevo = document.getElementById('nuevoStock4').value;
    cambiarStock(stockNuevo);
}

function capturarE(){
    stockNuevo = document.getElementById('nuevoStock5').value;
    cambiarStock(stockNuevo);
}

function capturarFM(){
    stockNuevo = document.getElementById('nuevoStock6M').value;
    cambiarStock(stockNuevo);
}

function capturarFP(){
    stockNuevo = document.getElementById('nuevoStock6P').value;
    cambiarStock(stockNuevo);
}

//Funciones stock vacunatorio 3

function mostrarStock3A(){
    document.getElementById('gripe3').style.display = 'block';
    document.getElementById('form7').style.display = 'block';
}

function capturarActual7() {
    stockAct = document.getElementById('gripe3');
}


function mostrarStock3B(){
    document.getElementById('fiebre3').style.display = 'block';
    document.getElementById('form8').style.display = 'block';
}

function capturarActual8() {
    stockAct = document.getElementById('fiebre3');
}

function mostrarStock3C(){
    document.getElementById('divM3').style.display = 'block';
    document.getElementById('form9M').style.display = 'block';
    document.getElementById('divP3').style.display = 'block';
    document.getElementById('form9P').style.display = 'block';
}

function capturarActual9M() {
    stockAct = document.getElementById('covid3M');
}

function capturarActual9P() {
    stockAct = document.getElementById('covid3P');
}


function capturarG(){
    stockNuevo = document.getElementById('nuevoStock7').value;
    cambiarStock(stockNuevo);
}

function capturarH(){
    stockNuevo = document.getElementById('nuevoStock8').value;
    cambiarStock(stockNuevo);
}

function capturarIM(){
    stockNuevo = document.getElementById('nuevoStock9M').value;
    cambiarStock(stockNuevo);
}

function capturarIP(){
    stockNuevo = document.getElementById('nuevoStock9P').value;
    cambiarStock(stockNuevo);
}

//Fin funciones de vacunatorio 3

function cambiarStock(stock){
    if(stock >= 0){
        stockAct.innerText = ('Stock Actual = ' + stock);
        alert('El stock se actualizó con éxito');
    }
    else alert('Ingrese un valor válido');
}


//Empieza JS de perfil vacunatorios

function mostrarFormZona(){
    document.getElementById('formZona').style.display = 'block';
}

function capturarZona(){
    let zona = document.getElementById('nuevaZona').value;
    cambiarZona(zona);
}

function cambiarZona(unaZona){
    let zona1 = 'Terminal Omnibus';
    let zona2 = 'Terminal Municipalidad';
    let zona3 = 'Terminal Cementerio';

    if(unaZona.toUpperCase() == zona1.toUpperCase() || unaZona.toUpperCase() == zona2.toUpperCase() || unaZona.toUpperCase() == zona3.toUpperCase()){
        alert('su zona fue actualizada con éxito')
    }
    else alert('la zona ingresada no pertenece a ningun vacunatorio');
}

function mostrarFormContra(){
    document.getElementById('formContra').style.display = 'block';
}

function capturarContra(){
    let pass = document.getElementById('nuevaContra').value;
    cambiarContra(pass);
}

function cambiarContra(){
    alert ('la contraseña fue actualizada con éxito');
}
