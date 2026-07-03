import { createPreset } from './createPreset';

export const imagePresets = [
  createPreset('image.lazyFade', 'image', 'cn-m-img-lazy-fade', {
    duration: 'base',
    easing: 'enter',
  }),
  createPreset('image.blurIn', 'image', 'cn-m-img-blur-in', {
    duration: 'moderate',
    easing: 'enter',
  }),
  createPreset('image.kenBurns', 'image', 'cn-m-img-ken-burns', {
    duration: 'deliberate',
    easing: 'linear',
    essential: false,
  }),
  createPreset('image.zoom', 'image', 'cn-m-img-zoom', {
    duration: 'slow',
    easing: 'enter',
  }),
  createPreset('image.pan', 'image', 'cn-m-img-pan', {
    duration: 'deliberate',
    easing: 'linear',
    essential: false,
  }),
];
