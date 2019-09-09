'Use strict'


const Anuncio = require('../models/Anuncio');
const Propiedad = require('../models/Propiedad');
const Hospedaje = require('../models/Hospedaje');

// 2019
function updatePhoto(req, res, carpetaDestino, portada){
    let fs = require('fs')
    for (let key in req.files.fileImage) {
        let archivo = req.files.fileImage[key]
        let path = archivo.path

        var ext = '.' + archivo.type.split('/')[1]

        if(archivo.name == portada){
            var newPath = 'server/publico/assets/img/' + carpetaDestino  +'/'+ archivo.name;
        }else{
            var newPath = 'server/publico/assets/img/' + carpetaDestino  +'/galeria/'+ archivo.name;            
        }
        let is = fs.createReadStream(path)
        let os = fs.createWriteStream(newPath)
        is.pipe(os)
        is.on('end', function() {
            //eliminamos el archivo temporal
            fs.unlinkSync(path)
        })
        
    }
    res.status(200).send({});

}

/// ubicaciones -old

/**obtiene toso los arhicos de un directorio
 * @param  {direccion de la carpeta}
 * @param  {funcion callback}
 * @param  {propiedad que se esta buscando archivos}
 * @param  {Function}
 * @return {[listado de los archivos de la ruta especifica]}
 */
function getFilesList(carpetaPath,req, res, propiedad, callback) {
    var fs = require('fs');
    var path = require('path');
    var dir = carpetaPath;
    fs.readdir(dir, (err, files) => {
        try {
            if (files.length > 0) {
                var r = [];
                files.forEach((file) => {
                    s(file);
                    function s(file) {
                        fs.stat(dir + '/' + file, (err, stat) => {
                            if (err) { console.error(err); return; }
                            if (stat.isDirectory()) r.push({ f: file, type: 'dir' });
                            else if (stat.isFile()) r.push({ f: file, type: 'file' });
                            else r.push(0);
                            if (r.length == files.length) {
                                r.filter((m) => { return m; });
                                callback(req,res, propiedad, r);
                            }
                        });
                    }
                });
            } else {
                callback(req,res, propiedad, null);
            }
        } catch (err) {
            console.log('error -> catch -> getFilesList')
            callback(req,res, propiedad, null);
        }
    });
}
/**
 * [borra una foto en especifico deuna direccion dada (req.params.cadena)]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
function deletePhoto(req, res) {
    let cadena = req.params.cadena
    cadena = cadena.split("&");
    let filePath = 'server/publico/img/' + cadena[0] + '/' + cadena[1] + '/galeria/' + cadena[2];
    var fs = require('fs');
    fs.unlinkSync(filePath);
    res.status(200).send({ mensaje: "Imagen borrada" });
}

module.exports = {
    getFilesList,
    deletePhoto,
    updatePhoto
};