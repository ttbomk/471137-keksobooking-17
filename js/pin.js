'use strict';

(function () {
  var similarListElement = document.querySelector('.map__pins');
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  var renderPin = function (pin) {
    var pinElement = pinTemplate.cloneNode(true);
    var img = pinElement.querySelector('img');

    img.setAttribute('src', pin.author.avatar);
    img.setAttribute('alt', 'Заголовок объявления');
    pinElement.style.left = pin.location.x + 'px';
    pinElement.style.top = pin.location.y + 'px';

    return pinElement;
  };

  window.pin = {
    generatePinsData: function () {
      var pins = [];

      for (var i = 1; i <= window.data.PINS_NUMBER; i++) {
        pins.push({
          author: {
            avatar: 'img/avatars/user0' + i + '.png',
          },
          offer: {
            type: window.util.getRandomElement(window.data.TYPES),
          },
          location: {
            x: window.util.getRandomNumber(window.data.CONFIG.width.min, window.data.CONFIG.width.max),
            y: window.util.getRandomNumber(window.data.CONFIG.height.min, window.data.CONFIG.height.max),
          },
        });
      }

      return pins;
    },
    renderPins: function (array) {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < array.length; i++) {
        fragment.appendChild(renderPin(array[i]));
      }
      similarListElement.appendChild(fragment);
    },
  };
})();
