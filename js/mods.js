/* Fist script loaded.

This generates the models and preps them, with none of the data to
actually be displayed until selected on the map.

The actual "arena" (park for playing frisbee) constructor isnt defined until
the end of the script, most of which is populating and organnizing data
*/

// This is just sample data I hard coded. In production, it would be
// scraped, saved, and ETL'd by a server side service.

// This data does not have weather binded to it yet, that is what the first
// function does.
init_parks = [
    {id:1, position:{lat: 39.6984, lng: -104.9652}, text:'Wash Park'},
    {id:2, position:{lat: 39.6757, lng: -104.9530}, text:'O Park'},
    {id:3, position:{lat: 39.7459, lng: -104.9476}, text:'City Park'},
    {id:4, position:{lat: 39.7335, lng: -104.9652}, text:'Cheeseman Park'},
    {id:5, position:{lat: 39.7364, lng: -105.0317}, text:'Paco Sanchez Park'},
    {id:6, position:{lat: 39.7014, lng: -105.0937}, text:'Belmar Park'}
]

// now that we have sample data with locaion, get and bind weather data.
function get_weather (park_no_weather) {
    // this function gets current weather on a single location (or "park")

    // Set up the api call with no parameters, decoupled from the parameters
    // coming from the data. Key should be defined in keys.js
    var wu_call = 'http://api.wunderground.com/api/' + config.wu_key
    + '/conditions/q/';

    // add location parameters and indicate a json response
    var full_call = wu_call + park_no_weather.position.lat.toString() + ','
                + park_no_weather.position.lng.toString() + '.json'

    $.ajax({
      url: full_call,
      method: 'GET',
      crossDomain: true
    }).done(function(result) {
        // Once the call is finished and successful, bind weather data
        // to the park.
        park_no_weather["weather"] = {
               "tempature"        :result["current_observation"]["temp_f"],
               "condition"        :result["current_observation"]["weather"],
               "condition_ico"    :result["current_observation"]["icon_url"],
               "wind"             :result["current_observation"]["wind_mph"]
          }
    }).error(function(err) {
        throw err;
    });
}

function get_all_the_weather (parks) {
    // This function simply iterates over an array of parks getting and adding
    // the weather data. Defining a function to do this gives some flexibility
    // over when the weather data is retrieved, and decouples this chore
    // from the rest of the app.
    for (i = 0; i < parks.length; i ++ ){
        get_weather(parks[i]);
    }
};

function build_models (raw_data) {
    // This function, also called in finish.js, builds out ko models to be
    // used on the page when markers are selected.
    // raw data is a variable containing an array of parks, passed this way
    // to decouple the build from any particular data (like our sample data)

    // log when the build is occurring
    console.log('building ko models');

    var ViewModel = function() {
        var self = this;

        // the ViewModel will end up with an array of ko models with the
        // needed observables.
        this.parks = ko.observableArray([]);

        raw_data.forEach(function(park_raw){
            // build the ko model and push to the parks array.
            self.parks.push(new Arena(park_raw));
        })
    };

    ko.applyBindings(new ViewModel())

    function Arena(data) {
        this.id = ko.observable(data.id);
        // observables are easiest to work with when isolated to singe values,
        // so data that is stored in a nested obect is seperated out here and
        // in line 102
        this.lat = ko.observable(data.position.lat);
        this.lng = ko.observable(data.position.lng);

        this.name = ko.observable(data.text);

        // see above comment line 94
        this.temp = ko.observable(data.weather.tempature);
        this.conditionIco = ko.observable(data.weather.condition_ico);
        this.wind = ko.observable(data.weather.wind);
    }
};
