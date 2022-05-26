
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

// falta consultar si es la misma zona