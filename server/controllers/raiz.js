'use strict'
const User = require('../models/Usuario')
const service = require('../services')

var titulo ="Anunciate Hoy"
var carpeta ="principal"

function index(req, res) {
    res.render(carpeta, { titulo: titulo, seccion: 'index' });
}
function login(req, res) {
    res.render(carpeta+'/login', { titulo: titulo, seccion: 'login' });
}
function registrarse(req, res) {
    res.render(carpeta+'/signin', { title: titulo, seccion: 'registrarse' });
}

function activarCuenta(req, res) {
	req.params.link = service.valida_contenido(req.params.link)
	var division = req.params.link.split('~');
    User.find({ '_id': division[0],'email': division[1] }, (err, user) => {
        if (err) return res.status(500).send({ message: 'err' })
        if (Object.keys(user).length === 0) return res.render('error404', { title: 'Error', seccion: '' });
	    User.findByIdAndUpdate(division[0], {estatus: 'activado'}, function(err, user) {
	        if (err) return res.status(500).send({ mensaje: "Error al Actualizar el usuario" });
	        if (!user) return res.status(404).send({ mensaje: "El usuario no existe" });
	        res.render('principal/activar', { title: titulo, seccion: 'registrarse' });
	    })
    })   
}

function publicar(req,res){
    res.render(carpeta+'/publicar', { title: titulo, seccion: 'publicar' });
}

function ubicaciones(req,res){
    res.render(carpeta+'/ubicaciones', { title: titulo, seccion: 'ubicaciones' });
}

function nuevaUbicacion(req,res){
    res.render(carpeta+'/nuevaUbicacion', { title: titulo, seccion: 'nuevaUbicacion' });
}

module.exports = {
    index,
    login,
    registrarse,
    activarCuenta,
    publicar,
    ubicaciones,
    nuevaUbicacion
}