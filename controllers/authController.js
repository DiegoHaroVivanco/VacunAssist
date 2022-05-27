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

        //     
        // conexion.query('SELECT * FROM Usuarios WHERE email = email', (error, results) => {
        //     // if any error while executing above query, throw error
        //     if (error) throw error;
        //     // if there is no error, you have the result
        //     // iterate for all the rows in result
        //     Object.keys(results).forEach((key) =>{
        //         let row = results[key];
        //         console.log(row.Email)
        //         if(row.Email){
        //             repeated = true;    
        //         }
                
        //     })
        // })

        conexion.query('INSERT INTO Usuarios SET ?', {
            dni: dni, nom: nom, ape: ape, FechaNac: fecha, Zona: zona, Email: email, Pass: passHash, token: token
            }, (error, results) => {
                if (error) {
                    throw error;
                } else {
                    res.render('register', {
                    alert: true,
                    alerTitle: "Registro exitoso",
                    alertMessage: "Se envió un token al email ingresado",
                    alertIcon: 'success',
                    showConfirmButton: false,
                    timer: 3000,
                    ruta: 'login' // despues tiene que ir a la ruta para cargar vacunas
                })

                    //res.redirect('/login')
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
                    res.cookie('jwt', jToken, cookiesOptions)

                    res.render('login', {
                        alert: true,
                        alerTitle: "",
                        alertMessage: "Ingrese el token de seguridad",
                        alertIcon: 'success',
                        showConfirmButton: false,
                        timer: 3000,
                        ruta: 'autenticar'
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
        console.log(token)
        console.log(userToken.tokenHash)
        console.log(token === userToken.tokenHash)
        //if(await bcryptjs.compare(token, user.tokenHash)){
        if (token === userToken.tokenHash) {
            res.render('autenticar', {
                alert: true,
                alerTitle: "Token correcto",
                alertMessage: "Inicio de sesion correcto",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 2500,
                ruta: 'areaPersonal'
            })
        } else {
            res.render('autenticar', {
                alert: true,
                alerTitle: "Error",
                alertMessage: "Token de seguridad icorrecto",
                alertIcon: 'error',
                showConfirmButton: false,
                timer: false,
                ruta: 'login'
            })
        }

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


// controlers del admin

exports.loginAdmin = (req, res) =>{
    const token = req.body.token
    console.log(token)
    conexion.query('SELECT * FROM admins WHERE token = ?', [token] ,(error, results) => {
        console.log(results[0].token)
        if(token === results[0].token){
            res.render('inicioAdmin', {
                alert: true,
                alerTitle: "",
                alertMessage: "Token valido",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 1000,
                ruta: 'areaPersonalAdmin' 
            }) 
        }else{
            res.render('inicioAdmin', {
                alert: true,
                alerTitle: "",
                alertMessage: "Token inválido",
                alertIcon: 'error',
                showConfirmButton: false,
                timer: false,
                ruta: 'autenticacion' 
            }) 
        }
        
    })
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

        conexion.query("SELECT * FROM Usuarios WHERE Email = '"+email+"'", (error, results) => { //selecciono a los usuarios con el email ingresado
            if(results.length == 0){ // no hay usuarios registrados con el email ingresado
                
                conexion.query('INSERT INTO Usuarios SET ?', {
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
                            showConfirmButton: false,
                            timer: 3000,
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
            }else{
                res.render('registrarVacunador', {
                    alert: true,
                    alerTitle: "Error",
                    alertMessage: "El email imgresado ya se encuentra registrado",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'areaPersonalAdmin/registroVacunador'
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
    const stockNuevo = req.body.valorgripe1

        if(stockNuevo < 0){
            res.redirect('/areaPersonalAdmin/actualizarstock')
        }else{
            conexion.query("UPDATE vacunatorios SET stock_gripe = '"+stockNuevo+"' WHERE zona='Cementerio municipal'" ,(error, results) => {
                    if(error) throw error;

                    res.redirect('/areaPersonalAdmin/actualizarstock')
            })
        }
}


exports.actualizarfiebre1 = (req, res) =>{
    const stockNuevo = req.body.valorfiebre1

    if(stockNuevo < 0){
        res.redirect('/areaPersonalAdmin/actualizarstock')
    }else{
        conexion.query("UPDATE vacunatorios SET stock_fiebreA = '"+stockNuevo+"' WHERE zona='Cementerio municipal'" ,(error, results) => {
                if(error) throw error;

                res.redirect('/areaPersonalAdmin/actualizarstock')
        })
    }
}


exports.actualizarstockcovid1m = (req, res) =>{

    const stockNuevo = req.body.valorcovid1m

    if(stockNuevo < 0){
        res.redirect('/areaPersonalAdmin/actualizarstock')
    }else{
        conexion.query("UPDATE vacunatorios SET stock_moderna = '"+stockNuevo+"' WHERE zona='Cementerio municipal'" ,(error, results) => {
                if(error) throw error;

                res.redirect('/areaPersonalAdmin/actualizarstock')
        })
    }
}

exports.actualizarstockcovid1p = (req, res) =>{

    const stockNuevo = req.body.valorcovid1p

    if(stockNuevo < 0){
        res.redirect('/areaPersonalAdmin/actualizarstock')
    }else{
        conexion.query("UPDATE vacunatorios SET stock_phizer = '"+stockNuevo+"' WHERE zona='Cementerio municipal'" ,(error, results) => {
                if(error) throw error;

                res.redirect('/areaPersonalAdmin/actualizarstock')
        })
    }
} 


////----------

exports.actualizargripe2 = (req, res) =>{

    const stockNuevo = req.body.valorgripe2

    if(stockNuevo < 0){
        res.redirect('/areaPersonalAdmin/actualizarstock')
    }else{
        conexion.query("UPDATE vacunatorios SET stock_gripe = '"+stockNuevo+"' WHERE zona='Municipalidad'" ,(error, results) => {
                if(error) throw error;

                res.redirect('/areaPersonalAdmin/actualizarstock')
        })
    }
}


exports.actualizarfiebre2 = (req, res) =>{

    const stockNuevo = req.body.valorfiebre2

    if(stockNuevo < 0){
        res.redirect('/areaPersonalAdmin/actualizarstock')
    }else{
        conexion.query("UPDATE vacunatorios SET stock_fiebreA = '"+stockNuevo+"' WHERE zona='Municipalidad'" ,(error, results) => {
                if(error) throw error;

                res.redirect('/areaPersonalAdmin/actualizarstock')
        })
    }

}


exports.actualizarstockcovid2m = (req, res) =>{

    const stockNuevo = req.body.valorcovid2m

    if(stockNuevo < 0){
        res.redirect('/areaPersonalAdmin/actualizarstock')
    }else{
        conexion.query("UPDATE vacunatorios SET stock_moderna = '"+stockNuevo+"' WHERE zona='Municipalidad'" ,(error, results) => {
                if(error) throw error;

                res.redirect('/areaPersonalAdmin/actualizarstock')
        })
    }
}

exports.actualizarstockcovid2p = (req, res) =>{
    const stockNuevo = req.body.valorcovid2p

    if(stockNuevo < 0){
        res.redirect('/areaPersonalAdmin/actualizarstock')
    }else{
        conexion.query("UPDATE vacunatorios SET stock_phizer = '"+stockNuevo+"' WHERE zona='Municipalidad'" ,(error, results) => {
                if(error) throw error;

                res.redirect('/areaPersonalAdmin/actualizarstock')
        })
    }
} 


///---------------

exports.actualizargripe3 = (req, res) =>{

    const stockNuevo = req.body.valorgripe3

    if(stockNuevo < 0){
        res.redirect('/areaPersonalAdmin/actualizarstock')
    }else{
        conexion.query("UPDATE vacunatorios SET stock_gripe = '"+stockNuevo+"' WHERE zona='Terminal de omnibus'" ,(error, results) => {
                if(error) throw error;

                res.redirect('/areaPersonalAdmin/actualizarstock')
        })
    }
}


exports.actualizarfiebre3 = (req, res) =>{
    const stockNuevo = req.body.valorfiebre3

    if(stockNuevo < 0){
        res.redirect('/areaPersonalAdmin/actualizarstock')
    }else{
        conexion.query("UPDATE vacunatorios SET stock_fiebreA = '"+stockNuevo+"' WHERE zona='Terminal de omnibus'" ,(error, results) => {
                if(error) throw error;

                res.redirect('/areaPersonalAdmin/actualizarstock')
        })
    }
}


exports.actualizarstockcovid3m = (req, res) =>{
    const stockNuevo = req.body.valorcovid3m

    if(stockNuevo < 0){
        res.redirect('/areaPersonalAdmin/actualizarstock')
    }else{
        conexion.query("UPDATE vacunatorios SET stock_moderna = '"+stockNuevo+"' WHERE zona='Terminal de omnibus'" ,(error, results) => {
                if(error) throw error;

                res.redirect('/areaPersonalAdmin/actualizarstock')
        })
    }
}

exports.actualizarstockcovid3p = (req, res) =>{

    const stockNuevo = req.body.valorcovid3p

    if(stockNuevo < 0){
        res.redirect('/areaPersonalAdmin/actualizarstock')
    }else{
        conexion.query("UPDATE vacunatorios SET stock_phizer = '"+stockNuevo+"' WHERE zona='Terminal de omnibus'" ,(error, results) => {
                if(error) throw error;

                res.redirect('/areaPersonalAdmin/actualizarstock')
        })
    }

} 
