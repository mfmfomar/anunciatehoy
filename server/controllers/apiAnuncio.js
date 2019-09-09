'use strict'

const Anuncio = require('../models/Anuncio');
const base = require('../controllers/_base');
const service = require('../services')


function nuevo(req, res) {

    let data = new Anuncio();
    console.log(req.body)
    data.titulo = service.valida_contenido(req.body.titulo);
    data.descripcion = service.valida_contenido(req.body.descripcion);
    data.categoria = service.valida_contenido(req.body.categoria);
    data.precio = service.valida_contenido(req.body.precio);
    data.ubicacion = service.valida_contenido(req.body.ubicacion);
    data.imgPortada = service.valida_contenido(req.body.imgPortada);
    data.propietario = req.user;
    data.fecha = new Date();
    data.save(function(err, anuncio) {
        if (err) res.status(500).send({ mensaje: `Error al guardar la anuncio ${err}` });
        //creamos su carpeta
        let carpetaPrincipal = 'server/publico/assets/img/anuncios/' + anuncio._id;
        let carpetaGaleria = 'server/publico/assets/img/anuncios/' + anuncio._id + '/galeria';
        let fs = require('fs');
        fs.mkdirSync(carpetaPrincipal);
        fs.mkdirSync(carpetaGaleria);
        res.status(200).send({ codigo: anuncio._id });
    });
}
function updatePhoto(req, res){

    Anuncio.find({ _id: req.body.id, propietario: req.user }, function(err, anuncio) {
    if (err) return res.status(500).send({ mensaje: "Error al realizar la peticion" });
    if (!anuncio) return res.status(404).send({ mensaje: "El Anuncio no existe" });
        if(req.files.fileImage.length>1){
            base.updatePhoto(req, res, 'anuncios/'+ req.body.id[0],req.body.portadaName[0])
        }else{
            base.updatePhoto(req, res, 'anuncios/'+ req.body.id,req.body.portadaName)
        }
    });
}    
function updatePhotoCallback(req, res){
    res.status(200).send(true);
}
function getAnunciosUser(req, res){
    Anuncio.find({ 'propietario': req.user }, function(err, anuncios) {
        res.status(200).send({ anuncios });
    })
}
function deleteAnunciosUser(req, res){
    for (var i=0;i<req.body.length;i++){
        Anuncio.find({ _id: req.body[i], propietario: req.user }, function(err, anuncio) {
            if (err) return res.status(500).send({ mensaje: "Error al realizar la peticion" });
            if (!anuncio) return res.status(404).send({ mensaje: "El Anuncio no existe" });
            anuncio.remove(function(err) {
                let carpetaRoot = 'server/publico/assets/img/anuncios/' + anuncio._id;
                var rimraf = require('rimraf');
                rimraf(carpetaRoot, function() {});
                if (err) return res.status(500).send({ mensaje: "Error al Borrar el anuncio" });
            });
        });
    }
    res.status(200).send();
}
function getAnuncios(req, res) {
    Anuncio.find({ }, function(err, anuncios) {
        anuncios = anuncios.reverse()
        res.status(200).send({ anuncios });
    })
}


module.exports = {
    nuevo,
    updatePhoto,
    getAnunciosUser,
    deleteAnunciosUser,
    getAnuncios
    
}