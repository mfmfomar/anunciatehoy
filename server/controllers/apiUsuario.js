'use strict'

const User = require('../models/Usuario')
const service = require('../services')
const bcrypt = require('bcrypt-nodejs');
const correo = require('../middlewares/correo');


function resetPassword(req, res) {
    if (req.body.email === "" || req.body.email === null || req.body.email === undefined) {
        res.status(500).send({ message: `Datos incompletos`, code: 0 })
    } else {
        User.find({ 'email': req.body.email }, (err, user) => {
            if (err) return res.status(500).send({ message: 'err' })
            if (Object.keys(user).length === 0) return res.status(404).send({ message: 'No existe el usuario', code: 1 })
            const email = new User({
                email: req.body.email,
                tipo: 'resetPassword'
            })
            let token = service.createToken(email);
            let optMail = ({
            from: '"www.Ubicaciones.com" <Ubicaciones@gmail.com>', // sender address
            to:req.body.email,
            subject:'Reinicio de contraseña ✔',
            token:token,
            code: req.body.code,
            text: 'algun texto', // plain text body
            html: '<b>NodeJS Email Tutorial</b>' // html body
            })
            correo.enviar(req, res, 'resetPassword');
        })
    }
}

function signUp(req, res) {
    const user = new User({
        email: service.valida_contenido(req.body.email.toLowerCase()),
        nombre: service.valida_contenido(req.body.nombre),
        apellido: service.valida_contenido(req.body.apellido),
        telefono: service.valida_contenido(req.body.telefono),
        password: service.valida_contenido(req.body.password),
        pais: service.valida_contenido(req.body.pais),
        estado: service.valida_contenido(req.body.estado),
        ciudad: service.valida_contenido(req.body.ciudad),
        countryCode: service.valida_contenido(req.body.countryCode.toLowerCase()),
        tipo: service.valida_contenido(req.body.tipo)
    })
    if (req.body.email === "" || req.body.password === "" || req.body.email === null || req.body.password === null || req.body.email === undefined || req.body.password === undefined) {   
        res.status(500).send({ message: `Error con los datos de session`, code: 0 })
    } else {
        user.save((err, usuario) => {
            try {
                switch (err.code) {
                    case 11000:
                        return res.status(500).send({ message: `Ya existe un usuario registrado con el mismo correo electronico`, code: 1 })
                        break;
                    default:
                        return res.status(500).send({ message: `error` })
                }
            } catch (err) {
                //return res.status(200).send({  message:'Registro completado',token: `Bearer ${service.createToken(usuario)}`  })
                correo.enviar(req, res, 'registro',usuario);
                return res.status(200).send({  message:'Registro completado', correo:true })
            }
        })

    }
}

function signIn(req, res) {
    if (req.body.email === "" || req.body.password === "" || req.body.email === null || req.body.password === null || req.body.email === undefined || req.body.password === undefined) {
        res.status(500).send({ message: `Datos incompletos`, code: 0 })
    } else {
        User.find({ 'email': req.body.email }, (err, user) => {
            if (err) return res.status(500).send({ message: 'err' })
            if (Object.keys(user).length === 0) return res.status(404).send({ message: 'No existe el usuario', code: 1 })
            if(user[0].estatus=='desactivado') return res.status(404).send({ message: 'La Cuenta no esta activada', code: 4 })

            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    //console.log('bcrypt - error - ', err);
                    return res.status(500).send({ message: `error`, code: 2 })
                } else {
                    if (result) {
                        let usuario = {}
                        usuario.nombre = user[0].nombre;
                        usuario.apellido = user[0].apellido;
                        usuario.telefono = user[0].telefono;
                        usuario.tipo = user[0].tipo;
                        usuario.email = user[0].email;
                        usuario.pais = user[0].pais;
                        usuario.estado = user[0].estado;
                        usuario.ciudad = user[0].ciudad;
                        usuario.countryCode = user[0].countryCode;
                        return res.status(200).send({ token: `Bearer ${service.createToken(user[0])}`, usuario })
                    }
                    return res.status(404).send({ message: 'Contraseña incorrecta', code: 3 })
                }
            });
        })
    }
}

function actualizarUsuario(req, res) {

    let update = req.body;
    update.nombre = service.valida_contenido(update.nombre)
    update.apellido = service.valida_contenido(update.apellido)
    update.telefono = service.valida_contenido(update.telefono)
    update.email = service.valida_contenido(update.email)
    User.findByIdAndUpdate(req.user, update, function(err, user) {
        if (err) return res.status(500).send({ mensaje: "Error al Actualizar el usuario" });
        if (!user) return res.status(404).send({ mensaje: "El usuario no existe" });
        res.status(200).send({ mensaje: 'Usuario actualizado', update });
    })
}

function validarSesion(req, res) {
    res.status(200).send(true);
}

module.exports = {
    signUp,
    signIn,
    resetPassword,
    actualizarUsuario,
    validarSesion
}