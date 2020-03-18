// Types for image background
import { typeBgKey } from './utils';

const  bgTypeStyle = 'style="max-height: 16px; display: block" viewBox="0 0 24 24"';

export const typeBg = {
  name: ' ',
  property: typeBgKey,
  type: 'radio',
  defaults: 'img',
  options: [
    { value: 'img', name: `<svg ${bgTypeStyle}><path fill="currentColor" d="M8.5 13.5l2.5 3 3.5-4.5 4.5 6H5m16 1V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2z"/></svg>` },
    { value: 'color', name: `<svg ${bgTypeStyle}><path fill="currentColor" d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z"/></svg>` },
    { value: 'grad', name: `<svg ${bgTypeStyle}><path fill="currentColor" d="M11 9h2v2h-2V9m-2 2h2v2H9v-2m4 0h2v2h-2v-2m2-2h2v2h-2V9M7 9h2v2H7V9m12-6H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2M9 18H7v-2h2v2m4 0h-2v-2h2v2m4 0h-2v-2h2v2m2-7h-2v2h2v2h-2v-2h-2v2h-2v-2h-2v2H9v-2H7v2H5v-2h2v-2H5V5h14v6z"/></svg>` },
  ],
};

export const typeImage = {
  name: ' ',
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
  name: ' ',
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
  value: 'linear-gradient(90deg, #d983a6 0%, #713873 100%)',
  defaults: 'none',
  full: 1,
};