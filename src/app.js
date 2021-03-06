/**
 * Breadcrumbs
 * By Calla and Sammo
 * Breadcrumbs revolutionizes the lowly walk. For too long, people have started out walking in
 * strange places, seeing wondrous sights, never to find them again. But no longer. With breadcrumbs,
 * YOU choose the route, not Google, not Siri, nor anyone or anything else. And Breadcrumbs acts as your
 * cartographer: not only does it remember your route, but it remembers things that caught your interest,
 * and reminds you to find that little gem of a shop again, that quaint museum, that delectable delicatessan.
 * Eventually, it might even incorporate a camera for transient things of interest, such as flowers that might
 * disappear soon, but you might want to look for in the future in the same place or identify later.
 * You can even share your opinions of these byways with other users of breadcrumbs, and indeed, the world. 
 * So fear no longer -- march forth, and know that your route will not be lost to the sands of time, unless
 * you wish it to be.
 */

var UI = require('ui');
var Vector2 = require('vector2');

// Mode
var layBread; // Lays bread by default once target location is set. When false, follows bread crumbs.

// Important locations
var currentLocation = {};
var prevLocation = {};
var targetLocation;

var crumbs = [];
var save = [];


  var card = new UI.Card();

var main = new UI.Card({
  title: 'Pebble.js',
  icon: 'images/menu_icon.png',
  subtitle: 'Revolutionizing the walk',
  body: 'Hold down the middle button for two seconds to start your walk',
  subtitleColor: 'indigo', // Named colors
  bodyColor: '#9a0036' // Hex colors
});

main.show();

main.on('click', 'up', function(e) {
  card.hide();
  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Pebble.js',
        icon: 'images/menu_icon.png',
        subtitle: 'Can do Menus'
      }, {
        title: 'Second Item',
        subtitle: 'Subtitle Text'
      }]
    }]
  });
  menu.on('select', function(e) {
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
  });
  menu.show();
});

main.on('click', 'select', function(e) {
  card.hide();
  var wind = new UI.Window({
    fullscreen: true,
  });
  var textfield = new UI.Text({
    position: new Vector2(0, 65),
    size: new Vector2(144, 30),
    font: 'gothic-24-bold',
    text: 'Text Anywhere!',
    textAlign: 'center'
  });
  wind.add(textfield);
  wind.show();
});

// Decides whether or not to drop a breadcrumb based on user distance (from last
// breadcrumb) and direction.
function dist() {
  if(layBread){
    setCurrentLocation();
    var R = 20903520; // Earth's radius in feet
    var φ1 = prevLocation.coords.latitude.toRadians();
    var φ2 = currentLocation.coords.latitude.toRadians();
    var Δφ = φ1 - φ2;
    var Δλ = (prevLocation.coords.longitude - currentLocation.coords.longitude).toRadians();

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;
    if(Math.abs(d) > 5){
      return;
    }
    else{
      crumbs.push(prevLocation);
      prevLocation = currentLocation;
    }
  }
  else{
    recoverCrumbs();
  }
}

// Once mode has been changed to the return trip, prepares return path
function recoverCrumbs(){
  card.hide();
  var savCard = new UI.Card();
  savCard.title("Do you want to save this route?");
  savCard.subtitle("Press the top button for yes.");
  main.on('click', 'up', function(e) {
          for(var i = 0; i < crumbs.size(); i++){
            save.push(crumbs[i]);
          }
          });
  var cur = crumbs.pop();
  pointTo(cur);
}

function pointTo(pos){
  setCurrentLocation();
  // Compute direction to walk by comparing currentLocation to pos
  //var latDiff = pos.coords.latitude - currentLocation.coords.latitude;
  var longDiff = pos.coords.longitude - currentLocation.coords.longitude;
  var y = Math.sin(longDiff) * Math.cos(pos.coords.latitude);
  var x = Math.cos(currentLocation.coords.latitude)*Math.sin(pos.coords.latitude) -
        Math.sin(currentLocation.coords.latitude)*Math.cos(pos.coords.latitude)*Math.cos(longDiff);
  var ang = Math.atan2(y, x).toDegrees();
  var brng = (ang+180)%360;
  drawPointer(brng);
}

function drawPointer(bearing){
  //Draw a point inscribed in a circle indicating in which direction travel should occur
  var wind = new UI.Window();
  var circle = new UI.Circle({
    position: new Vector2(wind.width/2, wind.height/2),
    radius: Math.min(wind.width/2, wind.height/2),
    backgroundColor: 'clear',
    borderColor: 'white',
  });
  wind.add(circle);
  wind.show(circle);
  
  var point = new UI.Circle({
    position: new Vector2(wind.width / 2 + (Math.cos(bearing) * circle.radius), 
                          wind.height / 2 + (Math.sin(bearing) * circle.radius)),
    radius: 5,
    backgroundColor: 'clear',
    borderColor: 'white',
  });
  wind.add(point);
  wind.show(point);
}

main.on('click', 'down', function(e) {
  card.hide();
  //var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});

Pebble.addEventListener("appmessage",
  function(e) {
    // Temporarily set current location at bootup
    setCurrentLocation();
    dist();
    // Sets currentLocation as current location, set layBread to true
    // When user long clicks, call setTargetLocation()
  }
);

var locationOptions = {
  enableHighAccuracy: true, 
  maximumAge: 10000, 
  timeout: 10000
};

function locationSuccess(pos) {
  card.hide();
  console.log('lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude);
  // Printing out new location
 // var card1 = new UI.Card();
  card.body(pos.coords.latitude + ', ' + pos.coords.longitude);
  card.show();
  
}

function locationError(err) {
  console.log('location error (' + err.code + '): ' + err.message);
}

function setCurrentLocation() {
  currentLocation = navigator.geolocation.getCurrentPosition(
    locationSuccess, locationError, locationOptions);
  
}

main.on('longClick', 'select', function(e) {
  card.hide();
  //var card = new UI.Card();
  card.title('Calculating...');
  //card.subtitle('Setting Location');
  card.show();
  setTargetLocation();
  layBread = true;
});

main.on('longClick', 'up', function(e) {
  card.hide();
  console.log('up was longclicked ice cream');
  //var card2 = new UI.Card();
  card.title('Following breadcrumbs');
  card.show();
  layBread = false;
});

function setTargetLocation() {
  setCurrentLocation();
  targetLocation = currentLocation;
}