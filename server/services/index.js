'use strict'

const jwt = require('jwt-simple')
const moment = require('moment')
const config = require('../config')

    //exp: moment().add(1, 'S').unix()
    // https://flaviocopes.com/momentjs/
function createToken (user) {
  const payload = {
    sub: user._id,
    tipo: user.tipo,
    iat: moment().unix(),
    exp: moment().add(1, 'days').unix()
  }
  return jwt.encode(payload, config.SECRET_TOKEN)
}

function decodeToken (token) {
	const decoded = new Promise((resolve, reject) => {
    try {
      const payload = jwt.decode(token, config.SECRET_TOKEN)
      if (payload.exp <= moment().unix()) {
        resolve({
          status: 401,
          message: 'El token ha expirado'
        })
      }
      resolve(payload)
    } catch (err) {
      reject({
        status: 500,
        message: 'Invalid Token'
      })
    }
  })

  return decoded
}

function valida_contenido(cadena) {
  try{
    cadena = cadena.replace(/[*+?^$()|[\]\\<>/]/g, '');
  }catch{}
  return cadena;

}

module.exports = {
  createToken,
  decodeToken,
  valida_contenido
}