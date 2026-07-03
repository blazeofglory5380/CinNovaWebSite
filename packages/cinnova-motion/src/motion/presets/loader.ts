import { createPreset } from './createPreset';

export const loaderPresets = [
  createPreset('loader.spinner', 'loader', 'cn-m-loader-spinner', {
    duration: 'base',
    easing: 'linear',
    essential: true,
    gpu: true,
  }),
  createPreset('loader.skeleton', 'loader', 'cn-m-loader-skeleton', {
    duration: 'base',
    easing: 'linear',
    essential: true,
  }),
  createPreset('loader.dots', 'loader', 'cn-m-loader-dots', {
    duration: 'base',
    easing: 'linear',
    essential: true,
  }),
  createPreset('loader.bar', 'loader', 'cn-m-loader-bar', {
    duration: 'base',
    easing: 'linear',
    essential: true,
  }),
];
