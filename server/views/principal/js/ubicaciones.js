function link(datos){
	app.link(datos)
}

$(document).ready(function(){
	$("#ubicacionesMapa").on('hidden.bs.modal', function () {
		lugar.mapa.limpiarMapa()
        var str = localStorage.getItem("filtroUbicaciones");
		eval("var json = " + str + ";"); 			
		for (var clave in json){
			if(json[clave][2]==true) lugar.mapa.setData(json[clave][3]);	
		}
	});
});

$.get('publico/assets/templates/_Detalles.html', function (data) {cascaronDetalles=data}, 'html');
var app = new Vue({
  el: '#ubicacionesMapa',
  created: function() {
	//lugar.mapa;
	// lugar.mapa = new MAPA("publico/assets/img/","mapa");
	lugar.mapa = new MAPA("publico/assets/img/");
	lugar.mapa.initialize();

  	//eventos
		$('.geo-location').click(function(event) {
			lugar.mapa.UbicacionActual();
		});
	//funcion sockets
		var socket = io.connect(location.host, { 'forceNew': true });
		socket.on('nuevaUbicacion', function(data) {
			UpdateMarker('newProperty',data);
		});
		socket.on('upDateUbicacion', function(data) {
			UpdateMarker('upDateUbicacion',data);
		});
		socket.on('deleteProperty', function(data) {
			UpdateMarker('deleteProperty',data);
		});
		function UpdateMarker(on,data){
			var str = localStorage.getItem("filtroUbicaciones");
			eval("var json = " + str + ";");
			if(on=="newProperty" && json[data.tipo][2]) lugar.mapa.addMarker(data);
			if(on=="upDateUbicacion" && json[data.tipo][2]) lugar.mapa.update(data);
			if(on=="deleteProperty" && json[data.tipo][2]) lugar.mapa.delete(data._id);				
		}

	this.init()
  },
  data: {
    filtroUbicaciones:{
    	casa:['Casa','casa.png',true,'casa'],
    	compartido:['compartido','compartido.png',true,'compartido'],
    	departamento:['Departamento','departamento.png',true,'departamento'],
    	hostal:['Hostal','hostal.png',true,'hostal'],
    	hotel:['Hotel','hotel.png',true,'hotel'],
    	motel:['Motel','motel.png',true,'motel'],
    	oficina:['Oficina','oficina.png',true,'oficina'],
    	terreno:['Terreno','terreno.png',true,'terreno']
    }
  }, 
  methods: {
    init: function() {
		if (localStorage.getItem("filtroUbicaciones") == undefined || localStorage.getItem("filtroUbicaciones") =="" ){
			var json = JSON.stringify(this.filtroUbicaciones)
			localStorage.setItem("filtroUbicaciones", json);
		}else{
			this.filtroUbicaciones = JSON.parse(localStorage.getItem("filtroUbicaciones"))
		}
		$('#dropdownubicacionesMapa').css("display","contents") 
		this.loadUbicaciones()
    },
    guardar: function(item) {
    	var json = JSON.stringify(this.filtroUbicaciones)
		localStorage.setItem("filtroUbicaciones", json);
    },
    loadUbicaciones: function (){

		//ver la lista que se va a cargar
		var str = localStorage.getItem("filtroUbicaciones");
		eval("var json = " + str + ";"); 			
		// Obteniendo todas las claves del JSON
		for (var clave in json){
			if(json[clave][2]==true || true){
				var path = lugar.server+"api/ubicaciones";
				var tipo = json[clave][3];
				$.ajax({
					url: path,
					method: "GET",
					data: { clave: tipo }
				}).done(function(data) {
					if(data.ubicacion != null) app.loaded(data.ubicacion,data.tipo)
				});
			}
		}
	},
	loaded: function(data,tipo){
	    data.propiedad = data;
		lugar.mapa.addMarkers(data,tipo);
		var str = localStorage.getItem("filtroUbicaciones");
		eval("var json = " + str + ";");
		if(json[tipo][2]) lugar.mapa.setData(tipo);	
	},
	link: function (datos){
		url = "api/ubicacion/"+datos;
		$.get(url, function (data) {
			if(data.usuario){
				data.propiedad["nombreUsusario"]=data.usuario['nombre']+' '+data.usuario['apellido'];
				data.propiedad["telefono"]=data.usuario['telefono'];
				data.propiedad["correo"]=data.usuario['correo'];
				data.propiedad["nombre"]='';
			}
			data.propiedad["carrusel"] = makeGaleria(data.propiedad);
			html=joinData(data.propiedad,cascaronDetalles);
			$(".principal").fadeOut(500);
			$(".detalles").fadeIn(500);
			$('.detalles').html(html);
			carrusel();
			var owl = $(".owl-carousel");
			owl.trigger('owl.play',3000);
			if(!data.usuario) $('#property-usuer').empty();
			});
			
	        setTimeout(function(){ 
		        i18next.changeLanguage(localStorage.getItem('i18next'), function (err, t) {
		          $("body").localize();
		        });
	         }, 500);


	}
  }
});

function makeGaleria (propiedad){
	console.log(propiedad)
	var htmlGaleria='';
	var imgUrl=propiedad.tipo+'/'+propiedad._id+'/galeria/';
	try{
		propiedad.galeria.forEach(function(foto) {
			htmlGaleria +='<div class="property-slide">\
                <a >\
                    <div class="overlay"><h3>'+foto.f+'</h3></div>\
                    <img alt="No encontrada" src="publico/assets/img/ubicaciones/'+imgUrl+foto.f+'">\
                </a>\
            </div>';
		})
		return htmlGaleria;
	}catch(err){}
}
function regresar(){
	var owl = $(".owl-carousel");
	owl.trigger('owl.stop');
	//owl.trigger('owl.play',3000);
	//owl.trigger('owl.next');
	//owl.trigger('owl.prev');
	$(".principal").show();
	$(".detalles").fadeOut("slow");
}
function joinData(data,estructura){
	try {
	   for (var dato in data){ 
			var re = new RegExp("{"+dato+"}", 'g');
			estructura = estructura.replace(re, data[dato]);
		}
		return estructura;
	}
	catch(err) {
	    console.log(err.message);
	}
}
function carrusel(){
	//  Owl Carousel
    // Disable click when dragging
    function disableClick(){
        $('.owl-carousel .property').css('pointer-events', 'none');
    }
    // Enable click after dragging
    function enableClick(){
        $('.owl-carousel .property').css('pointer-events', 'auto');
    }

    if ($('.owl-carousel').length > 0) {
        if ($('.carousel-full-width').length > 0) {
            setCarouselWidth();
        }
        $(".featured-properties-carousel").owlCarousel({
            items: 10,
            itemsDesktop: [1700,4],
            responsiveBaseWidth: ".featured-properties-carousel",
            pagination: false,
            startDragging: disableClick,
            beforeMove: enableClick
        });
        $(".testimonials-carousel").owlCarousel({
            items: 1,
            responsiveBaseWidth: ".testimonial",
            pagination: true
        });
        $(".property-carousel").owlCarousel({
            items: 1,
            responsiveBaseWidth: ".property-slide",
            pagination: false,
            autoHeight : true,
            navigation: true,
            navigationText: ["",""],
            startDragging: disableClick,
            beforeMove: enableClick
        });
        $(".homepage-slider").owlCarousel({
            autoPlay: 5000,
            navigation: true,
            mouseDrag: false,
            items: 1,
            responsiveBaseWidth: ".slide",
            pagination: false,
            transitionStyle : 'fade',
            navigationText: ["",""],
            afterInit: sliderLoaded,
            afterAction: animateDescription,
            startDragging: animateDescription
        });
    }
    function sliderLoaded(){
        $('#slider').removeClass('loading');
        document.getElementById("loading-icon").remove();
    }
    function animateDescription(){
        var $description = $(".slide .overlay .info");
        $description.addClass('animate-description-out');
        $description.removeClass('animate-description-in');
        setTimeout(function() {
            $description.addClass('animate-description-in');
        }, 200);
    }
}
