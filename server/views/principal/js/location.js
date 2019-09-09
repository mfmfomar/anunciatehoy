ip_api =  function(){
	var callback = null;
	return{
		get:function(funcion){
			callback = funcion;
			initialize();
		}
	}
	function initialize(){
		$.getJSON("http://ip-api.com/json/?callback=?", function(data) {
			if (typeof callback !== 'undefined' && jQuery.isFunction( callback ) ) {
	 			callback('ip_api',data);
		 	}else{
		 		console.log('no se definio el callback de ip_api');
		 	}
	    });
	}
}

// otra mas de paga 
// http://freegeoip.net/json/?callback=?
var funciones = Funciones_class;
if (funciones.getS('country') === false || funciones.getS('ubicacion') == ''){
	var ipLocation = new ip_api;
	ipLocation.get(ipResponse)
}
function ipResponse(name,data){
	var funciones = Funciones_class;
	//funciones.setS('localizacion',JSON.stringify(data));
	// funciones.setS('ip',data['query']);
	 funciones.setS('pais',data['country']);
	// funciones.setS('estado',data['region']);
	 funciones.setS('estadoNombre',data['regionName']);
	 funciones.setS('ciudad',data['city']);
	 funciones.setS('countryCode',data['countryCode']);
	 
}

