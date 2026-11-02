import Choices from 'choices.js';
import flatpickr from 'flatpickr';
import noUiSlider from 'nouislider';
import Dropzone from 'dropzone';

// Advanced form plugins are headless; Hummingbird provides their styling.
// Initialization below mirrors the examples at https://hbui.dev/docs/forms/advanced-forms

const choicesInit = () => {
  const hbChoices = document.querySelectorAll('[data-choices="data-choices"]');
  if (hbChoices) {
    hbChoices.forEach((choice) => new Choices(choice, { removeItemButton: true }));
  }
};

const flatpickrInit = () => {
  flatpickr('#datepicker', { dateFormat: 'd-m-Y' });
  flatpickr('#timepicker', { enableTime: true, noCalendar: true, dateFormat: 'H:i' });
  flatpickr('#datetimepicker', { enableTime: true, dateFormat: 'd-m-Y H:i' });
  flatpickr('#rangepicker', { mode: 'range', dateFormat: 'd-m-Y' });
  flatpickr('#multiple-dates', { mode: 'multiple', dateFormat: 'd-m-Y' });
  flatpickr('#disabled-dates', {
    dateFormat: 'd-m-Y',
    disable: [
      function (date) {
        return date.getDay() === 5 || date.getDay() === 6;
      },
    ],
  });
  flatpickr('#highlight-weekend', {
    dateFormat: 'd-m-Y',
    onDayCreate: function (dObj, dStr, fp, dayElem) {
      const day = dayElem.dateObj.getDay();

      if (day === 5 || day === 6) {
        dayElem.classList.add('weekend-day');
      }
    },
  });
  flatpickr('#display-weeknumbers', { weekNumbers: true, dateFormat: 'd-m-Y' });
  flatpickr('#external-el', { wrap: true, dateFormat: 'd-m-Y' });
  flatpickr('#inline-calendar-el', {
    wrap: true,
    inline: true,
    appendTo: document.querySelector('#datepicker-inline'),
  });
};

const noUiSliderInit = () => {
  // Advance range slider
  const slider = document.querySelector('[data-nouislider="basic-example"]');

  if (slider) {
    noUiSlider.create(slider, {
      start: [20, 80],
      connect: true,
      range: {
        min: 0,
        max: 100,
      },
    });
  }

  const singleHandleSlider = document.querySelector('[data-nouislider="single-handle"]');

  if (singleHandleSlider) {
    noUiSlider.create(singleHandleSlider, {
      start: [20],
      connect: 'lower',
      range: {
        min: 0,
        max: 100,
      },
    });
  }

  const stepsSlider = document.querySelector('[data-nouislider="steps-slider"]');

  if (stepsSlider) {
    noUiSlider.create(stepsSlider, {
      start: [20, 80],
      connect: true,
      range: {
        min: 0,
        max: 100,
      },
      step: 10,
    });
  }

  const tooltipSlider = document.querySelector('[data-nouislider="with-tooltips"]');

  if (tooltipSlider) {
    noUiSlider.create(tooltipSlider, {
      start: [20, 80],
      connect: true,
      range: {
        min: 0,
        max: 100,
      },
      tooltips: true,
    });
  }

  const verticalSlider = document.querySelector('[data-nouislider="vertical-slider"]');

  if (verticalSlider) {
    noUiSlider.create(verticalSlider, {
      start: [20, 80],
      connect: true,
      range: {
        min: 0,
        max: 100,
      },
      tooltips: true,
      orientation: 'vertical',
    });
  }

  const disabledSlider = document.querySelector('[data-nouislider="disabled-slider"]');

  if (disabledSlider) {
    noUiSlider.create(disabledSlider, {
      start: [20, 80],
      connect: true,
      range: {
        min: 0,
        max: 100,
      },
    });
  }

  const pipsSlider = document.querySelector('[data-nouislider="pips-slider"]');

  if (pipsSlider) {
    if (pipsSlider) {
      noUiSlider.create(pipsSlider, {
        start: [100, 400],
        connect: true,
        range: {
          min: 0,
          max: 500,
        },
        tooltips: true,
        pips: {
          mode: 'count',
          values: 5,
        },
      });
    }
  }

  const colorSliders = document.querySelectorAll('[data-nouislider="color-slider"]');

  if (colorSliders) {
    if (colorSliders) {
      colorSliders.forEach((colorSlider) =>
        noUiSlider.create(colorSlider, {
          start: [20],
          connect: 'lower',
          range: {
            min: 0,
            max: 100,
          },
        }),
      );
    }
  }

  const sizeSliders = document.querySelectorAll('[data-nouislider="size-variant"]');
  if (sizeSliders) {
    sizeSliders.forEach((sizeSlider) => {
      noUiSlider.create(sizeSlider, {
        start: [20],
        connect: 'lower',
        range: {
          min: 0,
          max: 100,
        },
      });
    });
  }
};

const dropzoneInit = () => {
  // dropzone list preview
  const listPreviewsContainer = document.querySelector('[data-dz-preview="dz-list-preview"]');
  if (listPreviewsContainer) {
    const listPreviewTemplate = listPreviewsContainer.querySelector('.dz-preview-template');

    new Dropzone('[data-dropzone="dropzone-list-preview"]', {
      previewsContainer: listPreviewsContainer,
      previewTemplate: listPreviewTemplate.innerHTML,
    });
  }

  // dropzone thumbnail preview
  const thumbnailPreviewsContainer = document.querySelector('[data-dz-preview="dz-thumbnail-preview"]');

  if (thumbnailPreviewsContainer) {
    const thumbnailPreviewTemplate = thumbnailPreviewsContainer.querySelector('.dz-preview-template');

    new Dropzone('[data-dropzone="dropzone-thumbnail-preview"]', {
      previewsContainer: thumbnailPreviewsContainer,
      previewTemplate: thumbnailPreviewTemplate.innerHTML,
    });
  }

  // avatar dropzone
  const avatarDropzone = document.querySelector('[data-dropzone="dropzone-avatar"]');
  if (avatarDropzone) {
    new Dropzone(avatarDropzone, {
      maxFiles: 1,
      acceptedFiles: 'image/*',
      init: function () {
        this.on('maxfilesexceeded', function (file) {
          this.removeAllFiles();
          this.addFile(file);
        });
      },
    });
  }

  // file dropbox
  const dropboxPreviewsContainer = document.querySelector('[data-dz-preview="dz-dropbox-preview"]');
  if (dropboxPreviewsContainer) {
    const dropboxPreviewTemplate = dropboxPreviewsContainer.querySelector('.dz-preview-template');

    new Dropzone('[data-dropzone="file-dropbox"]', {
      previewsContainer: dropboxPreviewsContainer,
      previewTemplate: dropboxPreviewTemplate.innerHTML,
    });
  }

  // dropzone single
  const singlePreviewsContainer = document.querySelector('[data-dz-preview="dz-single-preview"]');
  if (singlePreviewsContainer) {
    const singlePreviewTemplate = singlePreviewsContainer.querySelector('.dz-preview-template');

    new Dropzone('[data-dropzone="dropzone-single"]', {
      previewsContainer: singlePreviewsContainer,
      previewTemplate: singlePreviewTemplate.innerHTML,
      maxFiles: 1,
      init: function () {
        this.on('maxfilesexceeded', function (file) {
          this.removeAllFiles();
          this.addFile(file);
        });
      },
    });
  }
};

choicesInit();
flatpickrInit();
noUiSliderInit();
dropzoneInit();
