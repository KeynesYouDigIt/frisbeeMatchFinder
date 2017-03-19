function initMap(filter = null) {
    var places = init_parks
    //empty the data selectable
    console.log('its the map man')
    console.log(places)
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        center: {lat: 40.7413, lng: -74.998}
    });
    var largeInfoWindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();
    //add selectable data
    if (!$('#park-name-text').select2().val()) {
        console.log('not line 23')
        $('#park-name-text').select2({data: init_parks});
    }
    var markers = []

    for (i = 0; i < places.length; i++) {
        if (filter==null || places[i].id() == filter) {
            //console.log(places[i].text)
            //console.log('is ok')
            var mark = new google.maps.Marker({
                position: places[i].position,
                map: map,
                title:places[i].text,
                icon: 'https://cdn4.iconfinder.com/data/icons/simply-8-bits-11/96/spaceinvader_1.png'
            });
            markers.push(mark);
            bounds.extend(mark.position);
            mark.addListener('click', function() {
                populateInfo(this, largeInfoWindow);
            });
        }}
    map.fitBounds(bounds);

    function populateInfo(marker, infowindow){
        if(infowindow.marker != marker) {
            console.log('marker id')
            console.log(document.getElementById(marker.title))
            var clickedParkTitle = document.getElementById(marker.title)
            clickedParkTitle.classList.toggle('park-info-open');
            infowindow.marker = marker;
            infowindow.marker.setAnimation(google.maps.Animation.BOUNCE);
            infowindow.setContent('<div>' + marker.title + '</div>');
            infowindow.open(map, marker);
            infowindow.addListener('closeclick', function() {
                infowindow.marker.setAnimation(null);
                console.log('shush');
                var clickedParkTitle = document.getElementById(infowindow.marker.title)
                clickedParkTitle.classList.remove('park-info-open');
            }, function(){
                    infowindow.marker = null
                }
            )
        }
    }
    document.getElementById('park-name-sub').addEventListener('click', function() {
        console.log(document.getElementById('park-name-text').value);
        initMap(filter=document.getElementById('park-name-text').value);
    });
};
