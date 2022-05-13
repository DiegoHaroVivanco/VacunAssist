let vac;


function mostrarVacunatorios(){
    document.getElementById('vacunatorios').style.display = 'block';
}

function mostrar1(){
    document.getElementById('form').style.display = 'block';
    vac = document.getElementById('vacunatorio1');
}

function mostrar2(){
    document.getElementById('form').style.display = 'block';
    vac = document.getElementById('vacunatorio2');
}

function mostrar3(){
    document.getElementById('form').style.display = 'block';
    vac = document.getElementById('vacunatorio3');
}

function capturarNombre(){
    let nomVacunatorio = document.getElementById('nombreVacunatorio').value;
    if(nomVacunatorio.toUpperCase()!= vac.innerText.toUpperCase()){
        vac.innerText = nomVacunatorio;
    }
    else alert('ya existe un vacunatorio con ese nombre');
}
