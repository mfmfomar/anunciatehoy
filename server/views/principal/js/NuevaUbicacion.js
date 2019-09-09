	// Validate steps wizard
	// Show form
	var form = $(".steps-validation").show();
	$(".steps-validation").steps({
	    headerTag: "h6",
	    bodyTag: "fieldset",
	    transitionEffect: "fade",
	    titleTemplate: '<span class="step">#index#</span> #title#',
	    labels: {
	        finish: 'Submit'
	    },
	    onStepChanging: function (event, currentIndex, newIndex) {
	        // Allways allow previous action even if the current form is not valid!
	        if (currentIndex > newIndex) {
	            return true;
	        }

	        // Needed in some cases if the user went back (clean up)
	        if (currentIndex < newIndex) {
	            // To remove error styles
	            form.find(".body:eq(" + newIndex + ") label.error").remove();
	            form.find(".body:eq(" + newIndex + ") .error").removeClass("error");
	        }
	        form.validate().settings.ignore = ":disabled,:hidden";
	        return form.valid();
	    },
	    onFinishing: function (event, currentIndex) {
	        form.validate().settings.ignore = ":disabled";
	        return form.valid();
	    },
	    onFinished: function (event, currentIndex) {
	    	app.nuevaUbicacion()
		}
	});
	// Initialize validation
	$(".steps-validation").validate({
	    ignore: 'input[type=hidden]', // ignore hidden fields
	    errorClass: 'danger',
	    successClass: 'success',
	    highlight: function (element, errorClass) {
	        $(element).removeClass(errorClass);
	    },
	    unhighlight: function (element, errorClass) {
	        $(element).removeClass(errorClass);
	    },
	    errorPlacement: function (error, element) {
	        error.insertAfter(element);
	    },
	    rules: {
	        email: {
	            email: true
	        }
	    }
	});
//@prepros-prepend  dropzone.imagen.js
var updateImage = new updateImage(10,updateImagecomplete);
function updateImagecomplete(){
	$('#myModalUbicacion_publicada').modal('toggle');
}
$(document).ready(function () {
	mapa = MAPA('/publico/assets/img/');
	mapa.initialize();
	mapa.SetPin();
	$("#mipos").click( function() { 
		console.log('click')
		mapa.UbicacionActual();
	});
  $('#nuevo').click(function(event) {
    $("#enviar").click()
  });
});
var api = 'api/nuevaUbicacion/';
var app = new Vue({
	el: '.vv',
	created: function() {
},
	data: {
		ubicacion: {
			nombre:"",
			tipo:"",
			costo:"",
			descripcion:"",
			ubicacion:{lat:"",lng:""},
			imgPortada:'default.jpg',
			colonia:"",
			calle:"",
			numero:"",
			propietario:"",
			galeria:null,
			tabla:null
		},
		TipoUbicacion: [
          { value: 'casa', name: 'Casa', i18n:'Casa'},
          { value: 'compartido', name: 'Casa Compartida', i18n:'Casa Compartida'},
          { value: 'departamento', name: 'Departamento', i18n:'Departamento'},
          { value: 'hostal', name: 'Hostal', i18n:'Hostal'},
          { value: 'hotel', name: 'Hotel', i18n:'Hotel'},
          { value: 'motel', name: 'Motel', i18n:'Motel'},
          { value: 'oficina', name: 'Oficina', i18n:'Oficina'},
          { value: 'terreno', name: 'Terreno', i18n:'Terreno'},
        ],
        selectedOption:''
	},
	methods: {
		setDatos:function(){
			this.ubicacion.tipo = this.selectedOption
			if(this.selectedOption === 'casa' ||this.selectedOption === 'compartido' ||this.selectedOption === 'departamento' ||this.selectedOption === 'terreno' ||this.selectedOption === 'oficina'){
				this.ubicacion.tabla = "propiedad"
			}else if(this.selectedOption === 'hostal' ||this.selectedOption === 'hotel' ||this.selectedOption === 'motel'){
				this.ubicacion.tabla = "hospedaje"
			}
			this.ubicacion.ubicacion.lat=window.tmplat
			this.ubicacion.ubicacion.lng=window.tmplng
		},
		nuevaUbicacion: function(){
				this.ubicacion.ubicacion.lat=window.tmplat
				this.ubicacion.ubicacion.lng=window.tmplng
				this.ubicacion.imgPortada = $( '.DZportada>.dz-details>.dz-filename>span' ).html()
				this.$http.post(api,this.ubicacion,  {headers: {"Authorization": localStorage.getItem('token')}}).then( function(response){
					var datos=[{name:'id',value:response.data.ubicacion._id},
						{name:'categoria',value:response.data.ubicacion.categoria},
						{name:'tipo',value:response.data.ubicacion.tipo}];					
			    	updateImage.enviar(datos)
				});
		}
	}
});

