'use strict'
const Propiedad = require('../models/Propiedad');
const Hospedaje = require('../models/Hospedaje');
const Path = require('../config');

//anuncios 2019
//function indexUser(req,res){res.render('usuario/index', { title: 'Menu de Usuario'}, function(err, html) {res.send(html);})}
function indexUser(req, res) { res.render('principal/perfil', { title: 'Mi Perfil',seccion: 'perfil' }); }
function perfil(req, res) { res.render('principal/perfil', { title: 'Mi Perfil',seccion: 'perfil' }); }
function anuncios(req, res) { res.render('principal/misAnuncios', { title: 'Mis Anuncios',seccion: 'anuncios' }); }



// ubicaciones 2019
function ubicacion(req, res) { DatosPropiedad(req, res, 'usuario/Ubicacion', 'Ubicacion');}
function imagen(req, res) { DatosPropiedad(req, res, 'usuario/ubicacionPortada', 'Portada de la Ubicacion');}
function imagenes(req, res) {DatosPropiedad(req, res, 'usuario/ubicacionImagenes', 'Imagenes de la propiedad');}
function ubicaciones(req, res) { res.render('principal/misUbicaciones', { title: 'Mis ubicaciones',seccion: 'misUbicaciones' }); }
function nuevaUbicacion(req, res) { res.render('usuario/nuevaUbicacion', { title: 'Nueva Ubicacion',Path:Path }); }

function DatosPropiedad(req, res, callback, titulo) {
    if(req.params.tabla == 'propiedad'){
        Propiedad.findById(req.params.id, function(err, propiedad) {
                if (err) return res.status(500).send({ mensaje: "Error al realizar la peticion" });
                if (!propiedad) return res.status(404).send({ mensaje: "No Exite Ninguna Propiedad" });
                ubicacion = {}
                ubicacion.id = propiedad.id
                ubicacion.tipo = propiedad.tipo
                ubicacion.nombre = propiedad.nombre
                ubicacion.tabla = 'propiedad'
                res.render(callback, { title: titulo, ubicacion,Path:Path });
            })
    }else if(req.params.tabla = 'hospedaje'){
        Hospedaje.findById(req.params.id, function(err, propiedad) {
                if (err) return res.status(500).send({ mensaje: "Error al realizar la peticion" });
                if (!propiedad) return res.status(404).send({ mensaje: "No Exite Ninguna Propiedad [Hospedaje]" });
                ubicacion = {}
                ubicacion.id = propiedad.id
                ubicacion.tipo = propiedad.tipo
                ubicacion.nombre = propiedad.nombre
                ubicacion.tabla = 'hospedaje'
                res.render(callback, { title: titulo, ubicacion,Path:Path });
            })
    }
    
}


module.exports = {
    indexUser,
    ubicacion,
    nuevaUbicacion,
    imagen,
    imagenes,
    perfil,
    anuncios,
    ubicaciones

}