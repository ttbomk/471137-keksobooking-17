'use strict';

var MAIN_PIN_WIDTH = 65 / 2;
var MAIN_PIN_HEIGHT = 65 / 2;

var MAIN_PIN_WIDTH_MOVE = MAIN_PIN_WIDTH;
var MAIN_PIN_HEIGHT_MOVE = 65 + 22;

var TYPES = [
  'Bungalo',
  'Flat',
  'House',
  'Palace'
];

var MIN_PRICES = {
  Bungalo: 0,
  Flat: 1000,
  House: 5000,
  Palace: 10000
};

var CONFIG = {
  width: {
    min: 0,
    max: 1200
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

var types = adForm.querySelector('#type');
var price = adForm.querySelector('#price');
var timeIn = adForm.querySelector('#timein');
var timeOut = adForm.querySelector('#timeout');

// При изменении поля select, изменять значение плэйсхолдера в поле price
// в соответствии с типом жилья
types.addEventListener('change', function () {
  var valueType = types.value;
  price.setAttribute('placeholder', MIN_PRICES[valueType]);
  price.setAttribute('min', MIN_PRICES[valueType]);
});

var onTimeChange = function (evt) {
  var select = evt.target === timeIn ? timeOut : timeIn;
  select.value = evt.target.value;
};

timeIn.addEventListener('change', onTimeChange);
timeOut.addEventListener('change', onTimeChange);

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

var setAddressValue = function (width, height) {
  var topMainPin = parseInt(mainPin.style.top, 10) + height;
  var leftMainPin = parseInt(mainPin.style.left, 10) + width;

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

// Коллбэк активации карты
var onActivatePage = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  setDisabled(mapFilters, true);
  setDisabled(fieldsetsForm, true);
  renderPins(generatePinsData());
};

mainPin.addEventListener('mousedown', function (evt) {
  evt.preventDefault();

  if (map.classList.contains('map--faded')) {
    onActivatePage();
  }

  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  // Функция перемещения главного пина по карте
  var moveMainPin = function (mouseEvt) {
    var shift = {
      x: startCoords.x - mouseEvt.clientX,
      y: startCoords.y - mouseEvt.clientY
    };

    startCoords = {
      x: mouseEvt.clientX,
      y: mouseEvt.clientY
    };

    var mainPinTop = mainPin.offsetTop - shift.y;
    var mainPinLeft = mainPin.offsetLeft - shift.x;

    if (mainPinTop > CONFIG.height.min - MAIN_PIN_HEIGHT_MOVE && mainPinTop < CONFIG.height.max) {
      mainPin.style.top = mainPinTop + 'px';
    }

    if (mainPinLeft > CONFIG.width.min - MAIN_PIN_WIDTH && mainPinLeft < map.offsetWidth - MAIN_PIN_WIDTH_MOVE) {
      mainPin.style.left = mainPinLeft + 'px';
    }
  };

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    moveMainPin(moveEvt);
    setAddressValue(MAIN_PIN_WIDTH_MOVE, MAIN_PIN_HEIGHT_MOVE);
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    moveMainPin(upEvt);
    setAddressValue(MAIN_PIN_WIDTH_MOVE, MAIN_PIN_HEIGHT_MOVE);

    mainPin.removeEventListener('mouseup', onActivatePage);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});

setDisabled(mapFilters, false);
setDisabled(fieldsetsForm, false);

setAddressValue(MAIN_PIN_WIDTH, MAIN_PIN_HEIGHT);
