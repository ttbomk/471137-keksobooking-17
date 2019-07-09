'use strict';

(function () {
  var KeyCodes = {
    ENTER: 13,
    ESC: 27
  };

  window.util = {
    KeyCodes: KeyCodes,
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === KeyCodes.ENTER) {
        action();
      }
    },
    getRandomNumber: function (min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },
    getRandomElement: function (array) {
      return array[this.getRandomNumber(0, array.length)];
    },
    setDisabled: function (array, isDisabled) {
      for (var i = 0; i < array.length; i++) {
        if (isDisabled) {
          array[i].removeAttribute('disabled', '');
        } else {
          array[i].setAttribute('disabled', '');
        }
      }

      return array;
    }
  };
})();
