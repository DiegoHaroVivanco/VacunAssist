const {check, validationResult} = require('express-validator') // para validar campos

exports.validacionUsuarioVacunador = [
    check('name').exists().trim().not().isEmpty().isLength({min: 3, max: 20})
    .withMessage('El nombre debe tener entre 3 y 20 caracteres'),
    check('ape').exists().trim().not().isEmpty().isLength({min: 3, max: 20})
    .withMessage('El apellido debe tener entre 3 y 20 caracteres'),
    check('email').exists().normalizeEmail().isEmail()
    .withMessage('Ingrese un email válido'),
    check('dni').exists().isNumeric().isLength({min: 7, max:8})
    .withMessage('Ingrese un DNI válido'),
        check('fechaNacimiento').exists().toDate().custom((value, {req})=>{
        if(Date.parse(value) > 1655175927016 || Date.parse(value) > 1086227674000){
            throw new Error('Ingrese una fecha válida')
        }

        return true;
    })

]


exports.usuarioResult = (req, res, next) =>{
    const result =  validationResult(req).array()
    // console.log(result)
    if(!result.length) return next();

    // const error = result[0].msg
    // res.json({success: false, message: error})
    
    // Si es que hay un error, se lo informa con una alerta
    res.render('register', {
        alert: true,
        alerTitle: "Advertencia",
        alertMessage: result[0].msg ,
        alertIcon: 'warning',
        showConfirmButton: true,
        timer: false,
        ruta: 'areaPersonalAdmin/registroVacunador'
    })
}