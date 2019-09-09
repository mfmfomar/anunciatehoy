var socket = io.connect(location.host, { 'forceNew': true });
var appPerfil =new Vue({
  el: '.table-responsive',
  created: function() {this.getUbicacionesUser()},
  data: {
    user: JSON.parse(localStorage.getItem('user')),
    data:{
    },
    options:{headers:{"Authorization": localStorage.getItem('token')}},
    dataDelete:[],
    api:"../api/ubicacion"
  },
  methods: {
    getUbicacionesUser:function(){
      this.$http.get(this.api,this.options).then(function(response){
        this.data =  response.data
      })
    },
    deleteItem:function(){

      if(this.dataDelete.length>0){
        this.$http.delete(this.api,{headers:{"Authorization": localStorage.getItem('token')},body:this.dataDelete}).then(function(response){
          for(i=0;i<this.dataDelete.length;i++){
            var tmp = this.dataDelete[i].split('@')
            if(tmp[1]=='propiedad'){
              for(j=0;j<this.data.propiedad.length;j++){
                if(this.data.propiedad[j]._id == tmp[0]) {
                  socket.emit('deleteProperty', this.data.propiedad[j]);
                  this.data.propiedad.splice(j,1)
                }
              }
            }else if(tmp[1]=='hospedaje'){
              for(j=0;j<this.data.hospedaje.length;j++){
                if(this.data.hospedaje[j]._id == tmp[0]) {
                  socket.emit('deleteProperty', this.data.propiedad[j]);
                  this.data.hospedaje.splice(j,1)
                }
              }
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
    interruptor: function(_id){
      
      this.data.hospedaje[_id].disponibilidad =       !this.data.hospedaje[_id].disponibilidad 
      this.$http.put(this.api,this.data.hospedaje[_id],  {headers: {"Authorization": localStorage.getItem('token')}}).then( function(response){
         socket.emit('upDateUbicacion', response.data.propiedad);
         console.log(response)
     });

    }
  }
});


$(document).ready(function () {
  "use strict";

  $("#eliminar").click(function(){
    this.hijos = $('.table-responsive').find('.dt-checkboxes');
    this.hijos.each(function() { 
      if ($(this).is(':checked')) {
        appPerfil.dataDelete.push ($(this).parent().parent().attr('index')+'@'+$(this).parent().parent().attr('tabla'))
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
        text: "<div data-i18n='Añadir nuevo' ><i class='feather icon-plus'></i> Añadir nuevo</div>",
        action: function () {
          location.href='/nuevaUbicacion';
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