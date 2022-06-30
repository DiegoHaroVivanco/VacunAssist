document.querySelector('#bnt-registrar').disabled = true
document.querySelector(".btn-validar").onclick = (e) =>{
    if(e && "preventDefault" in e) e.preventDefault();

    // let exp2 = /^[\d]{1,3}\.?[\d]{3,3}\.?[\d]{3,3}$/
    //    let exp2 = /^\d{7}(?:[-\s]\d{4})?$/;

    // let dniInput = parseInt(document.querySelector("#dni").value)
    validaDNI(parseInt(document.querySelector("#dni").value))
    
}


const validaDNI = (dni) =>{
    const exp2 = /^[\d]{1,2}\.?[\d]{3,3}\.?[\d]{3,3}$/;

    if(exp2.test(dni) === true){
        document.querySelector('#bnt-registrar').disabled = false

        alert('Dni válido');
        
    }else{
        document.querySelector('#bnt-registrar').disabled = true
        alert('Dni invalido');
     }
}
  


