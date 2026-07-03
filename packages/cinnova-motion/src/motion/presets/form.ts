import { createPreset } from './createPreset';

export const formPresets = [
  createPreset('form.validation', 'form', 'cn-m-form-validation', {
    duration: 'fast',
    easing: 'standard',
    essential: true,
  }),
  createPreset('form.success', 'form', 'cn-m-form-success', {
    duration: 'moderate',
    easing: 'spring',
    essential: true,
  }),
  createPreset('form.errorShake', 'form', 'cn-m-form-error-shake', {
    duration: 'fast',
    easing: 'standard',
    essential: true,
    description: 'Horizontal shake on validation error',
  }),
  createPreset('form.loading', 'form', 'cn-m-form-loading', {
    duration: 'base',
    easing: 'linear',
    essential: true,
  }),
  createPreset('form.focusGlow', 'form', 'cn-m-form-focus-glow', {
    duration: 'fast',
    easing: 'standard',
    essential: true,
  }),
];
