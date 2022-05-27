const url = `http://localhost:3000/infovacunatorios/`
const vacunatorio1 = document.getElementById("vacunatorio1")
const vacunatorio2 = document.getElementById("vacunatorio2")
const vacunatorio3 = document.getElementById("vacunatorio3")

const gripe1 = document.getElementById("gripe1")
const fiebre1 = document.getElementById("fiebre1")
const covid1M = document.getElementById("covid1M")
const covid1P = document.getElementById("covid1P")

const gripe2 = document.getElementById("gripe2") // los num 2 son la pos 0
const fiebre2 = document.getElementById("fiebre2")
const covid2M = document.getElementById("covid2M")
const covid2P = document.getElementById("covid2P")

const gripe3 = document.getElementById("gripe3") 
const fiebre3 = document.getElementById("fiebre3")
const covid3M = document.getElementById("covid3M")
const covid3P = document.getElementById("covid3P")

document.getElementById("btnmostrar").onclick = (e) =>{
    if (e && "preventDefault" in e) e.preventDefault();

    const listarDatos =  async () =>{
        try {
            const response  = await fetch(url,{
                headers: { "Access-Control-Allow-Origin": `${url}` }
            });
            const dataParser = await response.json()
            console.log(dataParser)
            return dataParser
    
        } catch (error) {
            console.log(error)
        }
    }

    listarDatos().then(data => {
        //console.log(data)
        vacunatorio1.innerHTML = data[0].nombre
        vacunatorio2.innerHTML = data[1].nombre
        vacunatorio3.innerHTML = data[2].nombre

        gripe1.innerHTML = ('Stock Actual = ' + data[1].stock_gripe)
        fiebre1.innerHTML = ('Stock Actual = ' + data[1].stock_fiebreA)
        covid1M.innerHTML = ('Stock Actual = ' + data[1].stock_moderna)
        covid1P.innerHTML = ('Stock Actual = ' + data[1].stock_phizer)

        gripe2.innerHTML = ('Stock Actual = ' + data[0].stock_gripe)
        fiebre2.innerHTML = ('Stock Actual = ' + data[0].stock_fiebreA)
        covid2M.innerHTML = ('Stock Actual = ' + data[0].stock_moderna)
        covid2P.innerHTML = ('Stock Actual = ' + data[0].stock_phizer)

        gripe3.innerHTML = ('Stock Actual = ' + data[2].stock_gripe)
        fiebre3.innerHTML = ('Stock Actual = ' + data[2].stock_fiebreA)
        covid3M.innerHTML = ('Stock Actual = ' + data[2].stock_moderna)
        covid3P.innerHTML = ('Stock Actual = ' + data[2].stock_phizer)
        
    }).then(mostrarVacunatorios2())
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
