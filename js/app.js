var ViewModel = function() {

    this.currentDoggo = ko.observable( new Doggo() );

    this.incrementCounter = function () {
        this.clickCount(this.clickCount() + 1);
    }

}

ko.applyBindings(new ViewModel())


function Doggo() {
    this.clickCount = ko.observable(0);
    this.name = ko.observable('tabby');
    this.imgSrc = ko.observable('img/BREAKtabby.jpg');
    this.imgSauce = ko.observable('https://i.ytimg.com/vi/b9q6X0RARtk/maxresdefault.jpg');

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
