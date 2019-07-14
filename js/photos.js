'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var WIDTH_PHOTO = 70;
  var HEIGHT_PHOTO = 70;
  var fileInput = document.querySelector('.ad-form__upload input[type=file]');
  var divPreview = document.querySelector('.ad-form__photo');
  var divParent = divPreview.parentNode;
  divPreview.remove();

  var dropZone = document.querySelector('.ad-form__drop-zone');

  var photoFiles = [];

  window.getPhotoFiles = function () {
    return photoFiles;
  };

  window.clearPhotoFiles = function () {
    photoFiles = [];
    var matches = document.querySelectorAll('.ad-form__photo');

    matches.forEach(function (div) {
      div.remove();
    });
  };

  fileInput.addEventListener('change', function () {
    showPreviewFiles(fileInput.files);
  });

  function showPreview(file) {
    function onLoad() {
      var div = divPreview.cloneNode();

      var img = document.createElement('img');
      img.width = WIDTH_PHOTO;
      img.height = HEIGHT_PHOTO;
      img.src = reader.result;

      div.appendChild(img);
      divParent.appendChild(div);

      reader.removeEventListener('load', onLoad);
      photoFiles.push(file);
    }

    if (file) {
      var fileName = file.name.toLowerCase();
      var reader = new FileReader();
      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        reader.addEventListener('load', onLoad, false);
        reader.readAsDataURL(file);
      }
    }
  }

  function showPreviewFiles(files) {
    window.clearPhotoFiles();

    for (var i = 0; i < files.length; i++) {
      showPreview(files[i]);
    }
  }

  function onPhotoDrag(evt) {
    evt.preventDefault();
  }

  function onPhotoDrop(evt) {
    evt.preventDefault();
    var file = null;

    if (evt.dataTransfer.items) {
      for (var i = 0; i < evt.dataTransfer.items.length; i++) {
        if (evt.dataTransfer.items[i].kind === 'file') {
          file = evt.dataTransfer.items[i].getAsFile();
          showPreview(file);
        }
      }
    } else {
      for (var j = 0; j < evt.dataTransfer.files.length; j++) {
        file = evt.dataTransfer.files[j];
        showPreview(file);
      }
    }
    removeDragData(evt);
  }

  function removeDragData(evt) {
    if (evt.dataTransfer.items) {
      evt.dataTransfer.items.clear();
    } else {
      evt.dataTransfer.clearData();
    }
  }

  dropZone.addEventListener('drop', onPhotoDrop, false);
  dropZone.addEventListener('dragover', onPhotoDrag, false);
})();
