'use strict';

var MAIN_PIN_WIDTH = 65 / 2;
var MAIN_PIN_HEIGHT = 65 / 2;

var TYPES = [
  'palace',
  'flat',
  'house',
  'bungalo'
];

var CONFIG = {
  width: {
    min: 0,
    max: 1130
  },
  height: {
    min: 130,
    max: 630
  }
};

var PINS_NUMBER = 8;

var map = document.querySelector('.map');
var mainPin = map.querySelector('.map__pin--main');
var adForm = document.querySelector('.ad-form');
var mapFilters = map.querySelectorAll('.map__filter');
var fieldsetsForm = document.querySelectorAll('fieldset');
var fieldAddress = document.querySelector('#address');

var similarListElement = map.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

var setDisabled = function (array, isDisabled) {
  for (var i = 0; i < array.length; i++) {
    if (isDisabled) {
      array[i].removeAttribute('disabled', '');
    } else {
      array[i].setAttribute('disabled', '');
    }
  }

  return array;
};

var setAddressValue = function () {
  var topMainPin = parseInt(mainPin.style.top, 10) + MAIN_PIN_HEIGHT;
  var leftMainPin = parseInt(mainPin.style.left, 10) + MAIN_PIN_WIDTH;

  fieldAddress.value = leftMainPin + ', ' + topMainPin;
};

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
        avatar: 'img/avatars/user0' + i + '.png'
      },
      offer: {
        type: getRandomElement(TYPES)
      },
      location: {
        x: getRandomNumber(CONFIG.width.min, CONFIG.width.max),
        y: getRandomNumber(CONFIG.height.min, CONFIG.height.max)
      }
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

function onMapPinMainClick() {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');

  setDisabled(mapFilters, true);
  setDisabled(fieldsetsForm, true);

  renderPins(generatePinsData());

  mainPin.removeEventListener('click', onMapPinMainClick);
}

mainPin.addEventListener('click', onMapPinMainClick);

setDisabled(mapFilters, false);
setDisabled(fieldsetsForm, false);

setAddressValue();
