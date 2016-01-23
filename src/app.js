/**
 * Breadcrumbs
 * By Calla and Sammo
 * Breadcrumbs revolutionizes the lowly walk. For too long, people have started out walking in
 * strange places, seeing wondrous sights, never to find them again. But no longer. With breadcrumbs,
 * YOU choose the route, not Google, not Siri, but you. And Breadcrumbs acts as you cartographer: not
 * only does it remember your route, but it remembers things that caught your interest, and reminds 
 * you to find that little gem of a shop again, that quaint museum, that delectable delicatessan. You
 * can even share your opinions of these byways with other users of breadcrumbs, and indeed, the world. 
 * So fear no longer -- march forth, and know that your route will not be lost to the sands of time.
 */

var UI = require('ui');
var Vector2 = require('vector2');

// Mode
var layBread = false; // Lays bread by default once target location is set. When false, follows bread crumbs.

// Important locations
var currentLocation;
var prevLocation;
var targetLocation;

var crumbs;
var save;

var main = new UI.Card({
  title: 'Pebble.js',
  icon: 'images/menu_icon.png',
  subtitle: 'Hello World!',
  body: 'Press any button.',
  subtitleColor: 'indigo', // Named colors
  bodyColor: '#9a0036' // Hex colors
});

main.show();

main.on('click', 'up', function(e) {
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

function dist(){
  if(layBread){
    setCurrentLocation();
    if(currentLocation - prevLocation > 5){
      dist();
    }
    else{
      crumbs.add(prevLocation);
      prevLocation = currentLocation;      
    }
  }
  else{
    recoverCrumbs();
  }
}

function recoverCrumbs(){
  var savCard = new UI.Card();
  savCard.title("Do you want to save this route?");
  savCard.subtitle("Press the top button for yes.");
  main.on('click', 'up', function(e){
          for(var i=0; i<crumbs.size(); i++){
            save.add(crumbs.get(i));
          }
          });
  pointTo(crumbs.get(crumbs.size()-1));
  crumbs.remove(crumbs.size()-1);  
}

function pointTo(pos){
  setCurrentLocation();
  //compute direction to walk by comparing currentLocation to pos
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
  
}

main.on('click', 'down', function(e) {
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});

Pebble.addEventListener("appmessage",
  function(e) {
    // Temporarily set current location at bootup
    setCurrentLocation();
    // Sets currentLocation as current location, set layBread to true
    // When user long clicks, call setTargetLocation()
  }
);

var locationOptions = {
  //enableHighAccuracy: true, 
  maximumAge: 10000, 
  timeout: 10000
};

function locationSuccess(pos) {
  console.log('lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude);
}

function locationError(err) {
  console.log('location error (' + err.code + '): ' + err.message);
}

function setCurrentLocation() {
  currentLocation = navigator.geolocation.getCurrentPosition(
    locationSuccess, locationError, locationOptions);
}
main.on('longClick', 'select', function(e) {
  var card = new UI.Card();
  card.title('Calculating...');
  card.subtitle('Setting Target Location');
  card.show();
  setTargetLocation();
  layBread = true;
});

function setTargetLocation() {
  setCurrentLocation();
  targetLocation = currentLocation;
}