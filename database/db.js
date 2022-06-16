const mysql = require('mysql')


const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'lautaro08',
    database: 'Vacunassist'
})

conexion.connect((error) =>{
    if(error){
        throw error;
    }else
        console.log('Conexion exitosa a la base de datos')
})

module.exports = conexion