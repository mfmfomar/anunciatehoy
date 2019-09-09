// https://code.tutsplus.com/es/tutorials/build-a-complete-mvc-website-with-expressjs--net-34168
// var config = {
//     local: {
//         mode: 'local',
//         port: 3000
//     },
//     staging: {
//         mode: 'staging',
//         port: 4000
//     },
//     production: {
//         mode: 'production',
//         port: 5000
//     }
// }
// module.exports = function(mode) {
//     return config[mode || process.argv[2] || 'local'] || config.local;
// }

module.exports={
	port: process.env.PORT || 3000,
	db: process.env.MONGODB || 'mongodb://localhost:27017/anunciosDb',
	correo:'anunciatehoy.soporte@gmail.com',
	password: 'anunciate880208',
	SECRET_TOKEN:"anunciatehoy",
	BASE: "http://localhost:3000/",
	IMG:"http://localhost:3000/publico/img/",
	API:"http://localhost:3000/api/",
	UI:"http://localhost:3000/publico/ui/",
	CSS:"http://localhost:3000/publico/css/",
	JS:"http://localhost:3000/publico/js/",
};