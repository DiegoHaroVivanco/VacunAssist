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



// //Empieza JS de perfil vacunatorios

// function mostrarFormZona(){
//     document.getElementById('formZona').style.display = 'block';
// }

// function capturarZona(){
//     let zona = document.getElementById('nuevaZona').value;
//     cambiarZona(zona);
// }

// function cambiarZona(unaZona){
//     let zona1 = 'Terminal Omnibus';
//     let zona2 = 'Terminal Municipalidad';
//     let zona3 = 'Terminal Cementerio';

//     if(unaZona.toUpperCase() == zona1.toUpperCase() || unaZona.toUpperCase() == zona2.toUpperCase() || unaZona.toUpperCase() == zona3.toUpperCase()){
//         alert('su zona fue actualizada con éxito')
//     }
//     else alert('la zona ingresada no pertenece a ningun vacunatorio');
// }

// function mostrarFormContra(){
//     document.getElementById('formContra').style.display = 'block';
// }

// function capturarContra(){
//     let pass = document.getElementById('nuevaContra').value;
//     cambiarContra(pass);
// }

// function cambiarContra(){
//     alert ('la contraseña fue actualizada con éxito');
// }
