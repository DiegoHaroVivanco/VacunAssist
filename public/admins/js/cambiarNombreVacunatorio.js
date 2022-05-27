const url = `http://localhost:3000/infovacunatorios/`
const vacunatorio1 = document.getElementById("vacunatorio1")
const vacunatorio2 = document.getElementById("vacunatorio2")
const vacunatorio3 = document.getElementById("vacunatorio3")


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
        
    }).then(mostrarVacunatorios())
}




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
    // localStorage.setItem("nom1",nomVac);
    cambiar(nomVac);
}

function capturarInputB() {
    vac = document.getElementById("vacunatorio2");
}

function capturar2(){
    nomVac = document.getElementById('nomVac2').value;
    // localStorage.setItem("nom2",nomVac);
    cambiar(nomVac);
}

function capturarInputC() {
    vac = document.getElementById("vacunatorio3");
}

function capturar3(){
    nomVac = document.getElementById('nomVac3').value;
    // localStorage.setItem("nom3",nomVac);
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
