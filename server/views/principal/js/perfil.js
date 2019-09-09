
var appPerfil =new Vue({
  el: '#formPerfil',
  created: function() {this.getValues()},
  data: {
    user: JSON.parse(localStorage.getItem('user')),
    options:{headers:{"Authorization": localStorage.getItem('token')}},
    api:"../api/actualizarUsuario"
  },
  methods: {
    update:function(){
        this.$http.put(this.api,this.user,this.options).then(function(response){
          if(response.data){
            localStorage.setItem('user', JSON.stringify(response.data.update));
          }
        },
        function(err){
          var message = err.body.message;
          switch (err.body.code) {
              case 0:
              alert(message)
              break;
              case 1:
              alert(message)
              break;
              case 3:
                this.user.password=""
              alert(message)
              break;
              default:
                //alert(err.body)
              console.log(err.body)
          }           
        })
        .catch(function(e) {
          console.log("Caught", e);
        });
    },
    getValues:function(){
      // var usuario = localStorage.getItem('user');
      // usuario = JSON.parse(usuario);
      // this.user = usuario
      $('#pais').addClass('flag-icon-'+this.user.countryCode)
    }
  }
});