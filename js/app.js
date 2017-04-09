// This is just sample data I hard coded. In production, it would be
// scraped, saved, and ETL'd by a server side service.

// This data does not have weather binded to it yet, that is what the first
// function does.


var init_parks = [
    {id:1, position:{lat: 39.6984, lng: -104.9652}, text:'Wash Park'},
    {id:2, position:{lat: 39.6757, lng: -104.9530}, text:'O Park'},
    {id:3, position:{lat: 39.7459, lng: -104.9476}, text:'City Park'},
    {id:4, position:{lat: 39.7335, lng: -104.9652}, text:'Cheeseman Park'},
    {id:5, position:{lat: 39.7364, lng: -105.0317}, text:'Paco Sanchez Park'},
    {id:6, position:{lat: 39.7014, lng: -105.0937}, text:'Belmar Park'}
];

function initMap() {
     // code here
     // not called until final.js when the data is complete
     var filter = null
     // grab the raw parks data as an array
     var places = init_parks;
     // Log that init map has been called
     // and generate map, bounds, InfoWindow.
     console.log('its the map man')
     var map = new google.maps.Map(document.getElementById('map'), {
         zoom: 10,
         center: {lat: 40.7413, lng: -74.998}
     });

     var largeInfoWindow = new google.maps.InfoWindow();
     var bounds = new google.maps.LatLngBounds();

     // Prepare and empty array for the map markers
     var markers = []

     for (i = 0; i < places.length; i++) {
             // First check if there is a filter, if there isnt
             // make sure everything is displayed.
             // If there is, check the filter for which Park the
             // user needs displayed.

             // init and add mark(s) to the array
             var mark = new google.maps.Marker({
                 position: places[i].position,
                 map: map,
                 title:places[i].text,
                 park_id: places[i].id,
                 icon: 'http://www.space-invaders.com/static/img/buttons/favicon.ico'
             });
             init_parks[i].markOnMap = mark;
             mark.window = largeInfoWindow;
             markers.push(mark);
             bounds.extend(mark.position);
             mark.addListener('click', function() {
                 populateInfo(this, largeInfoWindow);
             })};

    console.log('init_parks')
    console.log(init_parks)

     // the markers array is set up as needed,
     // expand the map acordingly.
     map.fitBounds(bounds);

     vem = new ViewModel()
     ko.applyBindings(vem)
     console.log('building ko models');
};


function populateInfo(marker, infowindow) {
    // this function adds the info needed to the info window
    // and makes the markers react accordingly.


    // handle park info
    ///!! illegal dom
    google_mark_already_open = document.getElementsByClassName('park-info-open')[0]
    console.log(google_mark_already_open)
    if (google_mark_already_open != null) {
        infowindow.marker.setAnimation(null)
        google_mark_already_open.classList.remove('park-info-open')
        vem.activeInfoWindow.close()
    };

    ///!! llegal dom
    var clickedParkTitle = document.getElementById(marker.title);
    // then set class to open to bring the info forward
    clickedParkTitle.classList.toggle('park-info-open');


    // make sure info window marker is the marker clicked and animate
    // the marker
    infowindow.marker = marker;

    //attach info window to view model to interact properly with KO models
    vem.activeInfoWindow = infowindow;
    console.log('infowindowline98')
    console.log(infowindow.marker)
    infowindow.marker.setAnimation(google.maps.Animation.BOUNCE);
    infowindow.setContent('<div>' + marker.title + '</div>');
    infowindow.open(map, marker);

    //add a listner for when the infowindow is closed.
    infowindow.addListener('closeclick', function() {
        marker.setAnimation(null)
        // then set class to open to bring the info forward
        clickedParkTitle.classList.remove('park-info-open');
        infowindow.close()
    });
};


var ViewModel = function() {
    var self = this;
    // the ViewModel will end up with an array of ko models with the
    // needed observables.
    this.parks = ko.observableArray([]);

    self.selectedPark = ko.observable();

    var largeInfoWindow = new google.maps.InfoWindow();

    self.closeMe = function (park) {
                                    var clickedParkTitle = document.getElementById(park.name());
                                    // then set class to open to bring the info forward
                                    clickedParkTitle.classList.remove('park-info-open');
                                    park.markOnMap().setAnimation(null);
                                    // check both the info window with the marker data and
                                    // OR an infowindow that may have been populated with an earlier
                                    // selection and close
                                    vem.activeInfoWindow.close()
                                    //largeInfoWindow.close();
                                };

    self.filterParks = function() {
                                    console.log(this.selectedPark())
                                    var selectedId = this.selectedPark().id();
                                    var parks = this.parks();
                                    populateInfo(this.selectedPark().markOnMap(), largeInfoWindow)

                                    for (i=0; i < parks.length; i++) {
                                        parks[i].markOnMap().setVisible(true);
                                            if (parks[i].id() != selectedId) {
                                                parks[i].markOnMap().setVisible(false);
                                            }
                                        }
                                    };

    self.clearFilter = function () {
                                    self.closeMe(this.selectedPark())
                                    console.log(this.selectedPark())
                                    var parks = this.parks();
                                    for (i=0; i < parks.length; i++) {
                                                parks[i].markOnMap().setVisible(true);
                                            }
                                    };


    init_parks.forEach( function(park_raw) {
                                            // build the ko arena model and push to the parks array.
                                            var thePark = new Arena(park_raw);
                                            self.parks.push(thePark)
                                            //console.log(thePark.markOnMap());
                                            //console.log(thePark.weather())
                                        });
};

function Arena(dat) {
    this.id = ko.observable(dat.id);
    this.lat = ko.observable(dat.position.lat);
    this.lng = ko.observable(dat.position.lng);
    this.markOnMap = ko.observable(dat.markOnMap);

    this.name = ko.observable(dat.text);

    this.weather = ko.observable(['fetching weather...']);

    this.error = 'An error has been encountered getting weather data, please refresh the page or try again later.'

    ko.computed( function() {
            var OW_call = 'http://api.openweathermap.org/data/2.5/weather' +
            '?lat=' + this.lat().toString() +
            '&lon=' + this.lng().toString() +
            '&units=imperial&appid=' + config.ow_key
        $.ajax({
          url: OW_call,
          method: 'GET',
          crossDomain: true,
          dataFilter: function(data) {
                      var data = JSON.parse(data);
                      delete data.redirect;
                      var detailData = [data.main.temp + ' degrees F ',
                                'Wind speed - ' + data.wind.speed + ' MPH'];
                      return JSON.stringify(detailData);
                  },
        success: this.weather
    }).fail( function (err) {
        console.log('Full error for developers')
        console.log(err)
    })
  }, this);
};
