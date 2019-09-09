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
	    	var data =  $('#add-new-data-sidebar').serializeArray()
	    	var datos =[]
	    	$.ajax({
			    type: 'POST',
			    url: '/api/nuevoAnuncio',
			    headers: {"Authorization": localStorage.getItem('token')},
			    data:data
			}).done(function(data) { 
			    datos[0] = {name:'id',value:data.codigo};
			    updateImage.enviar(datos)   
			}); 
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
	$('#myModalanuncio_publicado').modal('toggle');
}
$(document).ready(function () {
  "use strict";

  $('#nuevo').click(function(event) {
    $("#enviar").click()
  });

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
});


