'Use strict'
const express = require('express');
const anuncioModel = require('../models/Anuncio');
const anuncio = express.Router();


//? se usa ??
anuncio.get('/:id', function(req, res) {
	anuncioModel.find({'_id': req.params.id }, function(err, anuncios) {
		anuncios = anuncios.reverse()
		res.status(200).send({ anuncios });
	})});
anuncio.get('*', function(req, res) {
	res.render('error404', { title: 'Error', seccion: '' });
});

module.exports = anuncio;
