'Use strict'
const express = require('express');
const raizControl = require('../controllers/raiz');
const usuarioControl = require('../controllers/usuario');
const raiz = express.Router();

//raiz.get('/', raizControl.index);
raiz.get('/', raizControl.ubicaciones);
raiz.get('/login', raizControl.login);
raiz.get('/signIn/', raizControl.registrarse);
raiz.get('/activar/:link', raizControl.activarCuenta);
raiz.get('/publicar', raizControl.publicar);
raiz.get('/ubicaciones', raizControl.ubicaciones);
raiz.get('/nuevaUbicacion', raizControl.nuevaUbicacion);
raiz.get('*', function(req,res){
	res.render('error404', { title: 'Error', seccion: '' });
	});
module.exports = raiz;