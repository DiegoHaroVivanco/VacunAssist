const url = `http://localhost:3000/datosusuarios/`
const zonaAct = document.getElementById("zonaAct")
let primZona
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
        zonaAct.innerHTML = ('Zona actual: ' + data[0].Zona)
        primZona = data[0].Zona
    }).then(mostrarFormZona())   

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
    let zona1 = 'Terminal de omnibus';
    let zona2 = 'Municipalidad';
    let zona3 = 'Cementerio municipal';
    console.log("zona:"+primZona)
    if(primZona.toUpperCase() == unaZona.toUpperCase()){
        alert('La zona ingresada es igual a la que poseía')
    
    }else if(unaZona.toUpperCase() == zona1.toUpperCase() || unaZona.toUpperCase() == zona2.toUpperCase() || unaZona.toUpperCase() == zona3.toUpperCase()){
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