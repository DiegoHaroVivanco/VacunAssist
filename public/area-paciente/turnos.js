const link = `http://localhost:3000/datosusuarioPaciente/`

// var contador = localStorage.getItem('contador') || 0;
const listarDatoss =  async () =>{
    try {
        const response  = await fetch(link,{
            headers: { "Access-Control-Allow-Origin": `${link}` }
        });
        const dataParser = await response.json()
        console.log(dataParser)
        return dataParser

    } catch (error) {
        console.log(error)
    }
}

listarDatoss().then(data => {
    if(data[0].riesgo == 1){
        document.querySelector('#btn-pedirturno').disabled = true;
    }
    if(data[0].previo_fiebreA == 1){
        document.querySelector('#btn-pedirturno').disabled = true;
    }
    console.log(new Date().getFullYear() - new Date(data[0].FechaNac).getFullYear())
    if((new Date().getFullYear() - new Date(data[0].FechaNac).getFullYear()) <= 60){
        console.log("Menos de 60 años")
    }else{
        document.querySelector('#btn-pedirturno').disabled = true;
        console.log("Mas de 60 años")
    }
})

document.querySelector('#btn-pedirturno').onclick = (e) =>{

        document.querySelector('#btn-pedirturno').disabled = true;
        alert('!Pediste un turno para la fiebre amarilla! La asignación del mismo debe ser evaluada')
// }else{
    //     contador++;
    //     localStorage.setItem('contador', contador)
    //     alert('!Pediste un turno para la fiebre amarilla! La asignación del mismo debe ser evaluada')
    // }
}