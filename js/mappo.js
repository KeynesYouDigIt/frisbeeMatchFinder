/* Second script loaded.

This script draws in all Google maps data and creates a map. it
does so mostly sticking to the pattern in the Google maps examples
in the lessons. As stated in the rubric -

Knockout should not be used to handle the Google Map API.

*/

function initMap(filter = null) {
    // not called until final.js when the data is complete

    // grab the raw parks data as an array
    var places = init_parks;
    /// Set to a var here so init_parks can be changed in the
    /// other script and remain decoupled.
    /// if init_parks changes to a different array of data
    /// like something pulled from an ORM, just change this var.

    // Log that init map has been called
    // and generate map, bounds, InfoWindow.
    console.log('its the map man')
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        center: {lat: 40.7413, lng: -74.998}
    });
    var largeInfoWindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

    // Select2 is a natural library for using arrays to make
    // good looking selectable filters. populating the select
    if (!$('#park-name-text').select2().val()) {
        // make sure the dropdown filter is actually empty
        // to avoid redundant data.
        console.log('populating filters')
        $('#park-name-text').select2({data: places});
    }

    // Prepare and empty array for the map markers
    var markers = []

    for (i = 0; i < places.length; i++) {
        if (filter==null || places[i].id() == filter) {
            // First check if there is a filter, if there isnt
            // make sure everything is displayed.
            // If there is, check the filter for which Park the
            // user needs displayed.

            // init and add mark(s) to the array
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
            })}};

    // the markers array is set up as needed,
    // expand the map acordingly.
    map.fitBounds(bounds);

    function populateInfo(marker, infowindow) {
        // this function adds the info needed to the info window
        // and makes the markers react accordingly.

        // first, get the ko observable element of the clicked park by
        // looking for the park title in the id.
        var clickedParkTitle = document.getElementById(marker.title);
        // then set class to open to bring the info forward
        clickedParkTitle.classList.toggle('park-info-open');

        // make sure info window marker is the marker clicked and animate
        // the marker
        infowindow.marker = marker;
        infowindow.marker.setAnimation(google.maps.Animation.BOUNCE);
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);

        //add a listner for when the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker.setAnimation(null);
            // after deanimating the marker, get the ko observable element
            // and send if off screen again, the user is done with this info.
            var clickedParkTitle = document.getElementById(infowindow.marker.title)
            clickedParkTitle.classList.remove('park-info-open');
        });
    };

    //the eblow gets a submitted filter and sets up the map accordingly.
    document.getElementById('park-name-sub').addEventListener('click', function() {
        initMap(filter=document.getElementById('park-name-text').value);
    });
};
