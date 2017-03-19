init_parks = [
    {id:1, position:{lat: 39.6984, lng: -104.9652}, text:'Wash Park'},
    {id:2, position:{lat: 39.6757, lng: -104.9530}, text:'O Park'},
    {id:3, position:{lat: 39.7459, lng: -104.9476}, text:'City Park'},
    {id:4, position:{lat: 39.7335, lng: -104.9652}, text:'Cheeseman Park'},
    {id:5, position:{lat: 39.7364, lng: -105.0317}, text:'Paco Sanchez Park'},
    {id:6, position:{lat: 39.7014, lng: -105.0937}, text:'Belmar Park'}
]


function get_weather (park_no_weather) {
    var wu_call = 'http://api.wunderground.com/api/'+config.wu_key+'/conditions/q/';
    full_call = wu_call + park_no_weather.position.lat.toString() + ','
                + park_no_weather.position.lng.toString() + '.json'
    console.log(full_call)
    $.ajax({
      url: full_call,
      method: 'GET',
      crossDomain: true
    }).done(function(result) {
      //return stuff
     console.log('got weather !')
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

function get_all_the_weather (places) {
    for (i = 0; i < places.length; i ++ ){
        get_weather(places[i]);
    }
    console.log('heyyyyy')
}
console.log('parks has weather??');
get_all_the_weather(init_parks);
console.log(init_parks);
////////////////////////////////////////////
function build_models (raw_data) {
    console.log('build_models');

    var ViewModel = function() {
        var self = this;

        this.parks = ko.observableArray([]);

        raw_data.forEach(function(park_raw){
            //console.log('in the for each')
            //console.log(park_raw);
            self.parks.push(new Arena(park_raw));
        })
        // console.log('teh parks')
        // console.log(self.parks()[0])

        this.getPark = function(id) {
            return self.parks()[id].position().lat
        }

        this.incrementCounter = function () {
            this.clickCount(this.clickCount() + 1);
        }
    };

    ko.applyBindings(new ViewModel())

    function Arena(data) {
        console.log('inconstructor')
        console.log(data.weather)
        this.id = ko.observable(data.id);
        this.lat = ko.observable(data.position.lat);
        this.lng = ko.observable(data.position.lng);
        this.name = ko.observable(data.text);
        this.temp = ko.observable(data.weather.tempature);
        this.conditionIco = ko.observable(data.weather.condition_ico);
        this.wind = ko.observable(data.weather.wind);
    }
};

// park_no_weather["weather"] = {
//       "tempature"        :result["current_observation"]["temp_f"],
//       "condition"        :result["current_observation"]["weather"],
//       "condition_ico"    :result["current_observation"]["icon_url"],
//       "wind"             :result["current_observation"]["wind_mph"]
//  }
