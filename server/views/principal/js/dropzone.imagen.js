updateImage =  function(dropzoneMaxFiles,callback){
	var myDropzone;
	var portadaName;
	var data;
 	function initialize(){
		var fileCount=0;
		Dropzone.autoDiscover = false;
		Dropzone.options.portadaForm = {
		 	headers:{"Authorization": localStorage.getItem('token')},
		    maxFilesize: 1,
		    parallelUploads: 10,
		    uploadMultiple:true,
		    autoProcessQueue: false,
		    addRemoveLinks: true,
		    maxFiles: dropzoneMaxFiles,
		    dictResponseError: 'Server not Configured',
		    acceptedFiles: ".png,.jpg,.gif,.bmp,.jpeg",
		    paramName: "fileImage",
		    init:function(){
				var self = this;
			      // config
				self.options.addRemoveLinks = true;
				self.options.dictRemoveFile = "Delete";
				//New file added
				self.on("addedfile", function (file) {

					$( '.dz-preview' ).first().addClass('DZportada')
					portadaName = $( '.DZportada>.dz-details>.dz-filename>span' ).html()
					$("#imgPortada").val(portadaName);
					fileCount++;
					$('#foto').val(fileCount);
					console.log('new file added ', file);
				});
				// Send file starts
				self.on("sending", function(file, xhr, formData) {

					/*
					formData.append("carpetaPath", app.ubicacion.tipo+'/'+location.pathname.split('/')[4]);
					formData.append("tabla", location.pathname.split('/')[3]);
					formData.append("carpetaId", location.pathname.split('/')[4]);
					formData.append("tipo", $('#tipo').val());
					 */
					formData.append("portadaName",portadaName );
					$("#imgPortada").val(portadaName);
					for (var i =0; i< data.length ;  i++) {
						formData.append(data[i].name, data[i].value);
					}

					// iniciando
					console.log('upload started', file);
				});
				// File upload Progress
				self.on("totaluploadprogress", function (progress) {
					console.log("progress ", progress);
					$('#progres').width(progress + '%');
				});
				self.on("complete", function (file) {
					console.log('complete');
					if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0) {
					    console.log('complete All');
					    callback();
					}

				});
				self.on("success", function (file,responseText) {
					console.log('done');
					myDropzone.options.autoProcessQueue = true;
				});
				// On removing file
				self.on("removedfile", function (file) {
					console.log(file);
					fileCount--;
					$( '.dz-preview' ).first().addClass('DZportada')
					portadaName = $( '.DZportada>.dz-details>.dz-filename>span' ).html()
					$("#imgPortada").val(portadaName);
					if (fileCount < 1) {
                        $('#foto').val('');
                    }

				});
		    }
		};
		myDropzone = new Dropzone("#portadaForm");
 	}
	initialize();
	return {
		enviar: function(array){
			data = array;
			myDropzone.processQueue();	
		},
		portadaName:function(){
			console.log(portadaName)
			return portadaName;
		}
	}
 }

