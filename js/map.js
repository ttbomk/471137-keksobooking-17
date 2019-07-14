'use strict';

(function () {
  var Y_MIN = 130;
  var Y_MAX = 630;
  var PINS_NUMBER = 5;

  var pins = document.querySelector('.map__pins');
  var pinMain = document.querySelector('.map__pin--main');
  var adressPinMain = parseInt(pinMain.style.left, 10) + ', ' + parseInt(pinMain.style.top, 10);
  var mainPinEnable = true;
  var pinMainDefaultLeft = parseInt(pinMain.style.left, 10);
  var pinMainDefaultTop = parseInt(pinMain.style.top, 10);
  var input = document.querySelector('#address');

  // кнопка очистить
  var buttonReset = document.querySelector('.ad-form__reset');

  // функция добавляет адрес map__pin в инпут адреc
  function fillInputAddress() {
    input.value = adressPinMain;
  }

  window.removePins = function () {
    var pinOther = document.querySelectorAll('.pinOther');
    if (pinOther) {
      pinOther.forEach(function (item) {
        item.remove();
      });
    }
  };

  window.clearPins = function () {
    window.card.closeCard();
    window.removePins();
    window.avatar.clearAvatarFile();
    window.clearPhotoFiles();
    mainPinEnable = true;
    pinMain.focus();
    pinMain.style.left = pinMainDefaultLeft + 'px';
    pinMain.style.top = pinMainDefaultTop + 'px';
    adressPinMain = pinMainDefaultLeft + ', ' + pinMainDefaultTop;
    fillInputAddress();
    window.blockPage();
    document.querySelector('.map').classList.add('map--faded');
  };

  function onPinMove(evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var dragged = false;

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var mapWidth = document.querySelector('.map__pins').clientWidth;
      var pinWidth = pinMain.offsetWidth;

      if (pinMain.offsetLeft - shift.x < 0) {
        shift.x = pinMain.offsetLeft;
      } else if (pinMain.offsetLeft - shift.x > mapWidth - pinWidth) {
        shift.x = pinMain.offsetLeft - (mapWidth - pinWidth);
      }

      if (pinMain.offsetTop - shift.y < Y_MIN) {
        shift.y = pinMain.offsetTop - Y_MIN;
      } else if (pinMain.offsetTop - shift.y > Y_MAX) {
        shift.y = pinMain.offsetTop - Y_MAX;
      }

      pinMain.style.left = (pinMain.offsetLeft - shift.x) + 'px';
      pinMain.style.top = (pinMain.offsetTop - shift.y) + 'px';

      adressPinMain = parseInt(pinMain.style.left, 10) + ', ' + parseInt(pinMain.style.top, 10);
      fillInputAddress();
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      function onClickPreventDefault() {
        evt.preventDefault();
        pinMain.removeEventListener('click', onClickPreventDefault);
      }
      if (dragged) {
        pinMain.addEventListener('click', onClickPreventDefault);
      }
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  window.placePins = function () {
    if (mainPinEnable) {
      mainPinEnable = false;

      var ads = window.getAds();
      document.querySelector('.map').classList.remove('map--faded');
      document.querySelector('.map__filters').classList.remove('ad-form--disabled');
      document.querySelector('.ad-form').classList.remove('ad-form--disabled');
      window.avatarForm.removeAttribute('disabled', 'disabled');
      document.querySelector('.map__features').removeAttribute('disabled', 'disabled');
      window.formFilter.forEach(function (item) {
        item.removeAttribute('disabled', 'disabled');
      });
      window.formFields.forEach(function (item) {
        item.removeAttribute('disabled', 'disabled');
      });
      fillInputAddress();

      var pinsFragment = document.createDocumentFragment();
      var pinNumber = 0;

      for (var i = 0; i < ads.length; i++) {
        if (window.adFilter.choose(ads[i])) {
          pinsFragment.appendChild(window.renderPin(ads[i]));
          pinNumber++;
          if (pinNumber >= PINS_NUMBER) {
            break;
          }
        }
      }

      if (pinsFragment.length !== 0) {
        pins.appendChild(pinsFragment);
      }
    }
  };

  // перемещение главного маркера
  pinMain.addEventListener('mousedown', onPinMove);

  // клик на кнопку очистить
  window.utils.addClickListener(buttonReset, window.clearPins);

  // нажатие на главную метку - страница в активном состоянии
  window.utils.addClickListener(pinMain, window.placePins);

  pinMain.focus();
})();
