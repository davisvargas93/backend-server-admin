// var mogoose = require('mongoose');
var express = require('express');
var hospitalModel = require('../models/hospital');
var bcrypt = require('bcryptjs');
var mdAutenticacion = require('../middlewares/autenticacion');



// Inicializar Variable 
var app = express();

// =======================================
// Obtener hospital por ID 
// =======================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    hospitalModel.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, hospital) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al busca hospital',
                    errors: err
                });
            }
            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El hospital con el ' + id + ' no existe',
                    errors: { message: 'No existe un hospital con ese ID' }
                });
            }
            return res.status(200).json({
                ok: true,
                hospital: hospital
            });

        })
});

// =======================================
// Obtener todos los hospitales 
// =======================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    hospitalModel.find({})
        .skip(desde)
        .limit(15)
        .populate('usuario', 'nombre email')
        .exec((err, hospitales) => {
            if (err) {

                res.status(500).json({
                    ok: false,
                    mensaje: 'Error en la base de datos',
                    errors: err
                });
            }
            hospitalModel.count({}, (err, conteo) => {

                res.status(200).json({
                    ok: true,
                    hospitales: hospitales,
                    total: conteo

                });
            })
        });
});



// =======================================
// Actualizar hospital 
// =======================================
app.put('/:id', mdAutenticacion.vericaToken, (req, res) => {
    var body = req.body;
    var id = req.params.id;
    hospitalModel.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al busca hospital',
                errors: err
            });
        }
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el ' + id + ' no existe',
                errors: { message: 'No existe un hospital con ese ID' }
            });
        }
        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;


        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }
            res.status(201).json({
                ok: true,
                hospital: hospitalGuardado
            });
        });
    })
});
// =======================================
// Crear un nuevo hospital 
// =======================================
app.post('/', mdAutenticacion.vericaToken, (req, res) => {

    var body = req.body;
    var hospital = new hospitalModel({
        nombre: body.nombre,
        usuario: req.usuario._id

    });

    hospital.save((err, hospitalGuardado) => {
        if (err) {

            return res.status(400).json({
                ok: false,
                mensaje: 'Error en la base de datos',
                errors: err
            });
        }
        return res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });
    });

});
// =======================================
// Elimnar hospital por el ID 
// =======================================
app.delete('/:id', mdAutenticacion.vericaToken, (req, res) => {
    var id = req.params.id;

    hospitalModel.findByIdAndRemove(id, (err, hospitalBorrado) => {
        if (err) {

            return res.status(500).json({
                ok: false,
                mensaje: 'Error barrar hospital',
                errors: err
            });
        }
        if (!hospitalBorrado) {

            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con ese id:' + id,
                errors: { message: 'No existe un hospital con ese id:' + id }
            });
        }
        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });
    });
});


module.exports = app;