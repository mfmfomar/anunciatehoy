'Use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userModel = require('../models/Usuario')
var usuario = mongoose.model('usuario');


const propiedadSchema = Schema({
    agente: { type: Schema.ObjectId, ref: "usuario" },
    calle: String,
    categoria: { type: String, default: 'propiedad' },
    colonia: String,
    costo: { type: Number, default: 0 },
    descripcion: String,
    estado: { type: String, enum: ['disponible', 'expirado', 'pendiente', 'cancelado'], default: 'pendiente' },
    estatus: { type: String, enum: ['vendida', 'rentada', 'disponible'], default: 'disponible' },
    fecha: { type: String },
    galeria: { type: [], default: null },
    imgPortada: { type: String, default: 'default.jpg' },
    numero: String,
    propietario: { type: Schema.ObjectId, ref: "usuario" },
    tipo: { type: String, enum: ['casa', 'departamento', 'compartido', 'terreno', 'oficina'] },
    ubicacion: { lat: Number, lng: Number },
    views: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },


});

module.exports =mongoose.model('propiedad',propiedadSchema);