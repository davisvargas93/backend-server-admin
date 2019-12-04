// var mogoose = require('mongoose');
var express = require('express');
var usuarioModel = require('../models/usuario');
var bcrypt = require('bcryptjs');
var mdAutenticacion = require('../middlewares/autenticacion');



// Inicializar Variable 
var app = express();



// Rutas 

// =======================================
// Obtener todos los usuarios 
// =======================================
app.get('/', (req, res, next) => {

    usuarioModel.find({}, 'nombre email img role')
        .exec((err, usuarios) => {
            if (err) {

                res.status(500).json({
                    ok: false,
                    mensaje: 'Error en la base de datos',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                usuarios: usuarios
            });
        })
});

// =======================================
// Actualizar usuario 
// =======================================
app.put('/:id', mdAutenticacion.vericaToken, (req, res) => {
    var body = req.body;
    var id = req.params.id;
    usuarioModel.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al busca usuario',
                errors: err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el ' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        // usuario.password = body.password;
        // usuario.img = body.img;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }
            usuarioGuardado.password = ':('
            res.status(201).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    })
});
// =======================================
// Crear un nuevo usuario 
// =======================================
app.post('/', mdAutenticacion.vericaToken, (req, res) => {

    var body = req.body;
    var usuario = new usuarioModel({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {

            return res.status(400).json({
                ok: false,
                mensaje: 'Error en la base de datos',
                errors: err
            });
        }
        return res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });
    });

});
// =======================================
// Elimnar usuario por el ID 
// =======================================
app.delete('/:id', mdAutenticacion.vericaToken, (req, res) => {
    var id = req.params.id;

    usuarioModel.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {

            return res.status(500).json({
                ok: false,
                mensaje: 'Error barrar usuario',
                errors: err
            });
        }
        if (!usuarioBorrado) {

            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese id:' + id,
                errors: { message: 'No existe un usuario con ese id:' + id }
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;