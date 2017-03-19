var ViewModel = function() {

    //this.currentArena = ko.observable( new Arena() );

    this.incrementCounter = function () {
        this.clickCount(this.clickCount() + 1);
    }

}

ko.applyBindings(new ViewModel())

function Arena(data) {
    this.clickCount = ko.observable(0);
    this.id = ko.observable(data.id);
    this.position = ko.observable(data.position);
    this.text = ko.observable(data.name);

    wu_call = 'http://api.wunderground.com/api/'+config.wu_key+'/hourly/q/37.776289,-122.395234.json'
    console.log(wu_call)

    this.level = ko.computed(function() {
        if (this.clickCount() == 0) {
            return "doggo is fetus"
        } else if (this.clickCount() >= 1 && this.clickCount() < 5) {
            return "N00biie"
        } else if (this.clickCount() >= 5 && this.clickCount() < 15) {
            return "pupper"
        } else if (this.clickCount() >= 15) {
            return "MASTER DOGGO"
        } else if (this.clickCount() < 0) {
            return "MASTER H4X0R"
        }
    }, this);
}
