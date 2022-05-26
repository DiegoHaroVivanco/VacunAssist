const express = require('express')
const cookieParser = require('cookie-parser')
const pathh = require('path')
const authController = require('./controllers/authController')
const controllerVacunador = require('./controllers/controllerVacunador')
const middleware = require('./middlewares/validacion-user')
const middlewareVacunador = require('./middlewares/validacion-vacundaor')

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

// ---- RUTAS PARA LA VISTA ----

// RUTAS DE USUARIOS
app.get('/registro', (req, res)=>{
    res.render('register', {alert:false})
})

app.get('/login', (req, res)=>{
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
     res.render('dash')
})

// RUTAS DE VACUNADOR

app.get('/loginVacunador', (req, res) => {
    res.render('loginVacunador', {alert:false})
})

app.get('/autenticarVacunador', (req, res)=>{
    res.render('autenticarVacunador', {alert:false})
})

app.get('/recuperar-passVacunador', (req, res)=>{
    res.render('recuperarPassVacunador', {alert:false})
})

app.get('/areaPersonalVacunador', controllerVacunador.isAuthenticated,(req, res)=>{
    //conexion.end();
     res.render('dashVacunador')
})


// RUTAS DE ADMIN
app.get('/autenticacion', (req, res)=>{
    res.render('inicioAdmin', {alert:false})
})
app.get('/areaPersonalAdmin', (req, res)=>{
    res.render('dash-admin', {alert: false})
})

app.get('/areaPersonalAdmin/registroVacunador', (req, res)=>{
    res.render('registrarVacunador', {alert:false})
})

// 4 digitos - token
// admin carga contraseña, y se le envia el mail del vacunador
// terminal de omnibus, municipalidad y cementerio municipal

app.get('/', (req, res)=>{
    //conexion.end();
    res.sendFile(pathh.resolve(__dirname, 'public/login-register/index.html'))
})

// ----- RUTAS PARA METODOS DEL CONTROLADOR ----
app.post('/registro', middleware.validacionUsuario, middleware.usuarioResult, authController.register)
app.post('/login', authController.login)
app.get('/logout', authController.logout)
app.post('/autenticar', authController.autenticar)
app.post('/autenticacion', authController.loginAdmin)
app.post('/registroVacunador', middlewareVacunador.validacionUsuarioVacunador, middlewareVacunador.usuarioResult,authController.registerVacunador)

app.post('/recuperar-pass', authController.recuperarContraseña)
app.put('/recuperar-pass', authController.recuperarContraseña) 

app.post('/loginVacunador', controllerVacunador.login)
app.post('/autenticarVacunador', controllerVacunador.autenticar)
app.post('/recuperar-passVacunador', controllerVacunador.recuperarContraseña)
app.put('/recuperar-passVacunador', controllerVacunador.recuperarContraseña)
app.get('/logoutVacunador', controllerVacunador.logout)



app.listen(3000, ()=>{
    console.log('Server corriendo en http://localhost:3000')
})