const url = `http://localhost:3000/datosusuarioPaciente/`
const zonaAct = document.getElementById("zonaAct")
let primZona

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
    let esDeRiesgo;
    //console.log(data)
    if(data[0].riesgo == 1){ // true
        esDeRiesgo = (' Si ' )
    }else{ // false
        esDeRiesgo =  (' No ' )       
    }
    let nacimiento = new Date(data[0].FechaNac)
    document.querySelector('#tr').children[0].innerHTML = data[0].nom +" "+data[0].ape
    document.querySelector('#tr').children[1].innerHTML = data[0].dni
    document.querySelector('#tr').children[2].innerHTML = esDeRiesgo
    document.querySelector('#tr').children[3].innerHTML = data[0].Zona
    document.querySelector('#tr').children[4].innerHTML = data[0].Email
    document.querySelector('#tr').children[5].innerHTML = nacimiento.getDate() +'/'+ (nacimiento.getMonth()+1)+'/'+nacimiento.getFullYear()



    zonaAct.innerHTML = ('Zona actual: ' + data[0].Zona)


})

document.getElementById("btnmostrar").onclick = (e) =>{
    if (e && "preventDefault" in e) e.preventDefault();

    listarDatos().then(data => {
        //console.log(data)
        primZona = data[0].Zona
    }).then(mostrarFormZona())   

}

document.getElementById("btnmostrarEstado").onclick = (e) =>{

    if (e && "preventDefault" in e) e.preventDefault();

    listarDatos().then(data => {
        console.log("Estado riesgo json: " + data[0].riesgo)
        if(data[0].riesgo === 1){
            document.querySelector('.radio1').checked = true // checbox si
        }else{
            document.querySelector('.radio2').checked = true // checbox no
        }        
    }).then(mostrarFormRiesgo())

}


// listarDatos().then(data => { // si es 1, es de riesgo y pongo el check en true sino pongo el check 2 en true
//     console.log("Estado riesgo json: " + data[0].riesgo)
//     if(data[0].riesgo === 1){
//         document.querySelector('.radio1').checked = true
//     }else{
//         document.querySelector('.radio2').checked = true
//     }
// })

//Empieza JS de perfil vacunatorios
var zona

function mostrarFormZona(){
    document.getElementById('formZona').style.display = 'block';
    document.getElementById('formRiesgo').style.display = 'none';
    document.getElementById('formContra').style.display = 'none';

}


function mostrarFormRiesgo(){
    document.getElementById('formRiesgo').style.display = 'block';
    document.getElementById('formZona').style.display = 'none';
    document.getElementById('formContra').style.display = 'none';


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
    document.getElementById('formZona').style.display = 'none';
    document.getElementById('formRiesgo').style.display = 'none';
}

function capturarContra(){
    let pass = document.getElementById('nuevaContra').value;
    cambiarContra(pass);
}

function cambiarContra(pass){
    if(pass && pass.length >= 6 ){
        alert ('la contraseña fue actualizada con éxito');
    }else{
        alert('La contraseña debe tener al menos 6 caracteres')
    }
}

function capturarEstado(){

    alert('Se actualizó su estado de riesgo')

}

// function cambiarEstado(estado){
//     if(estado){
//         document.querySelector('.radio1').checked = estado
//     }

//     alert('Se actualizó su estado de riesgo')

// }

