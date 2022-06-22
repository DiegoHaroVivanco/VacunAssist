const mysql = require('mysql')
require('dotenv').config()
const conf = require('./config')

const conexion = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: '123456789',
   database: 'vacunassist'
})

//const conexion = mysql.createConnection({
//    host: conf.production.host,
//    user: conf.production.username,
//  password: conf.production.password,
 //   database: conf.production.database
//})


conexion.connect((error) =>{
    if(error){
        throw error;
    }else
        console.log('Conexion exitosa a la base de datos')
})

module.exports = conexion