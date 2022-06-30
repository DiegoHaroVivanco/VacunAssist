const url = `http://localhost:3000/datosUsuariosPacientes/`



const listarDatos =  async () =>{
    try {
        const response  = await fetch(url,{
            headers: { "Access-Control-Allow-Origin": `${url}` }
        });
        const dataParser = await response.json()
        console.log(dataParser)
        if(dataParser.length == 0){
    
            document.querySelector('#tr-1').children[1].innerHTML = "No hay pacientes"
            document.querySelector('#tr-1').children[2].innerHTML = "registrados"
            document.querySelector('#tr-1').children[3].innerHTML = "en el "
            document.querySelector('#tr-1').children[4].innerHTML = "sistema"
            document.querySelector('#tr-2').remove()
            document.querySelector('#tr-3').remove()
            
        }
        return dataParser

    } catch (error) {
        console.log(error)
    }
}


listarDatos().then(data => {
  
    if(data.length == 1){
    
        document.querySelector('#tr-1').children[1].innerHTML = data[0].nom +" "+data[0].ape
        document.querySelector('#tr-1').children[2].innerHTML = data[0].dni
        document.querySelector('#tr-1').children[3].innerHTML = data[0].Zona

        document.querySelector('#tr-2').remove()
        document.querySelector('#tr-3').remove()
    
    }else{
    
    document.querySelector('#tr-1').children[1].innerHTML = data[0].nom +" "+data[0].ape
    document.querySelector('#tr-1').children[2].innerHTML = data[0].dni
    document.querySelector('#tr-1').children[3].innerHTML = data[0].Zona
    document.querySelector('#tr-1').children[4].innerHTML = data[0].Email

    document.querySelector('#tr-2').children[1].innerHTML = data[1].nom +" "+data[1].ape
    document.querySelector('#tr-2').children[2].innerHTML = data[1].dni
    document.querySelector('#tr-2').children[3].innerHTML = data[1].Zona
    document.querySelector('#tr-2').children[4].innerHTML = data[1].Email

    document.querySelector('#tr-3').children[1].innerHTML = data[2].nom +" "+data[2].ape
    document.querySelector('#tr-3').children[2].innerHTML = data[2].dni
    document.querySelector('#tr-3').children[3].innerHTML = data[2].Zona
    document.querySelector('#tr-3').children[4].innerHTML = data[2].Email

    }
})