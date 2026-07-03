import { createPreset } from './createPreset';

export const buttonPresets = [
  createPreset('button.hover', 'button', 'cn-m-btn-hover', {
    duration: 'fast',
    easing: 'standard',
  }),
  createPreset('button.press', 'button', 'cn-m-btn-press', {
    duration: 'fast',
    easing: 'exit',
  }),
  createPreset('button.ripple', 'button', 'cn-m-btn-ripple', {
    duration: 'base',
    easing: 'exit',
    essential: false,
  }),
  createPreset('button.success', 'button', 'cn-m-btn-success', {
    duration: 'moderate',
    easing: 'spring',
    essential: true,
  }),
  createPreset('button.loading', 'button', 'cn-m-btn-loading', {
    duration: 'base',
    easing: 'linear',
    essential: true,
  }),
  createPreset('button.disabled', 'button', 'cn-m-btn-disabled', {
    duration: 'instant',
    easing: 'standard',
    essential: true,
  }),
];
