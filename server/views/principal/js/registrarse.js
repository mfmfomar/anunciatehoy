$(document).ready(function() {
	$("#form-create-account").submit(function(e){
	    app.registrar();
	    return false;
	});
	$("#modalSuccess").click(function(e){
	    window.location.href = window.location.origin;
	});

});
var api = 'api/signup';
var app =new Vue({
	el: '.content-body',
	created: function() {
	},
	data: {
		user: {

		},
		mensaje:""
	},
	methods: {
		registrar: function() {
			var form = $("#form-create-account");
			if (form[0].checkValidity() === false ) {
				event.preventDefault();
				event.stopPropagation();
				alert("Las Contraseñas no coinciden")
			}else{
				var funciones = Funciones_class;
				this.user.pais = funciones.getS('pais')
				this.user.estado = funciones.getS('estadoNombre')
				this.user.ciudad = funciones.getS('ciudad')
				this.user.countryCode = funciones.getS('countryCode')
				localStorage.removeItem('pais');
				localStorage.removeItem('estadoNombre');
				localStorage.removeItem('ciudad');
				localStorage.removeItem('countryCode');

				this.$http.post(api,this.user).then( function(response){
					//alert(response.body.message); 
					form.addClass('was-validated');
	        		$('#myModalAlert_cuenta').modal('toggle');
					if(response.data.token){
						localStorage.setItem('token', response.data.token)
					}
				},
				function(err){
				 	this.message = err.body.message;
				 	switch (err.body.code) {
					  case 0:
							$('#myModalAlert_err').modal('toggle');
					    break;
					  case 1:
							this.user.email=""
							$('#myModalAlert_errMensaje').modal('toggle');
					    break;
					  default:
							console.log(err)
					}				
				})
				.catch(function(e) {
					console.log("Caught", e);
				});
				
			}
			
			
		}
	}
});