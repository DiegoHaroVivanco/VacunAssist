const express = require('express')
const dotenv = require('dotenv') // para las variables de entorno
const cookieParser = require('cookie-parser')
const pathh = require('path')
const authController = require('./controllers/authController')


// conexiones
const conexion = require('./database/db')
const app = express()

// seteamos la carpeta public

app.use(express.static('public/login-register'))
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())

// para eliminar el cache y no se pueda volver con el boton de atras
app.use(function (req, res, next){
    if(!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    next()
    })

//seteamos las variables de entorno
dotenv.config({path: './env.env'})

// para poder trabajar con las cookies
app.use(cookieParser())

// rutas para las vistas

app.get('/dash', authController.isAuthenticated,(req, res)=>{
    //conexion.end();
    res.sendFile(pathh.resolve(__dirname, 'public/dash.html'))
})

app.get('/', authController.isAuthenticated,(req, res)=>{
    //conexion.end();
    res.sendFile(pathh.resolve(__dirname, 'public/index.html'))
})

app.get('/login', (req, res)=>{
    res.sendFile(pathh.resolve(__dirname, 'public/login-register/login.html'))
})

app.get('/registro', (req, res)=>{
    res.sendFile(pathh.resolve(__dirname, 'public/login-register/register.html'))
})

// rutas para metodos del controlador
app.post('/registro', authController.register)
app.post('/login', authController.login)
app.get('/logout', authController.logout)

app.listen(3000, ()=>{
    console.log('Server corriendo en http://localhost:3000')
})