var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;



// =======================================
// Verifcar token 
// =======================================
exports.vericaToken = function(req, res, next) {
        var token = req.query.token;
        jwt.verify(token, SEED, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    ok: false,
                    mensaje: 'Token incorrecto',
                    errors: err
                });
            }
            req.usuario = decoded.usuario;
            next();
            // res.status(200).json({
            //     ok: true,
            //     dedoded: dedoded
            // });
        });
    }
    // =======================================
    // Verifcar Admin 
    // =======================================
exports.vericaADMIN_ROLE = function(req, res, next) {
    var usuario = req.usuario;
    var id = req.params.id;
    console.log(usuario._id);
    console.log(id);


    if (usuario.role === 'ADMIN_ROLE' || id === usuario._id) {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto- No es administrador',
            errors: { message: 'No es administrador, acceso denegado' }
        });
    }
}