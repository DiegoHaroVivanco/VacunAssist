const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db')
const { promisify } = require('util')
const transporter = require('../config/mailer') // para enviar el mail
const userToken = {
    tokenHash: ''
}


exports.login = async (req, res) => {
    try {
        const user = req.body.email
        const pass = req.body.password
        const token = req.body.token
        if (!user || !pass) {
            res.render('loginVacunador', {
                alert: true,
                alerTitle: "Advertencia",
                alertMessage: "Ingrese usuario y contraseña",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'loginVacunador'
            })

        } else {
            conexion.query('SELECT * FROM vacunadores WHERE email = ?', [user], async (error, results) => {
                if (results.length == 0 || !(await bcryptjs.compare(pass, results[0].Pass))) {

                    res.render('loginVacunador', {
                        alert: true,
                        alerTitle: "Error",
                        alertMessage: "Nombre de usuario no registrado y/o contraseña incorrecta",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'loginVacunador'
                    })
                }
                else {
                    const dni = results[0].dni
                    const jToken = jwt.sign({ dni: dni }, 'super_secret')
                    console.log("Token: " + jToken + " Para el usuario: " + user)
                    console.log("token creado: " + results[0].token)
                    userToken.tokenHash = results[0].token
                     const cookiesOptions = {
                        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    }
                    conexion.query("UPDATE vacunadores SET jsontoken = '"+jToken+"' WHERE dni= '"+dni+"'", async (error, results)=>{
                        if(error) throw error;

                        res.cookie('jwt', jToken, cookiesOptions)

                        res.render('login', {
                            alert: true,
                            alerTitle: "Nombre de usuario y contraseña correctos",
                            alertMessage: "Se lo redigira para el ingreso del token de seguridad",
                            alertIcon: 'success',
                            showConfirmButton: true,
                            timer: 3500,
                            ruta: 'autenticarVacunador'
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
        let token = req.body.token
        // console.log(token)
        // console.log("token local: "+userToken.tokenHash)
        // console.log(token === userToken.tokenHash)
        
        conexion.query("SELECT * FROM vacunadores WHERE token = '"+token+"'", (error, results) => {
            console.log("data" +results[0].token)
            if(results[0].token === token){
                res.render('autenticarVacunador', {
                    alert: true,
                    alerTitle: "Token correcto",
                    alertMessage: "Inicio de sesion correcto",
                    alertIcon: 'success',
                    showConfirmButton: true,
                    timer: 2500,
                    ruta: 'areaPersonalVacunador'
                })
            } else {
                res.render('autenticarVacunador', {
                    alert: true,
                    alerTitle: "Error",
                    alertMessage: "Token de seguridad incorrecto",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: 2500,
                    ruta: 'autenticarVacunador'
                })
            }
            
        })    
        
        // if (token === userToken.tokenHash) {
        //     res.render('autenticarVacunador', {
        //         alert: true,
        //         alerTitle: "Token correcto",
        //         alertMessage: "Inicio de sesion correcto",
        //         alertIcon: 'success',
        //         showConfirmButton: true,
        //         timer: 2500,
        //         ruta: 'areaPersonalVacunador'
        //     })
        // } else {
        //     res.render('autenticarVacunador', {
        //         alert: true,
        //         alerTitle: "Error",
        //         alertMessage: "Token de seguridad incorrecto",
        //         alertIcon: 'error',
        //         showConfirmButton: true,
        //         timer: 2500,
        //         ruta: 'autenticarVacunador'
        //     })
        // }

    } catch (error) {
        console.log(error)
    }
}

exports.isAuthenticated = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, 'super_secret')
            conexion.query('SELECT * FROM vacunadores WHERE dni = ?', [decodificada.dni], (error, results) => {
                if (!results) { return next() }
                req.user = results[0]
                return next(); // pasa a ejecutar el siguiente middleware
            })

        } catch (error) {
            console.log(error)
            return next()
        }
    } else {
        res.redirect('/loginVacunador')
    }
}

exports.logout = (req, res) => {
    res.clearCookie('jwt')
    return res.redirect('/loginVacunador')
}

exports.recuperarContraseña = async (req, res) =>{
    const email = req.body.email
    const passTemporal = Math.random().toString(36).substring(5)
    let passHash = await bcryptjs.hash(passTemporal, 8)
    const linkLogin = `http://localhost:3000/loginVacunador`

    try {
        //conexion.query("SELECT * FROM Usuarios WHERE Email = '"+email+"'", (error, results) => { //selecciono a los usuarios con el email ingresado
        conexion.query('SELECT * FROM vacunadores WHERE email = ?', [email],  async(error, results) => {
            console.log(results.length == 0 ) // para controlar si el mail existe o no
            if(results.length == 0 || results[0].Email !== email){
                res.render('recuperarPassVacunador', {
                    alert: true,
                    alerTitle: "Error",
                    alertMessage: "Email inválido",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'loginVacunador'
                })
            }else{
                // actualizo la contraseña en la db para el email ingresado
                conexion.query("UPDATE vacunadores SET Pass = '"+passHash+"' WHERE Email='"+email+"'", async (error, results)=>{
                    if(error) throw error;
                    console.log(results[0])
                    res.render('recuperarPassVacunador', {
                        alert: true,
                        alerTitle: "",
                        alertMessage: "Se envió una contraseña temporal al email ingresado",
                        alertIcon: 'success',
                        showConfirmButton: false,
                        timer: 3000,
                        ruta: 'loginVacunador'
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

exports.actualizarZonaVacunador = (req, res) =>{
    const zonaNueva = req.body.zona
    console.log("Zona NUEVA: " + zonaNueva)
    let cookieZona = req.cookies.jwt
    console.log("token: " + req.cookies.jwt);    

    conexion.query("SELECT * FROM vacunadores WHERE jsontoken = '"+cookieZona+"' ",(error, results) => {
        console.log(results[0]);
        
            conexion.query("UPDATE vacunadores SET Zona = '"+zonaNueva+"' WHERE jsontoken = '"+cookieZona+"'",(error, results) => {
                if(error) throw error;
                res.redirect('/areaPersonalVacunador/editarperfil')            
            })
        
        
        
    })
}

exports.cambiarContrasena = async (req, res) =>{
    const passTemporal = req.body.pass
    let cookieZona = req.cookies.jwt
    let passHash = await bcryptjs.hash(passTemporal, 8)

    try {
        //conexion.query("SELECT * FROM Usuarios WHERE Email = '"+email+"'", (error, results) => { //selecciono a los usuarios con el email ingresado
        conexion.query("SELECT * FROM vacunadores WHERE jsontoken = '"+cookieZona+"' ", (error, results) => {
                console.log(results[0])
                // actualizo la contraseña en la db para el email ingresado
                conexion.query("UPDATE vacunadores SET Pass = '"+passHash+"' WHERE jsontoken = '"+cookieZona+"'", (error, results)=>{
                    if(error) throw error;
                    res.redirect('/areaPersonalVacunador/editarperfil') 
                })

        })        
    } catch (error) {
        console.log(error)
    }

}


exports.dataUsuarioVacunador = (req, res) =>{
    let cookieZona = req.cookies.jwt

    conexion.query("SELECT * FROM vacunadores WHERE jsontoken = '"+cookieZona+"' ",(error, results) => {
        if(error) throw error;
         //console.log(results)
        res.json(results)
    
    })    
}