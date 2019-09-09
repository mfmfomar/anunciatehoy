$(document).ready(function() {
	$("#formLogin").submit(function(e){
	    app.login();
	    return false;
	});
});
var api = '/api/signin';
var app = new Vue({
	el: '#formLogin',
	created: function() {
	},
	data: {
		user: {
			email:"",
			password:""
		}
	},
	methods: {
		login: function() {
			var form = $("#formLogin");
			if (form[0].checkValidity() === false) {
				event.preventDefault();
				event.stopPropagation();
			}else{
				console.log('login...');
				this.$http.post(api,this.user).then( function(response){
					console.log('post');
					console.log(response);
					if(response.data.token){
						console.log('token');
						localStorage.setItem('token', response.data.token);
						localStorage.setItem('user', JSON.stringify(response.data.usuario));
						window.location.href='/usuario';
					}
				},
				function(err){
				 	var message = err.body.message;
					switch (err.body.code) {
					  	case 0:
							alert(message)
					    break;
					  	case 1:
			        		$('#myModalLogin_errUsuario').modal('toggle');
					    break;
					  	case 3:
					  		this.user.password=""
			        		$('#myModalLogin_errUsuariopassword').modal('toggle');

					    break;
					    case 4:
			        		$('#myModalLogin_errUsuarioactivado').modal('toggle');

					    break;
					  	default:
					  		//alert(err.body)
							console.log(err.body)
					}					 	
				})
				.catch(function(e) {
					console.log("Caught", e);
				});
			}
			form.addClass('was-validated');
		}
	}
});