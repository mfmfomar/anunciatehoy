var appPerfil =new Vue({
  el: '.table-responsive',
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
    api:"../api/anunciosUser"
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
    deleteItem:function(){
      if(this.dataDelete.length>0){
        this.$http.delete(this.api,{headers:{"Authorization": localStorage.getItem('token')},body:this.dataDelete}).then(function(response){
          for(i=0;i<this.dataDelete.length;i++){
            for(j=0;j<this.anuncios.length;j++){
              if(this.anuncios[j]._id == this.dataDelete[i]) this.anuncios.splice(j,1)
            }
          }
          this.dataDelete= []
        },
        function(err){
          var message = err.body.message;
          console.error(err.body)
        })
        .catch(function(e) {
          console.error("Caught", e);
        });
      }
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
//@prepros-prepend  dropzone.imagen.js
var updateImage = new updateImage(1,updateImagecomplete);
function updateImagecomplete(){
  console.log('complete function')
  // alert('k pedo')
  //location.reload();
}

$(document).ready(function () {
  "use strict";

  $("#eliminar").click(function(){
    this.hijos = $('.table-responsive').find('.dt-checkboxes');
    this.hijos.each(function() { 
      if ($(this).is(':checked')) {
        appPerfil.dataDelete.push ($(this).parent().parent().attr('index'))
      }
    });
    $('#myModal').modal('toggle');
  
  })
  $("#add-new-data-sidebar").submit(function(e){
    var form = $("#add-new-data-sidebar");
    event.preventDefault();
    event.stopPropagation();
    if (form[0].checkValidity() === false) {
    }else{
      form.addClass('was-validated');
      var data =  $('#add-new-data-sidebar').serializeArray() 
      updateImage.enviar(data)
    }
  });
  $('#nuevo').click(function(event) {
    $("#enviar").click()
  });
  // init list view datatable
  var dataListView = $('.data-list-view').DataTable({
    responsive: false,
    columnDefs: [{
      orderable: true,
      targets: 0,
      checkboxes: { selectRow: true },
    }],
    "dom": '<"top"<"actions action-btns"B><"action-filters"lf>><"clear">rt<"bottom"<"actions">p>',
    "oLanguage": {
      "sLengthMenu": "_MENU_",
      "sSearch": ""
    },
    "aLengthMenu": [[4, 10, 15, 20], [4, 10, 15, 20]],
    select: {
      selector: 'td:first-child',
      style: 'multi'
    },
    order: [[1, 'asc']],
    bInfo: false,
    "pageLength": 4,
    buttons: [
      {
        text: "<div data-i18n='Añadir nuevo' ><i class='feather icon-plus'></i> Añadir nuevo</div",
        action: function () {
          location.href='/publicar';
          // $(this).removeClass("btn-secondary")
          // $(".add-new-data").addClass("show")
          // $(".overlay-bg").addClass("show")
          // $("#data-name, #data-price").val("");
          // $("#data-category, #data-status").prop('selectedIndex', 0);
        },
        className: "btn-outline-primary",
      }
    ],
    initComplete: function (settings, json) {
      $(".dt-buttons .btn").removeClass("btn-secondary");
    },
  });

  // init thumb view datatable
  var dataThumbView = $(".data-thumb-view").DataTable({
    responsive: false,
    columnDefs: [{
      orderable: true,
      targets: 0,
      checkboxes: { selectRow: true },
    }],
    "dom": '<"top"<"actions action-btns"B><"action-filters"lf>><"clear">rt<"bottom"<"actions">p>',
    "oLanguage": {
      "sLengthMenu": "_MENU_",
      "sSearch": ""
    },
    "aLengthMenu": [[4, 10, 15, 20], [4, 10, 15, 20]],
    select: {
      selector: 'td:first-child',
      style: 'multi'
    },
    order: [[1, 'asc']],
    bInfo: false,
    "pageLength": 4,
    buttons: [
      {
        text: "<div data-i18n='Añadir nuevo'><i class='feather icon-plus'></i> Añadir nuevo</div",
        action: function () {
          $(this).removeClass("btn-secondary");
          $(".add-new-data").addClass("show");
          $(".overlay-bg").addClass("show");
        },
        className: "btn-outline-primary",
      }
    ],
    initComplete: function (settings, json) {
      $(".dt-buttons .btn").removeClass("btn-secondary");
    },

  })

  // To append actions dropdown before add new button
  var actionDropdown = $(".actions-dropodown")
  actionDropdown.insertBefore($(".top .actions .dt-buttons"))

  // to check and uncheck checkboxes on click of <td> tag
  $(".data-list-view, .data-thumb-view").on("click", "tbody td", function () {
    var dtCheckbox = $(this).parent("tr").find(".dt-checkboxes-cell .dt-checkboxes")
    $(this).closest("tr").toggleClass("selected");
    dtCheckbox.prop("checked", !dtCheckbox.prop("checked"))
  });

  $(".dt-checkboxes").on("click", function () {
    $(this).closest("tr").toggleClass("selected");
  })
  $(".dt-checkboxes-select-all input").on("click", function () {
    $(".data-list-view").find("tbody tr").toggleClass("selected")
    $(".data-thumb-view").find("tbody tr").toggleClass("selected")
  })
  // Scrollbar
  if ($(".data-items").length > 0) {
    new PerfectScrollbar(".data-items", { wheelPropagation: false });
  }

  // Close sidebar
  $(".hide-data-sidebar, .cancel-data-btn").on("click", function () {
    $(".add-new-data").removeClass("show");
    $(".overlay-bg").removeClass("show");
    $("#data-name, #data-price").val("");
    $("#data-category, #data-status").prop('selectedIndex', 0);
  })

  // dropzone init
  /*
  
  Dropzone.options.dataListUpload = {
    complete: function (files) {
      var _this = this;
      // checks files in class dropzone and remove that files
      $(".hide-data-sidebar, .cancel-data-btn, .actions .dt-buttons").on("click", function () {
        $('.dropzone')[0].dropzone.files.forEach(function (file) {
          file.previewElement.remove();
        });
        $('.dropzone').removeClass('dz-started');
      })
    }
  };
  Dropzone.options.dataListUpload.complete();
   */


  // mac chrome checkbox fix
  if (navigator.userAgent.indexOf('Mac OS X') != -1) {
    $(".dt-checkboxes-cell input, .dt-checkboxes").addClass("mac-checkbox");
  }
  // Select With Icon
  $(".select2-icons").select2({
      minimumResultsForSearch: Infinity,
      templateResult: iconFormat,
      templateSelection: iconFormat,
      escapeMarkup: function(es) { return es; }
  });

  // Format icon
  function iconFormat(icon) {
      var originalOption = icon.element;
      if (!icon.id) { return icon.text; }
      var $icon = "<i class='" + $(icon.element).data('icon') + "'></i>" + icon.text;

      return $icon;
  }
})