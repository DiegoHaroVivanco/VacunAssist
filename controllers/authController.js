const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db')
const { promisify } = require('util')
const { transporter } = require('../config/mailer') // para enviar el mail
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
        const pass = req.body.password
        const fecha = req.body.fechaNacimiento
        const zona = req.body.zona
        const token = Math.random().toString(36).substring(2)
        let tokenHash = await bcryptjs.hash(token, 8)
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
            dni: dni, nom: nom, ape: ape, FechaNac: fecha, Zona: zona, Email: email, Pass: passHash, token: tokenHash
            }, (error, results) => {
                if (error) {
                    throw error;
                } else {
                    res.render('register', {
                    alert: true,
                    alerTitle: "",
                    alertMessage: "Registro exitoso",
                    alertIcon: 'success',
                    showConfirmButton: false,
                    timer: 2000,
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
            //res.sendFile(pathh.resolve(__dirname, '../public/login-register/login.html'))
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

                    //res.sendFile(pathh.resolve(__dirname, '../public/login-register/login.html'))

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
                    // res.render('login', {           
                    //     alert: true,

                    //     alerTitle: "Login correcto",
                    //     alertMessage: "dsada",
                    //     alertIcon: 'success',
                    //     showConfirmButton: false,
                    //     timer: 800,
                    //     ruta: 'dash'
                    // })

                    res.render('login', {
                        alert: true,
                        alerTitle: "",
                        alertMessage: "Ingrese el token de seguridad",
                        alertIcon: 'success',
                        showConfirmButton: false,
                        timer: 2000,
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
                timer: 800,
                ruta: 'dash'
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

exports.recuperarContraseña =  (req, res) =>{
   
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


