var express = require('express');
var mogoose = require('mongoose');
var hospitalModel = require('../models/hospital');
var medicoModel = require('../models/medico');
var usuarioModel = require('../models/usuario');


// Inicializar Variable 
var app = express();
//================================
//Busqueda por coleccion
//================================

app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');
    var tabla = req.params.tabla;

    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(regex);
            break;
        case 'hospitales':
            promesa = buscarHospitales(regex);
            break;
        case 'medicos':
            promesa = buscarMedicos(regex);
            break;
        default:
            res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda sonsolo usuarios, medisco y hospitales',
                error: { message: 'Tipo de tabla/coleccion no valido' }
            });

    }
    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    })
});

// Rutas 
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
            buscarHospitales(regex),
            buscarMedicos(regex),
            buscarUsuarios(regex)
        ])
        .then(respuesta => {
            res.status(200).json({
                ok: true,
                hospitales: respuesta[0],
                medicos: respuesta[1],
                usuarios: respuesta[2]
            });
        })
});
//================================
//Busqueda todas las colecciones
//================================

function buscarHospitales(regex) {
    return new Promise((resolve, reject) => {

        hospitalModel.find({ nombre: regex }, (err, hospitales) => {
            if (err) {
                reject('Erro al cargar Hospitales', err);
            } else {
                resolve(hospitales);
            }
        });
    });
}

function buscarMedicos(regex) {
    return new Promise((resolve, reject) => {

        medicoModel.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {
                if (err) {
                    reject('Erro al cargar medicos', err);
                } else {
                    resolve(medicos);
                }
            });
    });
}

function buscarUsuarios(regex) {
    return new Promise((resolve, reject) => {

        usuarioModel.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarior) => {
                if (err) {
                    reject('Erro al cargar usuarior', err);
                } else {
                    resolve(usuarior);
                }
            })
    });
}
module.exports = app;