'Use strict'
const express = require('express');
const apiUsuario = require('../controllers/apiUsuario');
const apiAnuncio = require('../controllers/apiAnuncio');
const apiUbicacion = require('../controllers/apiUbicacion');
const autenticacion = require('../middlewares/autenticacion');
const api = express.Router();


//anuncios 2019 -_- homologar los nombres de las rutas y las funciones
api.post('/resetPassword', apiUsuario.resetPassword);
api.post('/signup', apiUsuario.signUp);
api.post('/signin', apiUsuario.signIn);
api.post('/validarSesion',autenticacion, apiUsuario.validarSesion);
api.put('/actualizarUsuario',autenticacion, apiUsuario.actualizarUsuario);
api.post('/nuevoAnuncio',autenticacion, apiAnuncio.nuevo);
api.post('/nuevoAnuncio_photos',autenticacion, apiAnuncio.updatePhoto);
api.get('/anunciosUser',autenticacion, apiAnuncio.getAnunciosUser);
api.delete('/anunciosUser',autenticacion, apiAnuncio.deleteAnunciosUser);
api.get('/anuncios', apiAnuncio.getAnuncios);


//ubicaciones 2019

api.get('/ubicacion',autenticacion, apiUbicacion.getUbicacionesUser);
api.get('/ubicacion/:tabla/:id', apiUbicacion.getUbicacion);
api.post('/nuevaUbicacion',autenticacion, apiUbicacion.nuevo);
api.post('/nuevaUbicacion_photos',autenticacion, apiUbicacion.nuevaUbicacion_photos);
api.put('/ubicacion',autenticacion, apiUbicacion.updateUbicacion);
api.delete('/ubicacion',autenticacion, apiUbicacion.deleteUbicacion);
api.get('/ubicaciones', apiUbicacion.getUbicaciones);


// Rutas getAnunciosUser ---old
//api.get('/misUbicaciones',autenticacion, apiUbicacion.misUbicaciones);
api.post('/updatePhoto/:tabla/:id',autenticacion,apiUbicacion.updatePhoto)
api.delete('/deletePhoto/:cadena',autenticacion,apiUbicacion.deletePhoto)
//api.post('/ubicacion',autenticacion, apiUbicacion.saveUbicacion);
///

//?
api.put('/view',apiUbicacion.viewUbicacion);
api.get('/propiedadRandom/:cantidad', apiUbicacion.getRandom);



api.get('*', function(req, res) {
  res.send('Por que intentas entrar a nuestro Archivero >:(');
});


api.post('*', function(req, res) {
  res.send('No nos gustas las llamadas ocultas a nuestro Archivero >:(');
});
api.put('*', function(req, res) {
  res.send('Por que quieres modificar las cosas de nuestro Archivero >:(');
});
api.delete('*', function(req, res) {
  res.send('Por que quieres borrar cosas de nuestro Archivero >:(');
});

module.exports = api;