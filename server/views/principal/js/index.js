var appPerfil =new Vue({
  el: '#basic-examples',
  created: function() {this.getAnunciosUser()},
  data: {
    user: JSON.parse(localStorage.getItem('user')),
    anuncio:{
      titulo:'',
      precio:'',
      descripcion:'',
      fecha:'Se publico hace 3 días'},    
    dataDelete:[],
    anuncios:{},
    options:{headers:{"Authorization": localStorage.getItem('token')}},
    api:"../api/anuncios"
  },
  methods: {
    getAnunciosUser:function(){
      this.$http.get(this.api,this.options).then(function(response){
        if(response.data)this.anuncios = response.data.anuncios
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
    mostrar: function(index){
      this.anuncio.titulo = this.anuncios[index].titulo
      this.anuncio.usuario =  this.user.apellido +' '+this.user.nombre
      this.anuncio.nombreUSuario = 'Elite Author'
      this.anuncio.precio = this.anuncios[index].precio
      this.anuncio.fecha = 'Se publico hace 3 días'
      this.anuncio.descripcion = this.anuncios[index].descripcion
      this.anuncio.imagen = '/publico/assets/img/anuncios/'+this.anuncios[index]._id+'/'+this.anuncios[index].imgPortada
      // console.log('seleccionaste el #'+index)
      $('#myModal2').modal('toggle');

    }
  }
});

$(document).ready(function () {});