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

main.on('click', 'down', function(e) {
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});

Pebble.addEventListener("appmessage",
  function(e) {
    // Event popup for testing purposes. Everything in this function is unecessary.
    var wind = new UI.Window({
    fullscreen: true,
    });
    var textfield = new UI.Text({
      position: new Vector2(0, 65),
      size: new Vector2(144, 30),
      font: 'gothic-24-bold',
      text: 'appmessage event listener',
      textAlign: 'center'
    });
    wind.add(textfield);
    wind.show();
  }
);