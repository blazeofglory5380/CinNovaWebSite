import { createPreset } from './createPreset';

export const listPresets = [
  createPreset('list.staggerReveal', 'list', 'cn-m-list-stagger', {
    duration: 'base',
    easing: 'enter',
    description: 'Staggered list item reveal',
  }),
  createPreset('list.sort', 'list', 'cn-m-list-sort', {
    duration: 'moderate',
    easing: 'standard',
  }),
  createPreset('list.filter', 'list', 'cn-m-list-filter', {
    duration: 'base',
    easing: 'standard',
  }),
];
