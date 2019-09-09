'Use strict'
const express = require('express');
const userCtrl = require('../controllers/usuario');
const autenticacion = require('../middlewares/autenticacion');

const usuario = express.Router();

//anuncios
usuario.get('/', userCtrl.perfil);
usuario.get('/perfil', userCtrl.perfil);
usuario.get('/anuncios', userCtrl.anuncios);
usuario.get('/ubicaciones', userCtrl.ubicaciones);


//ubicaciones
usuario.get('/ubicacion/:tabla/:id',autenticacion, userCtrl.ubicacion);
usuario.get('/nuevaUbicacion',autenticacion, userCtrl.nuevaUbicacion);
usuario.get('/imagen/:tabla/:id',autenticacion, userCtrl.imagen);
usuario.get('/imagenes/:tabla/:id',autenticacion, userCtrl.imagenes);

usuario.get('*', function(req, res) {
  res.render('error404', { title: 'Error', seccion: '' });
});

module.exports = usuario;
