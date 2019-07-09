'use strict';

var TYPES = [
  'palace',
  'flat',
  'house',
  'bungalo',
];

var PINS_NUMBER = 8;

var map = document.querySelector('.map');
var similarListElement = map.querySelector('.map__pins');

var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var getRandomElement = function (array) {
  return array[getRandomNumber(0, array.length)];
};

var generatePinsData = function () {
  var pins = [];

  for (var i = 1; i <= PINS_NUMBER; i++) {
    pins.push({
      author: {
        avatar: 'img/avatars/user0' + i + '.png',
      },
      offer: {
        type: getRandomElement(TYPES),
      },
      location: {
        x: getRandomNumber(0, 1200),
        y: getRandomNumber(130, 630),
      },
    });
  }

  return pins;
};

var renderPin = function (pin) {
  var pinElement = pinTemplate.cloneNode(true);
  var img = pinElement.querySelector('img');

  img.setAttribute('src', pin.author.avatar);
  img.setAttribute('alt', 'Заголовок объявления');
  pinElement.style.left = pin.location.x + 'px';
  pinElement.style.top = pin.location.y + 'px';

  return pinElement;
};

var renderPins = function (array) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < array.length; i++) {
    fragment.appendChild(renderPin(array[i]));
  }
  similarListElement.appendChild(fragment);
};

renderPins(generatePinsData());

map.classList.remove('map--faded');
