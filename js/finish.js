/* This is the final script called before loading.

Since the application depends on asyncrounous web data,
nothing is run until the data has a chance to be brought in.
*/

setTimeout( function() {
    //log when time out finishes.
    console.log('in finish')
    //build the knockout models defined in mod.js and only
    //then build the map on which the data will work.
    build_models (init_parks, initMap());
}, 850);
