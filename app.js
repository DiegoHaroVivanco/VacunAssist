const express = require('express')
const cookieParser = require('cookie-parser')
const pathh = require('path')
const authController = require('./controllers/authController')
const controllerVacunador = require('./controllers/controllerVacunador')
const middleware = require('./middlewares/validacion-user')
const middlewareVacunador = require('./middlewares/validacion-vacundaor')
const mime = require('mime');

const app = express()

app.set('view engine', 'ejs')


// escribimos la función que creará nuestra cabecera
const setHeadersOnStatic = (res, path, stat) => {
    const type = mime.getType(path);
    res.set('content-type', type);
}
  
// creamos el objeto con las opciones
const staticOptions = {
    setHeaders: setHeadersOnStatic
}
  
  // usamos las opciones
  app.use(express.static(pathh.join(__dirname, 'public'), staticOptions));

// app.use(express.static('public'))

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

app.get('/areaPersonal/editarperfil', (req, res) =>{
    res.sendFile(__dirname + '/public/area-paciente/perfilpaciente.html')
})


app.get('/areaPersonal/js/perfilpaciente.js', (req, res)=>{
    res.sendFile(__dirname + '/public/area-paciente/perfilpaciente.js')

})


app.get('/datosusuarioPaciente/', authController.dataUsuarioPaciente,(req, res)=>{

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
    res.render('dashVacunador')
})

app.get('/areaPersonalVacunador/dashboard.js', (req, res)=>{
    res.sendFile(__dirname + '/public/admins/dashboard.js')
})

app.get('/areaPersonalVacunador/editarperfil', (req, res)=>{
    res.sendFile(__dirname + '/public/area-vacunador/perfil.html')

})

app.get('/areaPersonalVacunador/js/perfilvacunador.js', (req, res)=>{
    res.sendFile(__dirname + '/public/area-vacunador/js/perfilvacunador.js')

})

app.get('/datosusuarioVacunador/', controllerVacunador.dataUsuarioVacunador,(req, res)=>{

})




// RUTAS DE ADMIN

app.get('/autenticacion', (req, res)=>{
    res.render('inicioAdmin', {alert:false})
})
app.get('/areaPersonalAdmin', authController.isAuthenticatedAdministrador, (req, res)=>{
    res.render('dash-admin', {alert: false})
})

app.get('/areaPersonalAdmin/dashboard.js', (req, res)=>{
    res.sendFile(__dirname + '/public/admins/dashboard.js')
})

app.get('/areaPersonalAdmin/registroVacunador', (req, res)=>{
    res.render('registrarVacunador', {alert:false})
})

app.get('/areaPersonalAdmin/cambiarnombrevacunatorio',(req, res) =>{
    // console.log(__dirname)
    res.sendFile(__dirname + '/public/admins/vacunatorios.html')
    // response.writeHead(200, {'content-tyoe':'application/javascript'})

})

app.get('/infoVacunatorios/', authController.infoVacunatorios,(req, res) =>{
})

app.get('/areaPersonalAdmin/css/main.css', (req, res)=>{
    res.sendFile(__dirname + '/public/admins/css/main.css')

})


app.get('/areaPersonalAdmin/styles.css', (req, res)=>{
    res.sendFile(__dirname + '/public/admins/styles.css')

})

app.get('/areaPersonalAdmin/js/cambiarNombreVacunatorio.js', (req, res)=>{
    res.sendFile(__dirname + '/public/admins/js/cambiarNombreVacunatorio.js')

})

app.get('/areaPersonalAdmin/actualizarstock', (req, res) =>{
    res.sendFile(__dirname + '/public/admins/stock.html')
})

app.get('/areaPersonalAdmin/js/actualizarStock.js', (req, res)=>{
    res.sendFile(__dirname + '/public/admins/js/actualizarStock.js')

}) 

app.get('/areaPersonalAdmin/paven.png', (req, res)=>{
    res.sendFile(__dirname + '/public/admins/paven.png')

}) 

// 4 digitos - token
// admin carga contraseña, y se le envia el mail del vacunador
// terminal de omnibus, municipalidad y cementerio municipal

app.get('/', (req, res)=>{
    //conexion.end();
    res.sendFile(pathh.resolve(__dirname, 'public/login-register/index.html'))
})

// ----- RUTAS PARA METODOS DEL CONTROLADOR ----
// hacer un post con la ruta a usar, 
//retornar la data en el autcontroller y hacer un fetch a la url del lado del cliente
app.post('/registro', middleware.validacionUsuario, middleware.usuarioResult, authController.register)
app.post('/login', authController.login)
app.get('/logout', authController.logout)
app.post('/autenticar', authController.autenticar)

// admin 
app.post('/autenticacion', authController.loginAdmin)
app.post('/registroVacunador', middlewareVacunador.validacionUsuarioVacunador, middlewareVacunador.usuarioResult,authController.registerVacunador)
app.get('/logoutAdministrador', authController.logoutAdministrador)
//

app.post('/recuperar-pass', authController.recuperarContraseña)
app.put('/recuperar-pass', authController.recuperarContraseña) 

app.post('/loginVacunador', controllerVacunador.login)
app.post('/autenticarVacunador', controllerVacunador.autenticar)
app.post('/recuperar-passVacunador', controllerVacunador.recuperarContraseña)
app.put('/recuperar-passVacunador', controllerVacunador.recuperarContraseña)
app.get('/logoutVacunador', controllerVacunador.logout)


app.post('/cambiarnombrevacunatorio1', authController.cambiarVacunatorio1)
app.post('/cambiarnombrevacunatorio2', authController.cambiarVacunatorio2)
app.post('/cambiarnombrevacunatorio3', authController.cambiarVacunatorio3)

app.post('/stockgripe2', authController.actualizargripe2)
app.post('/stockfiebre2', authController.actualizarfiebre2)
app.post('/stockcovid2m', authController.actualizarstockcovid2m)
app.post('/stockcovid2p', authController.actualizarstockcovid2p)

app.post('/stockgripe1', authController.actualizargripe1)
app.post('/stockfiebre1', authController.actualizarfiebre1)
app.post('/stockcovid1m', authController.actualizarstockcovid1m)
app.post('/stockcovid1p', authController.actualizarstockcovid1p)


app.post('/stockgripe3', authController.actualizargripe3)
app.post('/stockfiebre3', authController.actualizarfiebre3)
app.post('/stockcovid3m', authController.actualizarstockcovid3m)
app.post('/stockcovid3p', authController.actualizarstockcovid3p)

app.post('/cambiarpasswordvacunador', controllerVacunador.cambiarContrasena)
app.put('/cambiarpasswordvacunador', controllerVacunador.cambiarContrasena)


app.post('/actualizarzona', controllerVacunador.actualizarZonaVacunador)



app.post('/cambiarpasswordpaciente', authController.cambiarContrasena)
app.put('/cambiarpasswordpaciente', authController.cambiarContrasena)
app.post('/cambiarestadoriesgo', authController.cambiarEstadoRiesgo)

app.post('/actualizarzonapaciente', authController.actualizarZonaPaciente)



app.listen(3000, ()=>{
    console.log('Server corriendo en http://localhost:3000')
})