const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const pathh = require('path')


// rutas para las vistas
router.get('/', authController.isAuthenticated,(req, res)=>{
    //conexion.end();
    // res.sendFile(pathh.resolve(__dirname, '../public/index.html'))
    res.render('dash')
})

// router.get('/intro', (req, res)=>{
//     //conexion.end();
//     res.sendFile(pathh.resolve(__dirname, 'public/index.html'))
//     // res.render('dash')
// })

router.get('/login', (req, res)=>{
    //res.sendFile(pathh.resolve(__dirname, 'public/login-register/login.html'))
    res.render('login', {alert:false})
})

router.get('/registro', (req, res)=>{
    //res.sendFile(pathh.resolve(__dirname, 'public/login-register/register.html'))
    res.render('register')
})



// rutas para metodos del controlador
router.post('/registro', authController.register)
router.post('/login', authController.login)
router.get('/logout', authController.logout)

module.exports = router