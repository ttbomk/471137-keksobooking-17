'use strict';

(function () {
  var ENTER_KEYCODE = 13;

  window.util = {
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === ENTER_KEYCODE) {
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
