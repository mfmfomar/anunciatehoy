'Use strict'
const express = require('express');
const propiedadCtrl = require('../controllers/apiUbicacion');
const userCtrl = require('../controllers/apiUsuario');
const auth = require('../middlewares/autenticacion');
const admin = express.Router();

//Rutas
admin.get('/', function(req, res) {
  res.sendFile(res.app.get('views') + '/admin/index.html');
});
admin.get('/new', function(req, res) {
  res.sendFile(res.app.get('views') + '/admin/newProperty.html');
});
admin.get('/update', function(req, res) {
  	res.sendFile(res.app.get('views') + '/admin/updatePropertyte.html');
});
admin.get('/delete', function(req, res) {
  	res.sendFile(res.app.get('views') + '/admin/delePropertyte.html');
});
admin.get('/newUser', function(req, res) {
  res.sendFile(res.app.get('views') + '/admin/newUser.html');
});
admin.get('/login', function(req, res) {
  	res.sendFile(res.app.get('views') + '/admin/login.html');
});
admin.get('/private',auth, function(req, res){

  	res.sendFile(res.app.get('views') + '/admin/private.html');

});

//Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImpvaG5kb2UifQ.OZuaG00NsY9ALMgtF-K7YN4XVYtF4mbOHMgh9SZukc4

module.exports = admin;