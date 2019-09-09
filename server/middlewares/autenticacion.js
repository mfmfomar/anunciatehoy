'use strict'

const services = require('../services')

function isAuth (req, res, next) {
  if (!req.headers.authorization) {
    //return res.render('login', { title: 'Login'});
    return res.status(403).send({ message: 'No tienes autorización' })
    //res.redirect('../../login');
  }

  const token = req.headers.authorization.split(' ')[1]

  services.decodeToken(token)
    .then(response => {
      req.user = response.sub
      req.tipo = response.tipo
      //si esta activado
      next()
    })
    .catch(response => {
      return res.status(response.status).send(response.message)
      //res.redirect('../../login');  
    })
}

module.exports = isAuth