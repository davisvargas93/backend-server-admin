var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs');

//modelos
var usuarioModels = require('../models/usuario');
var medicoModels = require('../models/medico');
var hospitalModels = require('../models/hospital');


// Inicializar Variable
var app = express();

// default options
app.use(fileUpload());




app.put('/:tipo/:id', function(req, res) {

    var tipo = req.params.tipo;
    var id = req.params.id;

    //tipos de colecciones 
    var tiposValidos = ['hospitales', 'usuarios', 'medicos']
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de la coleccion no es valida',
            errors: { message: 'El tipo debe ser: ' + tiposValidos.join(', ') }
        });
    }
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'no se selecciono nada',
            errors: { message: 'Debe de seleccionar una imagen' }
        });
    }

    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];
    // solo se acepta las siguientes extensiones

    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'La extensión del archivo no es valida',
            errors: { message: 'Debe de seleccionar una imagen valida ' + extensionesValidas.join(', ') }
        });
    }

    //Nombre de archivo personalizado 
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds()}.${extensionArchivo}`;
    var path = `./uploads/${ tipo }/${nombreArchivo}`;
    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensage: 'Error al mover archivo',
                errors: err
            })
        }
        subirPorTipo(tipo, id, nombreArchivo, res);
        // res.status(200).json({
        //     ok: true,
        //     mensaje: 'Archivo movido',
        //     extensionArchivo: extensionArchivo
        // });
    })





    // if (!req.files || Object.keys(req.files).length === 0) {
    //     return res.status(400).send('No files were uploaded.');
    // }

    // // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    // let sampleFile = req.files.sampleFile;

    // // Use the mv() method to place the file somewhere on your server
    // sampleFile.mv('/somewhere/on/your/server/filename.jpg', function(err) {
    //     if (err)
    //         return res.status(500).send(err);

    //     res.send('File uploaded!');
    // });
});


function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {
        usuarioModels.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;
            // si existe se elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }
            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {
                usuarioActualizado.password = ':('
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Usuario Actualizado',
                    usuario: usuarioActualizado
                });

            })
        });
    }
    if (tipo === 'medicos') {
        medicoModels.findById(id, (err, medico) => {
            if (!medico) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Medico no existe',
                    errors: { message: 'Medico no existe' }
                });
            }
            var pathViejo = './uploads/medicos/' + medico.img;
            // si existe se elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }
            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'medico Actualizado',
                    medico: medicoActualizado
                });

            })
        });

    }
    if (tipo === 'hospitales') {
        hospitalModels.findById(id, (err, hospital) => {
            if (!hospital) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Hospital no existe',
                    errors: { message: 'Hospital no existe' }
                });
            }

            var pathViejo = './uploads/hospitales/' + hospital.img;
            // si existe se elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }
            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'hospital Actualizado',
                    hospital: hospitalActualizado
                });

            })
        });

    }

}





module.exports = app;