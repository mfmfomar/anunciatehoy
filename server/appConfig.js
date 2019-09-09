'use strict'

const bodyParser = require('body-parser');
const express = require('express');
var minifyHTML = require('express-minify-html');
var morgan = require('morgan');
const multipart = require('connect-multiparty');
const pug = require('pug');

const appConfig = express();
//settings
appConfig.set('appConfigName', 'Servidor');
appConfig.set('views', __dirname + '/views');
appConfig.set('view engine', 'pug');
appConfig.use(minifyHTML({
    override: true,
    exception_url: false,
    htmlMinifier: {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeEmptyAttributes: true,
        minifyJS: true
    }
}));



//appConfig.use(morgan('dev'));
//appConfig.use('/static', express.static(__dirname + '/public'));
appConfig.use('/publico', express.static(__dirname + '/publico'));
appConfig.use(sendViewMiddleware);

appConfig.use(bodyParser.urlencoded({ extended: false }));
appConfig.use(bodyParser.json());
appConfig.use(multipart()) //Express 4

// Cargar las rutas
appConfig.use('/usuario', require('./routes/usuario'));
appConfig.use('/api', require('./routes/api'));
appConfig.use('/anuncio', require('./routes/anuncio'));
appConfig.use('/', require('./routes/raiz'));



/**
 * funcion para poder cargar las vistas
 * @param  {[type]}   req  peticion
 * @param  {[type]}   res  respuesta
 * @param  {Function} next la funcion que se ejecuta al termino de esta funcion
 * @return {[type]}        regresa el archivo cargador de una direccion estatica
 */
function sendViewMiddleware(req, res, next) {
    res.sendView = function(view) {
        return res.sendFile(__dirname + "" + view);
    }
    next();
}
module.exports = appConfig;