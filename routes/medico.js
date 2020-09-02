// var mogoose = require('mongoose');
var express = require('express');
var medicoModel = require('../models/medico');
var bcrypt = require('bcryptjs');
var mdAutenticacion = require('../middlewares/autenticacion');



// Inicializar Variable 
var app = express();

// =======================================
// Obtener todos los medicos 
// =======================================
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    medicoModel.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err, medicos) => {
            if (err) {

                res.status(500).json({
                    ok: false,
                    mensaje: 'Error en la base de datos',
                    errors: err
                });
            }
            medicoModel.count({}, (err, conteo) => {

                res.status(200).json({
                    ok: true,
                    medicos: medicos,
                    total: conteo
                });
            });
        });
});
// =======================================
// Obtener un  médico 
// =======================================
app.get('/:id', (req, res) => {
        var id = req.params.id;
        medicoModel.findById(id)
            .populate('usuario', 'nombre email img')
            .populate('hospital')
            .exec((err, medico) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al busca medico',
                        errors: err
                    });
                }
                if (!medico) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'El medico con el ' + id + ' no existe',
                        errors: { message: 'No existe un medico con ese ID' }
                    });
                }
                res.status(200).json({
                    ok: true,
                    medico: medico
                });
            })

    })
    // =======================================
    // Actualizar médico 
    // =======================================
app.put('/:id', mdAutenticacion.vericaToken, (req, res) => {
    var body = req.body;
    var id = req.params.id;
    medicoModel.findById(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al busca medico',
                errors: err
            });
        }
        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el ' + id + ' no existe',
                errors: { message: 'No existe un medico con ese ID' }
            });
        }
        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;


        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }
            res.status(201).json({
                ok: true,
                medico: medicoGuardado
            });
        });
    })
});
// =======================================
// Crear un nuevo medico 
// =======================================
app.post('/', mdAutenticacion.vericaToken, (req, res) => {

    var body = req.body;
    var medico = new medicoModel({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital


    });

    medico.save((err, medicoGuardado) => {
        if (err) {

            return res.status(400).json({
                ok: false,
                mensaje: 'Error en la base de datos',
                errors: err
            });
        }
        return res.status(201).json({
            ok: true,
            medico: medicoGuardado
        });
    });

});
// =======================================
// Elimnar medico por el ID 
// =======================================
app.delete('/:id', mdAutenticacion.vericaToken, (req, res) => {
    var id = req.params.id;

    medicoModel.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {

            return res.status(500).json({
                ok: false,
                mensaje: 'Error barrar medico',
                errors: err
            });
        }
        if (!medicoBorrado) {

            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un medico con ese id:' + id,
                errors: { message: 'No existe un medico con ese id:' + id }
            });
        }
        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
    });
});


module.exports = app;