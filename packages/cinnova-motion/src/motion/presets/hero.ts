import { createPreset } from './createPreset';

export const heroPresets = [
  createPreset('hero.fadeUp', 'hero', 'cn-m-hero-fade-up', {
    duration: 'slow',
    easing: 'enter',
    description: 'Hero content fades up into view',
  }),
  createPreset('hero.fadeLeft', 'hero', 'cn-m-hero-fade-left', {
    duration: 'slow',
    easing: 'enter',
  }),
  createPreset('hero.fadeRight', 'hero', 'cn-m-hero-fade-right', {
    duration: 'slow',
    easing: 'enter',
  }),
  createPreset('hero.reveal', 'hero', 'cn-m-hero-reveal', {
    duration: 'deliberate',
    easing: 'enter',
    description: 'Clip-path or mask reveal',
  }),
  createPreset('hero.zoom', 'hero', 'cn-m-hero-zoom', {
    duration: 'slow',
    easing: 'enter',
  }),
  createPreset('hero.floatingBackground', 'hero', 'cn-m-hero-float-bg', {
    duration: 'deliberate',
    easing: 'linear',
    essential: false,
    description: 'Ambient floating background shapes',
  }),
  createPreset('hero.animatedGradient', 'hero', 'cn-m-hero-gradient', {
    duration: 'deliberate',
    easing: 'linear',
    essential: false,
    description: 'Slow animated gradient shift',
  }),
];
