const express = require('express')
//const dotenv = require('dotenv') // para las variables de entorno
const cookieParser = require('cookie-parser')
const pathh = require('path')
const authController = require('./controllers/authController')
const middleware = require('./middlewares/validacion-user')
// const {body, validationResult} = require('express-validator')

const app = express()



app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('/public', express.static('public'))

// para eliminar el cache y no se pueda volver con el boton de atras
app.use(function (req, res, next){
    if(!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    next()
})


// para poder trabajar con las cookies
app.use(cookieParser())

// RUTAS PARA LA VISTA

// rutas de usuarios
app.get('/registro', (req, res)=>{
    //res.sendFile(pathh.resolve(__dirname, 'public/login-register/register.html'))
    res.render('register', {alert:false})
})

app.get('/login', (req, res)=>{
    //res.sendFile(pathh.resolve(__dirname, 'public/login-register/login.html'))
    res.render('login', {alert:false})
})

app.get('/autenticar', (req, res)=>{
    res.render('autenticar', {alert:false})
})

app.get('/recuperar-pass', (req, res)=>{
    res.render('recuperarPass', {alert:false})
})

app.get('/areaPersonal', authController.isAuthenticated,(req, res)=>{
    //conexion.end();
    //res.sendFile(pathh.resolve(__dirname, 'public/area-paciente/dash.html'))
     res.render('dash')
})


// RUTAS DE ADMIN
app.get('/autenticacion', (req, res)=>{
    res.render('inicioAdmin', {alert:false})
})
app.get('/areaPersonalAdmin', (req, res)=>{
    //res.sendFile(pathh.resolve(__dirname,'public/admins/indexx.html'))
    res.render('dash-admin', {alert: false})
})

app.get('/areaPersonalAdmin/registroPaciente', (req, res)=>{
    res.render('registrarPaciente', {alert:false})
})

// 4 digitos - token
// admin carga contraseña, y se le envia el mail del vacunador
// terminal de omnibus, municipalidad y cementerio municipal

app.get('/', (req, res)=>{
    //conexion.end();
    res.sendFile(pathh.resolve(__dirname, 'public/login-register/index.html'))
})

// RUTAS PARA METODOS DEL CONTROLADOR
app.post('/registro', middleware.validacionUsuario, middleware.usuarioResult, authController.register)
app.post('/login', authController.login)
app.get('/logout', authController.logout)
app.post('/autenticar', authController.autenticar)
app.post('/autenticacion', authController.loginAdmin)
app.post('/registroPaciente', authController.registerPaciente)

app.post('/recuperar-pass', authController.recuperarContraseña) // ¿faltaria un post o put?
app.put('/recuperar-pass', authController.recuperarContraseña) // ¿faltaria un post o put?


app.listen(3000, ()=>{
    console.log('Server corriendo en http://localhost:3000')
})