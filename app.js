const express = require('express')
//const dotenv = require('dotenv') // para las variables de entorno
const cookieParser = require('cookie-parser')
const pathh = require('path')
const authController = require('./controllers/authController')

// conexiones
//const conexion = require('./database/db')
const app = express()

app.set('view engine', 'ejs')

// seteamos la carpeta public
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

// rutas para las vistas
app.get('/dash', authController.isAuthenticated,(req, res)=>{
    //conexion.end();
    res.sendFile(pathh.resolve(__dirname, 'public/area-paciente/dash.html'))
    // res.render('dash')
})

app.get('/login', (req, res)=>{
    //res.sendFile(pathh.resolve(__dirname, 'public/login-register/login.html'))
    res.render('login', {alert:false})
})

app.get('/registro', (req, res)=>{
    //res.sendFile(pathh.resolve(__dirname, 'public/login-register/register.html'))
    res.render('register')
})

app.get('/registro/cargarvacunas', (req, res)=>{
    res.render('cargarVacunas')
})

app.get('/autenticar', (req, res)=>{
    res.render('autenticar', {alert:false})
})

app.get('/', (req, res)=>{
    //conexion.end();
    res.sendFile(pathh.resolve(__dirname, 'public/login-register/index.html'))
})

// rutas para metodos del controlador
app.post('/registro', authController.register)
app.post('/login', authController.login)
app.get('/logout', authController.logout)
app.post('/autenticar', authController.autenticar)
app.listen(3000, ()=>{
    console.log('Server corriendo en http://localhost:3000')
})