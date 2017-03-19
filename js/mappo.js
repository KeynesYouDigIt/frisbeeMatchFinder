var map;
var places = [
    {id:1, position:{lat: 39.6984, lng: -104.9652}, text:'Wash Park'},
    {id:2, position:{lat: 39.6757, lng: -104.9530}, text:'O Park'},
    {id:3, position:{lat: 39.7459, lng: -104.9476}, text:'City Park'},
    {id:4, position:{lat: 39.7335, lng: -104.9652}, text:'Cheeseman Park'},
    {id:5, position:{lat: 39.7364, lng: -105.0317}, text:'Paco Sanchez Park'},
    {id:6, position:{lat: 39.7014, lng: -105.0937}, text:'Belmar Park'}
]

function initMap(filter = null) {
    //empty the data selectable
    console.log('its the map man')
    console.log(filter)
    var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 5,
    center: {lat: 40.7413, lng: -74.998}
    });
    var largeInfoWindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();
    //add selectable data
    if (!$('#park-name-text').select2().val()) {
        console.log('not line 23')
        $('#park-name-text').select2({data: places});
    }
    var markers = []

    for (i = 0; i < places.length; i++) {
        if (filter==null || places[i].id == filter) {
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
                populateInfo(this, largeInfoWindow)
            });
        }}
    map.fitBounds(bounds);

    function populateInfo(marker, infowindow){
        if(infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.marker.setAnimation(google.maps.Animation.BOUNCE);
            infowindow.setContent('<div>' + marker.title + '</div>');
            infowindow.open(map, marker);
            infowindow.addListener('closeclick', function() {
                infowindow.marker.setAnimation(null);
                console.log('shush');
                //infowindow.marker = null;
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
