'Use strict'
const base = require('../controllers/_base');
const Propiedad = require('../models/Propiedad');
const Hospedaje = require('../models/Hospedaje');
const Propietario = require('../models/Usuario');
const service = require('../services')


// ubicaciones 2019
/**
 * 2019
 * guarda una propieadad creada
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
function nuevo(req, res) {
    if(req.body.tabla == 'propiedad'){
        ubicacion = new Propiedad();
        ubicacion.estatus = req.body.estatus;
    }else if(req.body.tabla == 'hospedaje'){
        ubicacion = new Hospedaje();
        ubicacion.nombre = service.valida_contenido(req.body.nombre);
    }
    ubicacion.ubicacion = req.body.ubicacion
    ubicacion.tipo = req.body.tipo;
    ubicacion.imgPortada = req.body.imgPortada;
    ubicacion.colonia = service.valida_contenido(req.body.colonia);
    ubicacion.calle = service.valida_contenido(req.body.calle);
    ubicacion.numero = service.valida_contenido(req.body.numero);
    ubicacion.descripcion = service.valida_contenido(req.body.descripcion);
    ubicacion.propietario = req.user;
    ubicacion.save(function(err, ubicacion) {
        if (err) res.status(500).send({ mensaje: `Error al guardar la ubicacion ${err}` });

        //creamos su carpeta
        ubicacion.tabla = req.body.tabla
        let carpetaPrincipal = 'server/publico/assets/img/ubicaciones/' + ubicacion.tipo + '/' + ubicacion._id;
        let carpetaGaleria = 'server/publico/assets/img/ubicaciones/' + ubicacion.tipo + '/' + ubicacion._id + '/galeria';
        let fs = require('fs');
        fs.mkdirSync(carpetaPrincipal);
        fs.mkdirSync(carpetaGaleria);
        var io = req.app.get('socketio'); 
        io.emit('nuevaUbicacion',ubicacion);
        res.status(200).send({ ubicacion});
        //res.status(200).send({ mensaje: 'newProperty',  ubicacion });
    
    });
}
function nuevaUbicacion_photos(req, res){
    if (req.body.categoria =='propiedad' || req.body.categoria[0] =='propiedad'){
        Propiedad.find({ _id: req.body.id, propietario: req.user }, function(err, anuncio) {
        if (err) return res.status(500).send({ mensaje: "Error al realizar la peticion" });
        if (!anuncio) return res.status(404).send({ mensaje: "El Anuncio no existe" });
            if(req.files.fileImage.length>1){
                base.updatePhoto(req, res, 'ubicaciones/'+req.body.tipo[0]+'/'+ req.body.id[0],req.body.portadaName[0])
            }else{
                base.updatePhoto(req, res, 'ubicaciones/'+req.body.tipo+'/'+ req.body.id,req.body.portadaName)
            }
        });
    }else if(req.body.categoria =='hospedaje' || req.body.categoria[0] =='hospedaje'){
        Hospedaje.find({ _id: req.body.id, propietario: req.user }, function(err, anuncio) {
        if (err) return res.status(500).send({ mensaje: "Error al realizar la peticion" });
        if (!anuncio) return res.status(404).send({ mensaje: "El Anuncio no existe" });
            if(req.files.fileImage.length>1){
                base.updatePhoto(req, res, 'ubicaciones/'+req.body.tipo[0]+'/'+ req.body.id[0],req.body.portadaName[0])
            }else{
                base.updatePhoto(req, res, 'ubicaciones/'+req.body.tipo+'/'+ req.body.id,req.body.portadaName)
            }
        });
    }
}
function getUbicacionesUser(req, res){
    Propiedad.find({ 'propietario': req.user }, function(err, propiedad) {
        //if (err) return res.status(500).send({ mensaje: "Error al realizar la peticion" });
        // if (Object.keys(propiedad).length === 0) return res.status(200).send({ mensaje: "No Exite Ninguna Propiedad", code: 1 });
        //res.status(200).send({ propiedad, code: 0 });
        Hospedaje.find({ 'propietario': req.user }, function(err, hospedaje) {
            //if (err) return res.status(500).send({ mensaje: "Error al realizar la peticion" });
            //if (Object.keys(hospedaje).length === 0) return res.status(200).send({ mensaje: "No Exite Ninguna Hospedaje", code: 1 });
            //ubicaciones = propiedad.concat(hospedaje)
            res.status(200).send({ propiedad,hospedaje });
        })
    })
}
function updateUbicacion(req, res) {
    var update = req.body;
        update.nombre = service.valida_contenido(update.nombre)
        update.colonia = service.valida_contenido(update.colonia)
        update.calle = service.valida_contenido(update.calle)
        update.numero = service.valida_contenido(update.numero)
        update.descripcion = service.valida_contenido(update.descripcion)
    if(update.categoria=='propiedad'){
        Propiedad.findByIdAndUpdate(update._id, update, function(err, propiedad) {
            if (err) return res.status(500).send({ mensaje: "Error al Actualizar la Propiedad" });
            if (!propiedad) return res.status(404).send({ mensaje: "La propiedad no existe" });
            //propiedad.disponibilidad = update.disponibilidad;
            res.status(200).send({ mensaje: 'Propiedad actualizada', propiedad });
        })
    }else if(update.categoria=='hospedaje'){
        Hospedaje.findByIdAndUpdate(update._id, update, function(err, propiedad) {
            if (err) return res.status(500).send({ mensaje: "Error al Actualizar la Propiedad" });
            if (!propiedad) return res.status(404).send({ mensaje: "La propiedad no existe" });
            propiedad.disponibilidad = update.disponibilidad;
            res.status(200).send({ mensaje: 'Propiedad actualizada', propiedad });
        })
    }
}
function deleteUbicacion(req, res) {
    for(x=0; x < req.body.length; x++){
        let tmp = req.body[x].split('@')
        if(tmp[1]=='propiedad'){
            Propiedad.findById(tmp[0], function(err, propiedad) {
                if (err) return res.status(500).send({ mensaje: "Error al realizar la peticion" });
                if (!propiedad) return res.status(404).send({ mensaje: "La propiedad no existe" });
                propiedad.remove(function(err) {
                    if (err) return res.status(500).send({ mensaje: "Error al Borrar el producto" });
                    let carpetaRoot = 'server/publico/assets/img/ubicaciones/' + propiedad.tipo + '/' + propiedad._id;
                    var rimraf = require('rimraf');
                    rimraf(carpetaRoot, function() {});
                });
            });
        }else if(tmp[1]=='hospedaje'){
            Hospedaje.findById(tmp[0], function(err, propiedad) {
                if (err) return res.status(500).send({ mensaje: "Error al realizar la peticion" });
                if (!propiedad) return res.status(404).send({ mensaje: "La propiedad no existe" });
                propiedad.remove(function(err) {
                    let carpetaRoot = 'server/publico/assets/img/ubicaciones' + propiedad.tipo + '/' + propiedad._id;
                    var rimraf = require('rimraf');
                    rimraf(carpetaRoot, function() {});
                    if (err) return res.status(500).send({ mensaje: "Error al Borrar el producto" });
                });
            });
        }
    }
    res.status(200).send({ mensaje: "deleteProperty"});
}

/**
 * obtiene una propiedad apartir de un id
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
function getUbicacion(req, res) {
    let propiedadId = req.params.id
    if(req.params.tabla=="propiedad"){
        Propiedad.findById(propiedadId, function(err, propiedad) {
            if (err) return res.status(500).send({ mensaje: "Error al realizar la peticion" });
            if (!propiedad) return res.status(404).send({ mensaje: "La propiedad no existe" });
            let carpetaGaleria = 'server/publico/assets/img/ubicaciones/' + propiedad.tipo + '/' + propiedad._id + '/galeria';
            propiedad.galeria = base.getFilesList(carpetaGaleria,req, res, propiedad, getUbicacionResponse);
        });
    }else if(req.params.tabla=="hospedaje"){
        Hospedaje.findById(propiedadId, function(err, propiedad) {
        if (err) return res.status(500).send({ mensaje: "Error al realizar la peticion" });
        if (!propiedad) return res.status(404).send({ mensaje: "La propiedad no existe" });
        let carpetaGaleria = 'server/publico/assets/img/ubicaciones/' + propiedad.tipo + '/' + propiedad._id + '/galeria';
        propiedad.galeria = base.getFilesList(carpetaGaleria,req, res, propiedad, getUbicacionResponse);
    });
    }
}
/**
 * adiere la informacion del propietario a una propiedad
 * @param  {[type]} res       [description]
 * @param  {[type]} propiedad [description]
 * @param  {[type]} list      [description]
 * @return {[type]}           [description]
 */
function getUbicacionResponse(req, res, propiedad, list) {
    console.log(getUbicacionResponse)

    tabla = req.params.tabla
    propiedad.galeria = list;
    if (propiedad.tipo == 'hotel' || propiedad.tipo == 'motel'|| propiedad.tipo == 'hostal') return res.status(200).send({ propiedad,tabla });
    Propietario.findById(propiedad.propietario, function(err, propietario) {
        let usuario = {};
        if (!propietario) {
            console.log(`---> Eliminar la propiedad ${propiedad._id} , no cuenta con un propietario asignado...`);
            return res.status(200).send({ mensaje: "No hay registro del propietario", propiedad });
        }else{
            usuario.nombre = propietario.nombre;
            usuario.apellido = propietario.apellido;
            usuario.telefono = propietario.telefono;
            usuario.correo = propietario.email;
            return res.status(200).send({ propiedad, usuario,tabla});
        }
    });
}


//-- old 


/**
 * --old
 * regresa 5 propiedad al azar que sean visibles
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
function getRandom(req, res) {
    // no me deja pasar el parametro y ocupo ponerlo fijo
    let x = req.params.cantidad;
    Propiedad.aggregate([
        { $match: { visible: true } }, // filter the results
        { $sample: { size: 4 } } // You want to get 5 docs
    ], function(err, propiedades) {
        console.log(getRandom)
        console.log('   getRandom'+propiedades)
        res.status(200).send({ propiedades });
    });
}
/**
 * [borra una foto en especifico deuna direccion dada (req.params.cadena)]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
function deletePhoto(req, res) {base.deletePhoto(req, res);}

/**
 * sube una foto al servidor, 
 * dependiente del tipo de foto [portada o interior]
 * es donde se guardara la foto
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
function updatePhoto(req, res) {base.updatePhoto(req, res);}

// function misUbicaciones(req, res) {
//     //console.log('apiPropiedades > misPropiedades > usuario tipo ='+req.tipo);
//     switch (req.tipo) {
//         case "admin":
//             console.log('case admin')
//             Propiedad.find({}, function(err, propiedad) {
//                 if (err) return res.status(500).send({ mensaje: "Error al realizar la peticion" });
//                 if (Object.keys(propiedad).length === 0) return res.status(404).send({ mensaje: "No Exite Ninguna Propiedad" });
//                 res.status(200).send({ propiedad });
//             })
//             break;
//         default:

//             Propiedad.find({ 'propietario': req.user }, function(err, propiedad) {
//                 //if (err) return res.status(500).send({ mensaje: "Error al realizar la peticion" });
//                 // if (Object.keys(propiedad).length === 0) return res.status(200).send({ mensaje: "No Exite Ninguna Propiedad", code: 1 });
//                 //res.status(200).send({ propiedad, code: 0 });
                
//                 Hospedaje.find({ 'propietario': req.user }, function(err, hospedaje) {
//                     //if (err) return res.status(500).send({ mensaje: "Error al realizar la peticion" });
//                     //if (Object.keys(hospedaje).length === 0) return res.status(200).send({ mensaje: "No Exite Ninguna Hospedaje", code: 1 });
//                     res.status(200).send({ propiedad,hospedaje });
                     
//                 })
//             })
//             //res.status(200).send({ arrayPropiedad,arrayHospedaje });
//     }
// }
function misUbicacionesCallback(req, res){
    console.log('misUbicacionesCount')
    console.log(misUbicacionesCount)
    if(misUbicacionesCount==2){
         res.status(200).send({ arrayPropiedad,arrayHospedaje });   
    }
}
/**
 * regresa un tipo de ubicacion en especifico o 
 * regresa todas las propiedades.
 * Utilizados en la parte principal
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
function getUbicaciones(req, res) {
    if(req.query)req.body =req.query
    switch(req.body.clave) {
        case "casa": case"compartido": case"departamento": case"terreno":case"oficina":
            Propiedad.find({ 'tipo': req.body.clave }, function(err, propiedad) {
                if (err) return res.status(500).send({ mensaje: "Error al realizar la peticion" });
                //if(Object.keys(propiedad).length==0) return res.status(200).send([Propiedad: null])
                res.status(200).send({ 'ubicacion':propiedad, 'tipo':req.body.clave});
            })
        break;
        case "hostal": case"hotel": case"motel":
            Hospedaje.find({ 'tipo': req.body.clave }, function(err, hospedaje) {
                if (err) return res.status(500).send({ mensaje: "Error al realizar la peticion" });
                //if(Object.keys(hospedaje).length==0) return res.status(200).send([hospedaje: null]);
                res.status(200).send({ 'ubicacion':hospedaje, 'tipo':req.body.clave });
            })
        break;
        default:
        break; 
    }
}








function viewUbicacion(req, res) {
    console.log('viewPropiedad'+req.body)
    propiedadId = req.body.id
    update = { $inc: { views: 1 } }
    Propiedad.findByIdAndUpdate(propiedadId, update, function(err, propiedad) {
        if (err) return res.status(500).send({ mensaje: "Error al Actualizar la Propiedad" });
        if (!propiedad) return res.status(404).send({ mensaje: "La propiedad no existe" });
        res.status(200).send({ mensaje: 'Propiedad +1' });
    })
}
module.exports = {
    nuevo,//2019
    nuevaUbicacion_photos,//2019
    getUbicacionesUser,//2019
    updateUbicacion,//2019
    deleteUbicacion,//2019
    getUbicacion,//2019
    getUbicaciones,
    //misUbicaciones,
    updatePhoto,
    deletePhoto,
    viewUbicacion,
    getRandom
};