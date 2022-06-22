const url = `http://localhost:3000/datosusuarioVacunador/`
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
var zona

function mostrarFormZona(){
    document.getElementById('formZona').style.display = 'block';
}

function capturarZona(){
    zona = document.querySelector('#nuevaZona').value;
    cambiarZona(zona);
}

function cambiarZona(unaZona){
    let zona1 = 'Terminal de omnibus';
    let zona2 = 'Municipalidad';
    let zona3 = 'Cementerio municipal';
    console.log("zonacambiar:"+unaZona)
    if(primZona.toUpperCase() == unaZona.toUpperCase()){
        alert('La zona ingresada es igual a la que poseía')
    
    }else if(unaZona.toUpperCase() == zona1.toUpperCase() || unaZona.toUpperCase() == zona2.toUpperCase() || unaZona.toUpperCase() == zona3.toUpperCase()){
        zonaAct.innerText = "Zona actual: " + unaZona
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

function cambiarContra(pass){
    if(pass && pass.length >= 2 && pass.length <= 8){
        alert ('la contraseña fue actualizada con éxito');
    }else{
        alert('Ingrese una contraseña que tenga entre 2 y 8 caracteres')
    }
}

