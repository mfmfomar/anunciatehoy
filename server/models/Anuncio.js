'Use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const userModel = require('../models/Usuario')
var usuario = mongoose.model('usuario');


const anuncioSchema = Schema({
    titulo : { type: String },
    descripcion : { type: String },
    categoria : { type: String },
    precio : { type: Number },
    propietario: { type: Schema.ObjectId, ref: "usuario" },
    estado: { type: String, enum: [  'disponible', 'expirado', 'pendiente','cancelado'],default: 'pendiente' },
    views: { type: Number, default: 0 },
    imgPortada: { type: String,default: 'default.jpg' },
    fecha:{ type: String }
});

module.exports =mongoose.model('anuncio',anuncioSchema);