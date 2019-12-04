// Requires

var express = require('express');
var mogoose = require('mongoose');
var bodyParser = require('body-parser')

// Importar rutas 

var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');


// Inicializar Variable 
var app = express();

// body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())

// Conexion a la base de datos
mogoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});
// Rutas 
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);



// Escuchar peticiones 
app.listen(3000, () => {
    console.log('Exoress serve escuchando por el puerto 3000: \x1b[32m%s\x1b[0m', 'online');

});