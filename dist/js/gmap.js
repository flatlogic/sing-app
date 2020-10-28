$(function(){
    function initGmap(){
        var map = new GMaps({
            el: '#gmap',
            lat: -37.813179,
            lng: 144.950259,
            zoomControl : false,
            panControl : false,
            streetViewControl : false,
            mapTypeControl: false,
            overviewMapControl: false
        });

        map.setContextMenu({
            control: 'map',
            options: [{
                title: 'Add marker',
                name: 'add_marker',
                action: function(e){
                    this.addMarker({
                        lat: e.latLng.lat(),
                        lng: e.latLng.lng(),
                        animation: google.maps.Animation.DROP,
                        draggable:true,
                        title: 'New Marker'
                    });
                    this.hideContextMenu();
                }
            }, {
                title: 'Center here',
                name: 'center_here',
                action: function(e){
                    this.setCenter(e.latLng.lat(), e.latLng.lng());
                }
            }]
        });
        map.setContextMenu({
            control: 'marker',
            options: [{
                title: 'Center here',
                name: 'center_here',
                action: function(e){
                    this.setCenter(e.latLng.lat(), e.latLng.lng());
                }
            }]
        });

        $("#gmap-zoom-in").on('click', function() {
            map.zoomIn(1);
        });
        $("#gmap-zoom-out").on('click', function() {
            map.zoomOut(1);
        });

        setTimeout( function(){
            map.addMarker({
                lat: -37.813179,
                lng: 144.950259,
                animation: google.maps.Animation.DROP,
                draggable: true,
                title: 'Here we are'
            });
        }, 3000);
    }

    function pageLoad(){
        initGmap();
    }

    pageLoad();
    SingApp.onPageLoad(pageLoad);
});