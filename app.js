// Requires

var express = require('express');
var mogoose = require('mongoose');


// Inicializar Variable 
var app = express();
// Conexion a la base de datos
mogoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});
// Rutas 
app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });
});

// Escuchar peticiones 
app.listen(3000, () => {
    console.log('Exoress serve escuchando por el puerto 3000: \x1b[32m%s\x1b[0m', 'online');

});