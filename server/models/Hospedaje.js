'Use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userModel = require('../models/Usuario')
var usuario = mongoose.model('usuario');


const hospedajeSchema = Schema({
    agente: { type: Schema.ObjectId, ref: "usuario" },
    calle: String,
    categoria: { type: String, default: 'hospedaje' },
    colonia: String,
    costo: { type: Number, default: 0 },
    descripcion: String,
    disponibilidad: { type: Boolean, default: false },
    estado: { type: String, enum: [  'disponible', 'expirado', 'pendiente','cancelado'],default: 'pendiente' },
    fecha:{ type: String },
    galeria: { type: [], default: null },
    imgPortada: { type: String, default: 'default.jpg' },
    nombre: String,
    numero: String,
    propietario: { type: Schema.ObjectId, ref: "usuario" },
    tipo: { type: String, enum: [  'hotel', 'motel', 'hostal'] },
    ubicacion: { lat: Number, lng: Number },
    views: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },

});

module.exports =mongoose.model('hospedaje',hospedajeSchema);