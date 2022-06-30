const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db')
const { promisify } = require('util')
const transporter = require('../config/mailer') // para enviar el mail
const userToken = {
    tokenHash: ''
}
// constrollers del usuario

exports.register = async (req, res) => {
    try {
        const nom = req.body.name
        const ape = req.body.ape
        const dni = req.body.dni
        const email = req.body.email
        const pass = req.body.password // contraseña no debe ser mayor a 8 digitos
        const fecha = req.body.fechaNacimiento
        const zona = req.body.zona
        // FALTA ENVIAR TOKEN POR MAIL
        const token = Math.random().toString(36).substring(8) //token 4 digitos
        // let tokenHash = await bcryptjs.hash(token, 8)
        let passHash = await bcryptjs.hash(pass, 8)
        //console.log(nom + " - " + ape + " - " + pass)
        //console.log(passHash)

        const linkLogin = `http://localhost:3000/login`


        conexion.query("SELECT * FROM Usuarios WHERE Email = '"+email+"' OR dni = '"+dni+"' " , (error, results) => { //selecciono a los usuarios con el email ingresado
            
            if(results.length != 0) {
                console.log(results[0].Email)
                console.log(results[0].dni)
                if(results[0].Email == email){
                    res.render('register', {
                        alert: true,
                        alerTitle: "Error",
                        alertMessage: "El email ingresado ya se encuentra registrado",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'registro'
                    })
                }else if(results[0].dni == dni){
                    res.render('register', {
                        alert: true,
                        alerTitle: "Error",
                        alertMessage: "El dni ingresado ya se encuentra registrado",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'registro'
                    })
                }
            }else{
                conexion.query('INSERT INTO Usuarios SET ?', {
                    dni: dni, nom: nom, ape: ape, FechaNac: fecha, Zona: zona, Email: email, Pass: passHash, token: token
                    }, async (error, results) => {
                        if (error) {
                            throw error;
                        } else {
                            res.render('register', {
                                alert: true,
                                alerTitle: "Registro exitoso",
                                alertMessage: "Se envió un token al email ingresado",
                                alertIcon: 'success',
                                showConfirmButton: true,
                                timer: 3000,
                                ruta: 'login' // despues tiene que ir a la ruta para cargar vacunas
                             })

                             await transporter.sendMail({ // envío email al campo que ingreso el usuario
                                from: '"Token de seguridad"',
                                to: email,
                                subject: "Token de seguridad",
                                html: `
                                    <b>Tu token de seguridad es: </b>
                                    <p> ${token}</p>
                                    <b>Inicia sesión ingresando a: </b>
                                    <a href="${linkLogin}">${linkLogin}</a>
                                `
                            })
                            
                    }

                })
            }
        })         
          
    } catch (error) {
        console.log(error)
    }

}

exports.login = async (req, res) => {
    try {
        const user = req.body.email
        const pass = req.body.password
        const token = req.body.token
        //console.log(user+" - "+pass + " - "+token)
        if (!user || !pass) {
            res.render('login', {
                alert: true,
                alerTitle: "Advertencia",
                alertMessage: "Ingrese usuario y contraseña",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            })

        } else {
            conexion.query('SELECT * FROM Usuarios WHERE email = ?', [user], async (error, results) => {
                if (results.length == 0 || !(await bcryptjs.compare(pass, results[0].Pass))) {

                    res.render('login', {
                        alert: true,
                        alerTitle: "Error",
                        alertMessage: "Nombre de usuario no registrado y/o contraseña incorrecta",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'
                    })
                }
                else {
                    const dni = results[0].dni
                    const jToken = jwt.sign({ dni: dni }, 'super_secret')
                    console.log("Token: " + jToken + " Para el usuario: " + user)
                    console.log("token creado: " + results[0].token === token)
                    userToken.tokenHash = results[0].token
                     const cookiesOptions = {
                        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    }
                    conexion.query("UPDATE Usuarios SET jsontoken = '"+jToken+"' WHERE dni= '"+dni+"'", async (error, results)=>{
                        if(error) throw error;



                        res.cookie('jwt', jToken, cookiesOptions)

                        res.render('login', {
                            alert: true,
                            alerTitle: "Nombre de usuario y contraseña correctos",
                            alertMessage: "Se lo redigira para el ingreso del token de seguridad",
                            alertIcon: 'success',
                            showConfirmButton: true,
                            timer: 3500,
                            ruta: 'autenticar'
                        })

                    })

                }
            })
        }

    } catch (error) {
        console.log(error)
    }
}

exports.autenticar = (req, res) => {
    try {
        const token = req.body.token
        // console.log(token)
        // console.log("token local: "+userToken.tokenHash)
        // console.log(token === userToken.tokenHash)
        
        conexion.query("SELECT * FROM Usuarios WHERE token = '"+token+"'", (error, results) => {
            // console.log("data" +results[0].token)
            if(results.length == 0){
                res.render('autenticar', {
                    alert: true,
                    alerTitle: "Error",
                    alertMessage: "Token de seguridad incorrecto",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: 2500,
                    ruta: 'autenticar'
                })
            }else if(results[0].token === token){
                res.render('autenticar', {
                    alert: true,
                    alerTitle: "Token correcto",
                    alertMessage: "Inicio de sesion correcto",
                    alertIcon: 'success',
                    showConfirmButton: true,
                    timer: 2500,
                    ruta: 'areaPersonal'
                })
            } else {
                res.render('autenticar', {
                    alert: true,
                    alerTitle: "Error",
                    alertMessage: "Token de seguridad incorrecto",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: 2500,
                    ruta: 'autenticar'
                })
            }
            
        })    
        
    } catch (error) {
        console.log(error)
    }


}

exports.isAuthenticated = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, 'super_secret')
            conexion.query('SELECT * FROM Usuarios WHERE dni = ?', [decodificada.dni], (error, results) => {
                if (!results) { return next() }
                req.user = results[0]
                return next(); // pasa a ejecutar el siguiente middleware
            })

        } catch (error) {
            console.log(error)
            return next()
        }
    } else {
        res.redirect('/login')
    }
}

exports.logout = (req, res) => {
    res.clearCookie('jwt')
    return res.redirect('/login')
}

exports.recuperarContraseña = async (req, res) =>{
    const email = req.body.email
    const passTemporal = Math.random().toString(36).substring(5)
    let passHash = await bcryptjs.hash(passTemporal, 8)
    const linkLogin = `http://localhost:3000/login`

    try {
        //conexion.query("SELECT * FROM Usuarios WHERE Email = '"+email+"'", (error, results) => { //selecciono a los usuarios con el email ingresado
        conexion.query('SELECT * FROM Usuarios WHERE email = ?', [email],  async(error, results) => {
            console.log(results.length == 0 ) // para controlar si el mail existe o no
            if(results.length == 0 || results[0].Email !== email){
                res.render('recuperarPass', {
                    alert: true,
                    alerTitle: "Error",
                    alertMessage: "Email inválido",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'login'
                })
            }else{
                // actualizo la contraseña en la db para el email ingresado
                conexion.query("UPDATE Usuarios SET Pass = '"+passHash+"' WHERE Email='"+email+"'", async (error, results)=>{
                    if(error) throw error;
                    console.log(results[0])
                    res.render('recuperarPass', {
                        alert: true,
                        alerTitle: "",
                        alertMessage: "Se envió una contraseña temporal al email ingresado",
                        alertIcon: 'success',
                        showConfirmButton: false,
                        timer: 3000,
                        ruta: 'login'
                        })
              
                    await transporter.sendMail({ // envío email al campo que ingreso el usuario
                        from: '"Recuperación de contraseña"',
                        to: email,
                        subject: "Recuperacion de contraseña",
                        html: `
                            <b>Tu nueva contraseña temporal es: </b>
                            <p> ${passTemporal}</p>
                            <b>Inicia sesión ingresando a: </b>
                            <a href="${linkLogin}">${linkLogin}</a>
                        `
                    })
                })

            }   
            

        })        
    } catch (error) {
        console.log(error)
    }

}



exports.dataUsuarioPaciente = (req, res) =>{
    let cookieZona = req.cookies.jwt

    conexion.query("SELECT * FROM Usuarios WHERE jsontoken = '"+cookieZona+"' ",(error, results) => {
        if(error) throw error;
         //console.log(results)
        res.json(results)
    
    })    
}

exports.dataUsuarios = (req, res) =>{
    conexion.query('SELECT * FROM Usuarios',(error, results) => {

        if(error) throw error;
        
        console.log(results)
        res.json(results)
    })
}


exports.cambiarContrasena = async (req, res) =>{

    const passTemporal = req.body.pass
    let cookieZona = req.cookies.jwt
    let passHash = await bcryptjs.hash(passTemporal, 8)
    console.log(passTemporal)
    try {
        if(passTemporal.length >= 6){
            conexion.query("SELECT * FROM Usuarios WHERE jsontoken = '"+cookieZona+"' ", (error, results) => {
                    console.log(results[0])
                    // actualizo la contraseña en la db
                    conexion.query("UPDATE Usuarios SET Pass = '"+passHash+"' WHERE jsontoken = '"+cookieZona+"'", (error, results)=>{
                        if(error) throw error;
                        res.redirect('/areaPersonal/editarperfil')
                    })

            })        
        }else{
            res.redirect('/areaPersonal/editarperfil')

        }
    } catch (error) {
        console.log(error)
    }


}


exports.actualizarZonaPaciente = (req, res) =>{
    const zonaNueva = req.body.zona
    console.log("Zona NUEVA: " + zonaNueva)
    let cookieZona = req.cookies.jwt
    console.log("token: " + req.cookies.jwt);    

    conexion.query("SELECT * FROM Usuarios WHERE jsontoken = '"+cookieZona+"' ",(error, results) => {
        console.log(results[0]);
        
            conexion.query("UPDATE Usuarios SET Zona = '"+zonaNueva+"' WHERE jsontoken = '"+cookieZona+"'",(error, results) => {
                if(error) throw error;
                res.redirect('/areaPersonal/editarperfil')            
            })
        
        
        
    })
}

exports.cambiarEstadoRiesgo = (req, res) =>{
    let estado = req.body.estado
    let cookieZona = req.cookies.jwt
    console.log("estado: "+estado)
    conexion.query("SELECT * FROM Usuarios WHERE jsontoken = '"+cookieZona+"' ",(error, results) => {

        conexion.query("UPDATE Usuarios SET riesgo = '"+estado+"' WHERE jsontoken = '"+cookieZona+"'",(error, results) => {
            if(error) throw error;
            res.redirect('/areaPersonal/editarperfil')            
        })
    })

}


exports.pedirTurnoFiebre = (req, res) =>{
    let cookieUser = req.cookies.jwt

    conexion.query("SELECT * FROM Usuarios WHERE jsontoken = '"+cookieUser+"' ",(error, results) => {
        console.log(results[0])

        conexion.query("UPDATE Usuarios SET previo_fiebreA = 1 WHERE jsontoken = '"+cookieUser+"'", (error, results)=>{
            if(error) throw error;
            res.redirect('/areaPersonal')
        
        })
    })

}


// controlers del admin

exports.loginAdmin = (req, res) =>{
    const token = req.body.token
    const pass = req.body.password
    console.log(token)
    conexion.query("SELECT * FROM admins WHERE token = '"+token+"' AND pass = '"+pass+"' " ,(error, results) => {
        console.log("Data: " +results.length)
        if(results.length == 0) {

            res.render('inicioAdmin', {
                alert: true,
                alerTitle: "Error",
                alertMessage: "Token y/o contraseña incorrectos",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: false,
                ruta: 'autenticacion' 
            }) 
        }else if (token === results[0].token && pass === results[0].pass){

            const id = results[0].ape
            const jToken = jwt.sign({ id: id }, 'super_secret')
            console.log("Token: " + jToken + " Para el usuario: " + id)
            console.log("token creado: " + results[0].token)

             const cookiesOptions = {
                expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }
            res.cookie('jwt', jToken, cookiesOptions)

            res.render('inicioAdmin', {
                alert: true,
                alerTitle: "Token y contraseña correctos",
                alertMessage: "Inicio de sesión correcto",
                alertIcon: 'success',
                showConfirmButton: true,
                timer: false,
                ruta: 'areaPersonalAdmin' 
            }) 
        }else{
            res.render('inicioAdmin', {
                alert: true,
                alerTitle: "Error",
                alertMessage: "Token y/o contraseña incorrectos",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: false,
                ruta: 'autenticacion' 
            }) 
        }
        
    })
}

exports.isAuthenticatedAdministrador = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, 'super_secret')
            conexion.query('SELECT * FROM admins WHERE ape = ?', [decodificada.id], (error, results) => {
                if (!results) { return next() }
                req.user = results[0]
                return next(); // pasa a ejecutar el siguiente middleware
            })

        } catch (error) {
            console.log(error)
            return next()
        }
    } else {
        res.redirect('/autenticacion')
    }
}

exports.logoutAdministrador = (req, res) => {
    res.clearCookie('jwt')
    return res.redirect('/autenticacion')
}


exports.registerVacunador = async (req, res) => {
    try {
        const nom = req.body.name
        const ape = req.body.ape
        const dni = req.body.dni
        const email = req.body.email
        const pass = Math.random().toString(36).substring(5)// contraseña no debe ser mayor a 8 digitos
        const fecha = req.body.fechaNacimiento
        const zona = req.body.zona
        const token = Math.random().toString(36).substring(8) //token 4 digitos
        // let tokenHash = await bcryptjs.hash(token, 8)
        let passHash = await bcryptjs.hash(pass, 8)
        const linkLogin = `http://localhost:3000/loginVacunador`

        conexion.query("SELECT * FROM vacunadores WHERE Email = '"+email+"' OR dni = '"+dni+"' " , (error, results) => { //selecciono a los usuarios con el email ingresado
            
            if(results.length != 0) {
                console.log(results[0].Email)
                console.log(results[0].dni)
                if(results[0].Email == email){
                    res.render('registrarVacunador', {
                        alert: true,
                        alerTitle: "Error",
                        alertMessage: "El email ingresado ya se encuentra registrado",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'areaPersonalAdmin/registroVacunador'
                    })
                }else if(results[0].dni == dni){
                    res.render('registrarVacunador', {
                        alert: true,
                        alerTitle: "Error",
                        alertMessage: "El dni ingresado ya se encuentra registrado",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'areaPersonalAdmin/registroVacunador'
                    })
                }
            }else{
                conexion.query('INSERT INTO vacunadores SET ?', {
                    dni: dni, nom: nom, ape: ape, FechaNac: fecha, Zona: zona, Email: email, Pass: passHash, token: token
                    }, async (error, results) => {
                        if (error) {
                            throw error;
                        } else {
                            res.render('registrarVacunador', {
                            alert: true,
                            alerTitle: "Registro exitoso",
                            alertMessage: "Se envió la contraseña y un token al email ingresado",
                            alertIcon: 'success',
                            showConfirmButton: true,
                            timer: false,
                            ruta: 'areaPersonalAdmin'
                            })
                            
                            await transporter.sendMail({ // envío email al campo que ingreso el usuario
                                from: '"Contraseña y token de seguridad"',
                                to: email,
                                subject: "Contraseña temporal",
                                html: `
                                    <b>Tu contraseña temporal es: </b>
                                    <p> ${pass}</p>
                                    <b>Tu token de seguridad es: </b>
                                    <p> ${token}</p>
                                    <b>Inicia sesión ingresando a: </b>
                                    <a href="${linkLogin}">${linkLogin}</a>
                                `
                            })

                        }
        
                    })
            }    

        })
          
    } catch (error) {
        console.log(error)
    }

}

exports.infoVacunatorios = (req, res) =>{
    conexion.query('SELECT * FROM vacunatorios',(error, results) => {

        if(error) throw error;
      //  console.log(results)
        res.json(results)
    })
}




exports.cambiarVacunatorio1 = (req, res, next) =>{
    const nomVacu = req.body.nomVac1

    conexion.query('SELECT nombre FROM vacunatorios',(error, results) => {
        //console.log(results[0].nombre)
        if(results[0].nombre == nomVacu || results[1].nombre == nomVacu || results[2].nombre == nomVacu){
            res.redirect('/areaPersonalAdmin/cambiarnombrevacunatorio')
        }else{

        conexion.query("UPDATE vacunatorios SET nombre = '"+nomVacu+"' WHERE zona='Cementerio municipal'" ,(error, results) => {
                if(error) throw error;

                res.redirect('/areaPersonalAdmin/cambiarnombrevacunatorio')
        })
    }
    })    
}

exports.cambiarVacunatorio2 = (req, res) =>{
    const nomVacu = req.body.nomVac2
    
    conexion.query('SELECT nombre FROM vacunatorios',(error, results) => {
        if(results[0].nombre == nomVacu || results[1].nombre == nomVacu || results[2].nombre == nomVacu){
            res.redirect('/areaPersonalAdmin/cambiarnombrevacunatorio')
        }else{
            conexion.query("UPDATE vacunatorios SET nombre = '"+nomVacu+"' WHERE zona='Municipalidad'" ,(error, results) => {
                    if(error) throw error;

                    res.redirect('/areaPersonalAdmin/cambiarnombrevacunatorio')
            })
        }
    })
}

exports.cambiarVacunatorio3 = (req, res) =>{
    const nomVacu = req.body.nomVac3

    conexion.query('SELECT nombre FROM vacunatorios',(error, results) => {
        if(results[0].nombre == nomVacu || results[1].nombre == nomVacu || results[2].nombre == nomVacu){
            res.redirect('/areaPersonalAdmin/cambiarnombrevacunatorio')
        }else{
            conexion.query("UPDATE vacunatorios SET nombre = '"+nomVacu+"' WHERE zona='Terminal de omnibus'" ,(error, results) => {
                    if(error) throw error;

                    res.redirect('/areaPersonalAdmin/cambiarnombrevacunatorio')
            })
        }
    })    
}


exports.actualizargripe1 = (req, res) =>{
    let stockNuevo = parseInt(req.body.valorgripe1)
    // recuperar stock de la db
    conexion.query("SELECT * FROM vacunatorios WHERE zona='Cementerio municipal' ",(error, results) => {
        // console.log( typeof (stockNuevo))
        
        // REPLICAR A LOS A LOS DEMAS ACTUALIZAR DE VACUNAS
        if(stockNuevo != 0 && ((stockNuevo <= 0) ? (stockNuevo * -1) <= results[0].stock_gripe : true) ){
            stockNuevo += results[0].stock_gripe
            conexion.query("UPDATE vacunatorios SET stock_gripe = '"+stockNuevo+"' WHERE zona='Cementerio municipal'" ,(error, results) => {
                if(error) throw error;

                res.redirect('/areaPersonalAdmin/actualizarstock')
            })
        }else{
            res.redirect('/areaPersonalAdmin/actualizarstock')
        }


    })    
}


exports.actualizarfiebre1 = (req, res) =>{
    let stockNuevo = parseInt(req.body.valorfiebre1)
    // recuperar stock de la db
    conexion.query("SELECT * FROM vacunatorios WHERE zona='Cementerio municipal' ",(error, results) => {

        if(stockNuevo != 0 && ((stockNuevo <= 0) ? (stockNuevo * -1) <= results[0].stock_fiebreA : true) ){
            stockNuevo += results[0].stock_fiebreA
            conexion.query("UPDATE vacunatorios SET stock_fiebreA = '"+stockNuevo+"' WHERE zona='Cementerio municipal'" ,(error, results) => {
                if(error) throw error;

                res.redirect('/areaPersonalAdmin/actualizarstock')
            })
        }else{
            res.redirect('/areaPersonalAdmin/actualizarstock')
        }

    })
    
}


exports.actualizarstockcovid1m = (req, res) =>{

    let stockNuevo = parseInt(req.body.valorcovid1m)
    // recuperar stock de la db
    conexion.query("SELECT * FROM vacunatorios WHERE zona='Cementerio municipal' ",(error, results) => {

        if(stockNuevo != 0 && ((stockNuevo <= 0) ? (stockNuevo * -1) <= results[0].stock_moderna : true) ){
            stockNuevo += results[0].stock_moderna
            conexion.query("UPDATE vacunatorios SET stock_moderna = '"+stockNuevo+"' WHERE zona='Cementerio municipal'" ,(error, results) => {
                if(error) throw error;

                res.redirect('/areaPersonalAdmin/actualizarstock')
            })
        }else{
            res.redirect('/areaPersonalAdmin/actualizarstock')
        }
    })
}

exports.actualizarstockcovid1p = (req, res) =>{

    let stockNuevo = parseInt(req.body.valorcovid1p)
    // recuperar stock de la db
    conexion.query("SELECT * FROM vacunatorios WHERE zona='Cementerio municipal' ",(error, results) => {

        if(stockNuevo != 0 && ((stockNuevo <= 0) ? (stockNuevo * -1) <= results[0].stock_phizer : true) ){
            stockNuevo += results[0].stock_phizer
            conexion.query("UPDATE vacunatorios SET stock_phizer = '"+stockNuevo+"' WHERE zona='Cementerio municipal'" ,(error, results) => {
                if(error) throw error;

                res.redirect('/areaPersonalAdmin/actualizarstock')
            })
        }else{
            res.redirect('/areaPersonalAdmin/actualizarstock')
        }
    })
} 


////----------

exports.actualizargripe2 = (req, res) =>{

    let stockNuevo = parseInt(req.body.valorgripe2)
    // recuperar stock de la db
    conexion.query("SELECT * FROM vacunatorios WHERE zona='Municipalidad' ",(error, results) => {

        if(stockNuevo != 0 && ((stockNuevo <= 0) ? (stockNuevo * -1) <= results[0].stock_gripe : true) ){
            stockNuevo += results[0].stock_gripe
            conexion.query("UPDATE vacunatorios SET stock_gripe = '"+stockNuevo+"' WHERE zona='Municipalidad'" ,(error, results) => {
                if(error) throw error;

                res.redirect('/areaPersonalAdmin/actualizarstock')
            })
        }else{
            res.redirect('/areaPersonalAdmin/actualizarstock')
        }
    })
}


exports.actualizarfiebre2 = (req, res) =>{

    let stockNuevo = parseInt(req.body.valorfiebre2)
    // recuperar stock de la db
    conexion.query("SELECT * FROM vacunatorios WHERE zona='Municipalidad' ",(error, results) => {

        if(stockNuevo != 0 && ((stockNuevo <= 0) ? (stockNuevo * -1) <= results[0].stock_fiebreA : true) ){
            stockNuevo += results[0].stock_fiebreA
            conexion.query("UPDATE vacunatorios SET stock_fiebreA = '"+stockNuevo+"' WHERE zona='Municipalidad'" ,(error, results) => {
                if(error) throw error;

                res.redirect('/areaPersonalAdmin/actualizarstock')
            })
        }else{
            res.redirect('/areaPersonalAdmin/actualizarstock')
        }
    })
}


exports.actualizarstockcovid2m = (req, res) =>{

    let stockNuevo = parseInt(req.body.valorcovid2m)
    // recuperar stock de la db
    conexion.query("SELECT * FROM vacunatorios WHERE zona='Municipalidad' ",(error, results) => {

        if(stockNuevo != 0 && ((stockNuevo <= 0) ? (stockNuevo * -1) <= results[0].stock_moderna : true) ){
            stockNuevo += results[0].stock_moderna
            conexion.query("UPDATE vacunatorios SET stock_moderna = '"+stockNuevo+"' WHERE zona='Municipalidad'" ,(error, results) => {
                if(error) throw error;

                res.redirect('/areaPersonalAdmin/actualizarstock')
            })
        }else{
            res.redirect('/areaPersonalAdmin/actualizarstock')
        }
    })
}

exports.actualizarstockcovid2p = (req, res) =>{
    
    let stockNuevo = parseInt(req.body.valorcovid2p)
    // recuperar stock de la db
    conexion.query("SELECT * FROM vacunatorios WHERE zona='Municipalidad' ",(error, results) => {

        if(stockNuevo != 0 && ((stockNuevo <= 0) ? (stockNuevo * -1) <= results[0].stock_phizer : true) ){
            stockNuevo += results[0].stock_phizer
            conexion.query("UPDATE vacunatorios SET stock_phizer = '"+stockNuevo+"' WHERE zona='Municipalidad'" ,(error, results) => {
                if(error) throw error;

                res.redirect('/areaPersonalAdmin/actualizarstock')
            })
        }else{
            res.redirect('/areaPersonalAdmin/actualizarstock')
        }
    })
} 


///---------------

exports.actualizargripe3 = (req, res) =>{

    let stockNuevo = parseInt(req.body.valorgripe3)
    // recuperar stock de la db
    conexion.query("SELECT * FROM vacunatorios WHERE zona='Terminal de omnibus' ",(error, results) => {

        if(stockNuevo != 0 && ((stockNuevo <= 0) ? (stockNuevo * -1) <= results[0].stock_gripe : true) ){
            stockNuevo += results[0].stock_gripe
            conexion.query("UPDATE vacunatorios SET stock_gripe = '"+stockNuevo+"' WHERE zona='Terminal de omnibus'" ,(error, results) => {
                if(error) throw error;

                res.redirect('/areaPersonalAdmin/actualizarstock')
            })
        }else{
            res.redirect('/areaPersonalAdmin/actualizarstock')
        }
    })
}


exports.actualizarfiebre3 = (req, res) =>{

    let stockNuevo = parseInt(req.body.valorfiebre3)
    // recuperar stock de la db
    conexion.query("SELECT * FROM vacunatorios WHERE zona='Terminal de omnibus' ",(error, results) => {

        if(stockNuevo != 0 && ((stockNuevo <= 0) ? (stockNuevo * -1) <= results[0].stock_fiebreA : true) ){
            stockNuevo += results[0].stock_fiebreA
            conexion.query("UPDATE vacunatorios SET stock_fiebreA = '"+stockNuevo+"' WHERE zona='Terminal de omnibus'" ,(error, results) => {
                if(error) throw error;

                res.redirect('/areaPersonalAdmin/actualizarstock')
            })
        }else{
            res.redirect('/areaPersonalAdmin/actualizarstock')
        }
    })
}


exports.actualizarstockcovid3m = (req, res) =>{

    let stockNuevo = parseInt(req.body.valorcovid3m)
    // recuperar stock de la db
    conexion.query("SELECT * FROM vacunatorios WHERE zona='Terminal de omnibus' ",(error, results) => {

        if(stockNuevo != 0 && ((stockNuevo <= 0) ? (stockNuevo * -1) <= results[0].stock_moderna : true) ){
            stockNuevo += results[0].stock_moderna
            conexion.query("UPDATE vacunatorios SET stock_moderna = '"+stockNuevo+"' WHERE zona='Terminal de omnibus'" ,(error, results) => {
                if(error) throw error;

                res.redirect('/areaPersonalAdmin/actualizarstock')
            })
        }else{
            res.redirect('/areaPersonalAdmin/actualizarstock')
        }
    })
}

exports.actualizarstockcovid3p = (req, res) =>{

    let stockNuevo = parseInt(req.body.valorcovid3p)
    // recuperar stock de la db
    conexion.query("SELECT * FROM vacunatorios WHERE zona='Terminal de omnibus' ",(error, results) => {

        if(stockNuevo != 0 && ((stockNuevo <= 0) ? (stockNuevo * -1) <= results[0].stock_phizer : true) ){
            stockNuevo += results[0].stock_phizer
            conexion.query("UPDATE vacunatorios SET stock_phizer = '"+stockNuevo+"' WHERE zona='Terminal de omnibus'" ,(error, results) => {
                if(error) throw error;

                res.redirect('/areaPersonalAdmin/actualizarstock')
            })
        }else{
            res.redirect('/areaPersonalAdmin/actualizarstock')
        }
    })
} 
