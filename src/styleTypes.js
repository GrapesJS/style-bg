// Types for image background
export const typeBgKey = '__bg-type';

export const typeBg = {
  name: ' ',
  property: typeBgKey,
  type: 'radio',
  defaults: 'img',
  options: [
    { value: 'img' },
    { value: 'color' },
    { value: 'grad' },
  ],
};

export const typeImage = {
  property: 'background-image',
  type: 'file',
  functionName: 'url',
  defaults: 'none',
};

export const typeBgRepeat = {
  property: 'background-repeat',
  type: 'select',
  defaults: 'repeat',
  options: [
    { value: 'repeat' },
    { value: 'repeat-x' },
    { value: 'repeat-y' },
    { value: 'no-repeat' }
  ],
};

export const typeBgPos = {
  property: 'background-position',
  type: 'select',
  defaults: 'left top',
  options: [
    { value: 'left top' },
    { value: 'left center' },
    { value: 'left bottom' },
    { value: 'right top' },
    { value: 'right center' },
    { value: 'right bottom' },
    { value: 'center top' },
    { value: 'center center' },
    { value: 'center bottom' }
  ],
};

export const typeBgAttach = {
  property: 'background-attachment',
  type: 'select',
  defaults: 'scroll',
  options: [
    { value: 'scroll' },
    { value: 'fixed' },
    { value: 'local' }
  ],
};

export const typeBgSize = {
  property: 'background-size',
  type: 'select',
  defaults: 'auto',
  options: [
    { value: 'auto' },
    { value: 'cover' },
    { value: 'contain' }
  ],
};

// Linear color

export const typeColorLin = {
  property: 'background-image',
  type: 'color-linear',
  defaults: 'none',
  full: 1,
};

// Gradient type

export const typeGradient = {
  name: '&nbsp;',
  property: 'background-image',
  type: 'gradient',
  value: 'linear-gradient(90deg, red 0%, blue 100%)',
  defaults: 'none',
  full: 1,
};