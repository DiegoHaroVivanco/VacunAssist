const mysql = require('mysql')
require('dotenv').config()

// const conexion = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'lautaro08',
//     database: 'Vacunassist'
// })

const conexion = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
})


conexion.connect((error) =>{
    if(error){
        throw error;
    }else
        console.log('Conexion exitosa a la base de datos')
})

module.exports = conexion