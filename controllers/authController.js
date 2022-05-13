const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db')
const {promisify} = require('util')
const pathh = require('path')

// metodo para registrar

exports.register = async(req, res)=>{
    try{
        const nom = req.body.name
        const ape = req.body.ape
        const dni = req.body.dni
        const email = req.body.email
        const pass = req.body.password
        const fecha = req.body.fechaNacimiento
        const zona = req.body.zona
        const token = Math.random() * 100 + 1;
        let passHash = await bcryptjs.hash(pass, 8)
        //console.log(nom + " - " + ape + " - " + pass)
        //console.log(passHash)
        conexion.query('INSERT INTO Usuarios SET ?', {
            dni: dni, nom: nom, ape: ape, FechaNac: fecha, Zona: zona, Email: email, Pass: passHash, token: token}, (error, results)=>{
                if(error){
                    throw error;
                }else{
                    res.redirect('/login')
                }

            })
    }catch(error){
        console.log(error)
    }

}

exports.login = async (req, res) =>{
    try {
        const user = req.body.email
        const pass = req.body.password
        const token = req.body.token
        //console.log(user+" - "+pass + " - "+token)
        if(!user || !pass || !token){
             res.sendFile(pathh.resolve(__dirname, '../public/login-register/login.html'))
            // res.sendFile(pathh.resolve(__dirname, '../public/login-register/login.html'), {
            //     alert: true,
            //     alerTitle: "Advertencia",
            //     alertMessage: "Nombre de usuario no registrado",
            //     alertIcon: 'info',
            //     showConfirmButton: true,
            //     timer: false,
            //     ruta: '/login'
            // })
        }else{
            conexion.query('SELECT * FROM Usuarios WHERE email = ?', [user], async(error, results)=>{
                if(results.length == 0 || !(await bcryptjs.compare(pass, results[0].Pass))){
                    res.sendFile(pathh.resolve(__dirname, '../public/login-register/login.html'))

                    // res.sendFile(pathh.resolve(__dirname, '../public/login-register/login.html'), {
                    //     alert: true,
                    //     alerTitle: "Advertencia",
                    //     alertMessage: "Contraseña incorrecta",
                    //     alertIcon: 'info',
                    //     showConfirmButton: true,
                    //     timer: false,
                    //     ruta: '/login'
                    // })
                }
                else{
                    const dni = results[0].dni
                    const jToken = jwt.sign({dni:dni}, 'super_secret')
                    console.log("Token: "+jToken+" Para el usuario: "+user)
                    
                    const cookiesOptions = {
                        expires: new Date(Date.now() + 90 * 24*60*60*1000),
                        httpOnly: true
                    }
                    res.cookie('jwt', jToken, cookiesOptions)
                    res.sendFile(pathh.resolve(__dirname, '../public/dash.html'))

                    // res.sendFile(pathh.resolve(__dirname, '../public/login-register/login.html'), {
                    //     alert: true,
                    //     alerTitle: "Conexion exitosa",
                    //     alertMessage: "Login correcto",
                    //     alertIcon: 'succes',
                    //     showConfirmButton: false,
                    //     timer: 800,
                    //     ruta: ''
                    // })
                }
            })
        }

    } catch (error) {
        console.log(error)
    }    
}

exports.isAuthenticated = async (req, res, next) =>{
    if(req.cookies.jwt){
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, 'super_secret')
            conexion.query('SELECT * FROM Usuarios WHERE dni = ?', [decodificada.dni], (error, results) =>{
                if(!results){return next()}
                req.user = results[0]
                return next(); // pasa a ejecutar el siguiente middleware
            })
            
        } catch (error) {
            console.log(error)
            return next()
        }
    }else{
        res.redirect('/login')
    }
}

exports.logout = (req, res) =>{
    res.clearCookie('jwt')
    return res.redirect('/login')
}