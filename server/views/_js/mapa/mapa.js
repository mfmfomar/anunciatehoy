var mapaVue = new Vue({
  el: '#map',
  created: function() {
    console.log('soy el nuevo mapa con vue.js')
  },
  data: {
    marcadores:{
        casa:[],
        compartido:[],
        departamento:[],
        hostal:[],
        hotel:[],
        motel:[],
        oficina:[],
        terreno:[],
    },
    datos:{
        casa:[],
        compartido:[],
        departamento:[],
        hostal:[],
        hotel:[],
        motel:[],
        oficina:[],
        terreno:[],
    },
    variables:{
        url:'',
        carpetaIco:'',
        carpetaUbicaciones:'',
        map:null,
        miPosicion : {
            'latitude':null,
            'longitude':null
            },
        markerMiposicion:[],
        markers : [],
        markerCluster : null, 
        locationSupport : true,
        draggable : false
    }
  }, 
  methods: {
    
  } 
});

//test revisar
    function listeners(){
        // Change markers on zoom 
        // google.maps.event.addListener(mapaVue.variables.map, 'zoom_changed', function() {
        //     var zoom = mapaVue.variables.map.getZoom();
            
        //     // iterate over markers and call setVisible
        //     for (i = 0; i < markers.length; i++) {
        //         markers[i].setVisible(zoom >= 10);
        //     }
            
        //     if (mapaVue.variables.map.getZoom() < maxZoomLevel) mapaVue.variables.map.setZoom(maxZoomLevel);
        // });
        mapaVue.variables.map.addListener('zoom_changed',function(){
            console.log('zoom_changed')
        });



    }
    navigator.sayswho= (function(){
        var ua= navigator.userAgent, tem, 
        M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if(/trident/i.test(M[1])){
            tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE '+(tem[1] || '');
        }
        if(M[1]=== 'Chrome'){
            tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
            if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
            M[1]='Google Chrome';
        }
        M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
        return M.join(' ');
    })();
MAPA =  function(url){
    // OPCIONES DEL MAPA
        var mapStyles = [{featureType:'water',elementType:'all',stylers:[{hue:'#d7ebef'},{saturation:-5},{lightness:54},{visibility:'on'}]},{featureType:'landscape',elementType:'all',stylers:[{hue:'#eceae6'},{saturation:-49},{lightness:22},{visibility:'on'}]},{featureType:'poi.park',elementType:'all',stylers:[{hue:'#dddbd7'},{saturation:-81},{lightness:34},{visibility:'on'}]},{featureType:'poi.medical',elementType:'all',stylers:[{hue:'#dddbd7'},{saturation:-80},{lightness:-2},{visibility:'on'}]},{featureType:'poi.school',elementType:'all',stylers:[{hue:'#c8c6c3'},{saturation:-91},{lightness:-7},{visibility:'on'}]},{featureType:'landscape.natural',elementType:'all',stylers:[{hue:'#c8c6c3'},{saturation:-71},{lightness:-18},{visibility:'on'}]},{featureType:'road.highway',elementType:'all',stylers:[{hue:'#dddbd7'},{saturation:-92},{lightness:60},{visibility:'on'}]},{featureType:'poi',elementType:'all',stylers:[{hue:'#dddbd7'},{saturation:-81},{lightness:34},{visibility:'on'}]},{featureType:'road.arterial',elementType:'all',stylers:[{hue:'#dddbd7'},{saturation:-92},{lightness:37},{visibility:'on'}]},{featureType:'transit',elementType:'geometry',stylers:[{hue:'#c8c6c3'},{saturation:4},{lightness:10},{visibility:'on'}]}];
        var mapOptions = {
              center: new google.maps.LatLng(31.859576999999998, -116.606428),
              zoom: 15,
              //mapTypeId: google.maps.MapTypeId.ROADMAP,
              mapTypeId: google.maps.MapTypeId.SATELLITE,
              scrollwheel: true,
              styles: mapStyles,
              fullscreenControl: false
            };
        var maxZoomLevel=10;
    // Variables
        mapaVue.variables.draggable = false;
        mapaVue.variables.url = url;
        mapaVue.variables.carpetaIco = url+'mapa/'
        mapaVue.variables.carpetaUbicaciones = url+'ubicaciones/'
//funciones publicas
return {
    initialize:  function(draggable) {
        if(draggable){
            console.log('revisar la funcion initialize... function deprecate')
            mapaVue.variables.draggable=draggable;
        }
        initialize();        
    },
    initializePosition: function(position){
        initializePosition(position); 
    },
    addMarkers :  function(json_data,tipo) {
        for(var k in json_data) {
            if(json_data[k].length){
               for (i = 0; i < json_data[k].length; i++) { 
                //json_data[k][i].detallesUrl = k+'/'+json_data[k][i]._id;
                json_data[k][i]._curp =json_data[k][i].categoria+json_data[k][i].tipo+json_data[k][i]._id;
                json_data[k][i].tipo = tipo;
                mapaVue.datos[tipo].push(json_data[k][i]);  
               }
            }
        }
    },
    setData :  function(tipo) {
        for (i = 0; i < mapaVue.datos[tipo].length; i++) { 
            setMarker_data (mapaVue.datos[tipo][i],tipo);
        }
        setMarkerCluster();
    },
    addMarker : function(json_data) {
        setMarker_data (json_data,json_data.tipo);
        setMarkerCluster();
    },
    update: function(data){
        setStyleMarkerId(data);
    },
    delete: function(id){
       
       for (var i = 0; i < mapaVue.variables.markers.length; i++) {
            if(mapaVue.variables.markers[i].id==id){
                mapaVue.variables.markers[i].setMap(null);
                mapaVue.variables.markers.splice(i, 1);
                mapaVue.variables.markerCluster.markers_.splice(i, 1);
                break;
            }
       }

    },
    limpiarMapa: function(){
        deleteMarkers();
    },
    UbicacionActual: function(){
        UbicacionActual();
    },
    LocationSupport: function(){
        console.log(mapaVue.variables.locationSupport);
        return mapaVue.variables.locationSupport;
    },
    SetPin: function(){
       setpin(true);
    },
    test : function (){
        console.log('Function test map');
    }
}
//funciones
    function setCordernadas(lat,lng){
        try{
            window.tmplat=lat;
            window.tmplng=lng;
            $("#lat").val(lat);
            $("#lng").val(lng);
        }catch(err){}
    }
    function setpin(){
         google.maps.event.addListener(mapaVue.variables.map, "click", function(event)
        {
            setCordernadas(event.latLng.lat(),event.latLng.lng());
            deleteMarkers();
            setMarkerPosition(event.latLng.lat(),event.latLng.lng(),mapaVue.variables.markerMiposicion,true);
        });
    }
    // Sets the map on all markers in the array.
    function setMapOnAll(map) {
      for (var i = 0; i < mapaVue.variables.markers.length; i++) {
        mapaVue.variables.markers[i].setMap(map);
      }
      for (var i = 0; i < mapaVue.variables.markerMiposicion.length; i++) {
        mapaVue.variables.markerMiposicion[i].setMap(map);
      }
      
    }
    // Removes the markers from the map, but keeps them in the array.
    function clearMarkers() {setMapOnAll(null);}

    // Shows any markers currently in the array.
    function showMarkers() {setMapOnAll(mapaVue.variables.map);}

    // Deletes all markers in the array by removing references to them.
    function deleteMarkers() {
        try{ mapaVue.variables.markerCluster.setMap(null);}catch(err){}
        setMapOnAll();
        mapaVue.variables.markers = [];
        mapaVue.variables.markerMiposicion = [];
        clearMarkers();

    }
    function setIconMarker(){

    }
    function getStyle(disponibilidad){
        switch(disponibilidad) {
            case false:
                return "marker-style-red";
                break;
            case true:
                return "marker-style-green";
                break;
            case 0:
                return  "marker-style";    
            default:
                return  "marker-style";
        }
    }
    function setMarkerWlabel(data,clase,tipo){
        var path = url+'property-types/'+data['tipo'] +".png";
        //imagen dentro del marker
        var pictureLabel = document.createElement("img");
        pictureLabel.src = path;
        return  new MarkerWithLabel({
                position:new google.maps.LatLng(data['ubicacion']),
                map: mapaVue.variables.map,
                icon: mapaVue.variables.carpetaIco+'/marker.png',
                labelContent: pictureLabel,
                labelAnchor: new google.maps.Point(50, 0),
                labelClass: clase,
                id:data['_id'],
                tipo:data['tipo'],
                curp:data['_curp']
            });
    }
    function setInfoBox(data,marker){

        var imgPortada;
        if(data['imgPortada']=="default.jpg"){
            imgPortada =mapaVue.variables.carpetaUbicaciones+data['tipo']+"/"+data['imgPortada'];
        }else{
            imgPortada =mapaVue.variables.carpetaUbicaciones+data['tipo']+'/'+data['_id']+"/"+data['imgPortada'];
        }
        var boxText = document.createElement("div");
        infoboxOptions = {
            content: boxText,
            disableAutoPan: false,
            pixelOffset: new google.maps.Size(-100, 0),
            zIndex: null,
            alignBottom: true,
            boxClass: "infobox-wrapper",
            enableEventPropagation: true,
            closeBoxMargin: "0px 0px -8px 0px;height:10%;width:10%",
            closeBoxURL: mapaVue.variables.carpetaIco+"close-btn.png",
            infoBoxClearance: new google.maps.Size(1, 1)
        };
            // Seccion de cascarones (inicio) 
                boxText['default']='<div class="infobox-inner">' +
                    '<a href="' +  data['detallesUrl'] + '">' +
                    '<div class="infobox-image" style="position: relative">' +
                    '<figure class="boxtipo">' + data['estatus'] + '</figure>'+
                    '<img src="' + url+data['imgPropiedad'] + '">' + 
                    '<div><span class="infobox-price">' + data['precio'] + '</span></div>' +
                    '</div>' +
                    '</a>' +
                    '<div class="infobox-description">' +
                    '<div class="infobox-title"><a href="' +'">'+data['Descripcion']+'</a></div>' +
                    '<div class="infobox-location">' + '2479 Murphy Court descripcion' + '</div>' +
                    '</div>' +
                    '</div>';
                boxText['hospedaje']='<div class="infobox-inner" onclick="link('+"'"+data['detallesUrl']+"'"+');">' +
                    '<div class="infobox-image" style="position: relative">' +
                    '<img style="height: 182px;width: 100%;background-size: contain;background-image: url('+imgPortada+');" src="' +imgPortada + '">' + 
                    '<div><span class="infobox-price">' + data['costo'] + '</span></div>' +
                    '</div>' +
                    '</a>' +
                    '<div class="infobox-description">' +
                    '<div class="infobox-title">'+data['tipo']+'</div>' +
                    '<div class="infobox-location">' +data['colonia']+', '+data['calle']+' '+data['numero']+'</div>' +  '</div>' +
                    '</div>' +
                    '</div>';
                boxText['propiedad']='<div class="infobox-inner" onclick="link('+"'"+data['detallesUrl']+"'"+');">' +
                    '<div class="infobox-image" style="position: relative">' +
                    '<img style="height: 182px;width: 100%;background-size: contain;background-image: url('+imgPortada+');" src="' +imgPortada + '">' + 
                    '<div><span class="infobox-price">' + data['costo'] + '</span></div>' +
                    '</div>' +
                    '</a>' +
                    '<div class="infobox-description">' +
                    '<div class="infobox-title">'+'</div>' +
                    '<div class="infobox-location">' +data['colonia']+', '+data['calle']+' '+data['numero']+'</div>' +  '</div>' +
                    '</div>' +
                    '</div>';
                
                boxText['hospedaje2'] =
                     '<div class="infobox-inner property" onclick="link('+"'hospedaje/"+data['_id']+"'"+');">' +
                        '<a href="#">' +
                            '<div class="property-image">' +
                                '<img src="' + imgPortada + '">' +
                            '</div>' +
                            '<div class="overlay">' +
                                '<div class="info">' +
                                    '<div class="tag price"> $' + data['nombre'] + '</div>' +
                                    '<h3>' + data['calle']+' '+data['numero'] + '</h3>' +
                                    '<figure>' + data['colonia'] + '</figure>' +
                                '</div>' +
                            '</div>' +
                        '</a>' +
                    '</div>'
                ;
                boxText['propiedad2'] =
                     '<div class="infobox-inner property" onclick="link('+"'propiedad/"+data['_id']+"'"+');">' +
                        '<a href="#">' +
                            '<div class="property-image">' +
                                '<img src="' + imgPortada + '">' +
                            '</div>' +
                            '<div class="overlay">' +
                                '<div class="info">' +
                                    '<div class="tag price"> $' + data['costo'] + '</div>' +
                                    '<h3>' + data['calle']+' '+data['numero'] + '</h3>' +
                                    '<figure>' + data['colonia'] + '</figure>' +
                                '</div>' +
                            '</div>' +
                        '</a>' +
                    '</div>'
                ;
                // Termino de cascaron (fin)
        if(data['tipo']=='hotel' || data['tipo']=='motel') boxText.innerHTML = boxText['hospedaje2'];
        else boxText.innerHTML = boxText['propiedad2'];        

        var index = mapaVue.variables.markers.length-1;
        mapaVue.variables.markers[(index)].infobox = new InfoBox(infoboxOptions);
        // agrega un listener al market
        google.maps.event.addListener(marker, 'click', (function(marker, index) {
            return function() {
                $(".infobox-wrapper>img").click();
                mapaVue.variables.markers[(index)].infobox.open(mapaVue.variables.map, this);
            }
        })(marker, index));

    }
    function setMarkerCluster(){
        var clusterStyles = [{
            textColor: 'black',
            url: url+'mapa/cluster.png',
            height: 37,
            width: 37
        }];
        if( mapaVue.variables.markerCluster != null){
            mapaVue.variables.markerCluster.setMap(null);
        }
        mapaVue.variables.markerCluster = new MarkerClusterer(mapaVue.variables.map, mapaVue.variables.markers, {styles: clusterStyles, maxZoom: 28});
    }
    function setMarker_data(data,tipo){
        //info del data que llega
            //tipo -> casa departamento terreno local
            //imgMarker
            //detallesUrl
            //estatus -> venta renta
            //imgPropiedad
            //precio
            //Descripcion
            //posicionLat
            //posicionLng
        //seleccionar el tipo de estilo
            var claseStyle = getStyle(data["disponibilidad"]);       
        //crea marker en el mapa
            var marker = setMarkerWlabel(data,claseStyle,tipo);
        //guardamor el marker en un arreglo
            mapaVue.variables.markers.push(marker);
            mapaVue.marcadores[tipo].push(marker);  
        //cuadro de detalles
            setInfoBox(data,marker);
        //lisenteners
        google.maps.event.addListener(marker, 'mouseover', function() {

            //console.log('hover')
            //marker.position[31.799885, -116.619006]
            //checar el update
            //mapaVue.variables.marker.id
            ////31.799885, -116.619006
        });
        google.maps.event.addListener(marker, 'mouseout', function() {
            //console.log('salio')
        });
    }
    function setStyleMarkerId(data){

        for (var i = 0; i < mapaVue.variables.markers.length; i++) {
            //console.log(mapaVue.variables.markers[i]._id==data._id && mapaVue.variables.markers[i].tipo==data.tipo)
            if(mapaVue.variables.markers[i].id==data._id && mapaVue.variables.markers[i].tipo==data.tipo){
                var claseStyle = getStyle(data["disponibilidad"]);
                mapaVue.variables.markers[i].labelClass= claseStyle;
                var latlng = new google.maps.LatLng(data.ubicacion.lat,data.ubicacion.lng);
                mapaVue.variables.markers[i].setPosition( latlng );
                mapaVue.variables.markerCluster.markers_[i].setPosition(latlng);
                //centra el mapa en una ubicacion
                //mapaVue.variables.map.panTo( new google.maps.LatLng(data.ubicacion.lat,data.ubicacion.lng) );
                google.maps.event.trigger(mapaVue.variables.map, 'resize');
                break;           
            }
        }
        setMarkerCluster();
    }
    function UbicacionActual(position){
       // position.coords.latitude,position.coords.longitude
       console.log('UbicacionActual');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            alert('Geo Location is not supported');
        }
    }
    function success(position) {
        mapaVue.variables.miPosicion = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        console.log(mapaVue.variables.miPosicion)
        //var latlng = new google.maps.LatLng(latitude, longitude);
        mapaVue.variables.map.setCenter(mapaVue.variables.miPosicion);
        //console.log(position.coords.latitude+'='+ position.coords.longitude);
        //poner un marcador
        //setMarker(position.coords.latitude,position.coords.longitude);
    } 
    function initializePosition(position){
        console.log('cuando lo usas?? si no borrame 14/08/2019')
        mapaVue.variables.map = new google.maps.Map(document.getElementById('map'),mapOptions);
        mapaVue.variables.locationSupport= true;
        mapOptions.center= new google.maps.LatLng(position.lat,position.lng);
        mapaVue.variables.map.setCenter(mapOptions.center);
        setMarkerPosition(position.lat,position.lng,mapaVue.variables.markerMiposicion,false);
        setCordernadas(position.lat,position.lng);
    }
    function initialize() {
        loadLocation();
        mapaVue.variables.map = new google.maps.Map(document.getElementById('map'),mapOptions);
    }
    function loadLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(setPosition,error);          
        } else {
            alert("Geolocation no es soportada en este navegador.");
            console.log("Geolocation no es soportada en este navegador.");
        }
    }
    function setPosition(position) {
        mapaVue.variables.miPosicion.latitude = position.coords.latitude
        mapaVue.variables.miPosicion.longitude =position.coords.longitude
        mapaVue.variables.locationSupport= true;
        mapOptions.center= new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
        mapaVue.variables.map.setCenter(mapOptions.center);
        setMarkerPosition(position.coords.latitude,position.coords.longitude,mapaVue.variables.markerMiposicion,false);
        setCordernadas(position.coords.latitude,position.coords.longitude);
    }
    function error(error) {
        mapaVue.variables.locationSupport = false;    
        console.log(error.code);
        console.log(error);
            switch(error.code)
                {
                    case error.PERMISSION_DENIED:
                        a="google";
                        var navegador = navigator.sayswho;
                         intIndex = a.indexOf(navegador);
                        if(intIndex == - 1){
                          alert ('Google Chrome no es compatible con nuestro sitio por el momento, puede utilizar otro navegador');
                        }    else{
                          alert ('No se permitió o no se tienen suficientes privilegios para acceder al servicio de geolocalización. ['+navigator.sayswho+']['+error.message+']');
                        }
                   break;
                    case error.POSITION_UNAVAILABLE:
                        alert("El dispositivo no pudo determinar correctamente su ubicación.");
                    break;

                    case error.TIMEOUT:
                        alert("El intento de geolocalización tomó mas tiempo del permitido (opción timeout).!");
                    break;

                    default:
                        alert("ERROR: Unknown problem!");
                    break;
                }
    }
    function setMarkerPosition (posicionLat,posicionLng,variable,draggable) {
        var marker = new MarkerWithLabel({
            position:new google.maps.LatLng(posicionLat,posicionLng),
            map: mapaVue.variables.map,
            icon: mapaVue.variables.carpetaIco+'marker.png',
            labelAnchor: new google.maps.Point(5, 35),
            labelClass: "marker-style",
            draggable: true,
            //labelContent: '<div class="iconMarker"><i class="fas fa-street-view"></i></div>',

        });
        variable.push(marker);
    }
}
