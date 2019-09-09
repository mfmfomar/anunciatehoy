'Use strict'
const nodeMailer = require('nodemailer');
const pug = require('pug');
const config = require('../config');

//https://appdividend.com/2017/08/11/send-email-in-node-js/

  var transporter = nodeMailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
          user: config.correo,
          pass: config.password
      }
  });
  /*
  let mailOptions = {
      from: '"Krunal Lathiya" <xx@gmail.com>', // sender address
      to: req.body.to, // list of receivers
      subject: req.body.subject, // Subject line
      text: req.body.body, // plain text body
      html: '<b>NodeJS Email Tutorial</b>' // html body
  };
  */

      
function enviar(req, res,correoTipo,usuario){
        var mailOptions;
        switch (correoTipo) {
          case 'registro':
              mailOptions = {
                from: '"www.AnunciateHoy.com" <AnunciateHoy.soporte@gmail.com>', // sender address
                to: usuario.email, // list of receivers
                subject: 'Activacion de Cuenta ✔', // Subject line
                name: usuario.nombre,
                link: usuario._id+"~"+usuario.email
              };
          		const compiledFunction = pug.compileFile('server/publico/correo/activarCuenta.pug');
          		let link = 'http://localhost:3000/activar/'+mailOptions.link
      			  mailOptions.html = compiledFunction({name: 'Bienvenido '+mailOptions.name, link:link});
          break;
          default:
			
        }
        transporter.sendMail(mailOptions, (error, info) => {
	          if (error) {
	          	console.log('Error al enviar correo')
	            console.log(error);
	          }else{
	          	/*
					console.log('Message sent: %s', info.messageId);
					// Preview only available when sending through an Ethereal account
					console.log('Preview URL: %s', nodeMailer.getTestMessageUrl(info));
					console.log('Correo Enviado');
	          	*/
	          }
	    	});
}

module.exports = {
	enviar
}