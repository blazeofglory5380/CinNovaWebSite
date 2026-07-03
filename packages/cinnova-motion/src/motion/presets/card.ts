import { createPreset } from './createPreset';

export const cardPresets = [
  createPreset('card.hoverLift', 'card', 'cn-m-card-hover-lift', {
    duration: 'fast',
    easing: 'standard',
    description: 'Card lifts on hover',
  }),
  createPreset('card.glow', 'card', 'cn-m-card-glow', {
    duration: 'base',
    easing: 'standard',
  }),
  createPreset('card.tilt', 'card', 'cn-m-card-tilt', {
    duration: 'fast',
    easing: 'standard',
  }),
  createPreset('card.expand', 'card', 'cn-m-card-expand', {
    duration: 'base',
    easing: 'enter',
  }),
  createPreset('card.flip', 'card', 'cn-m-card-flip', {
    duration: 'moderate',
    easing: 'standard',
  }),
  createPreset('card.stack', 'card', 'cn-m-card-stack', {
    duration: 'base',
    easing: 'enter',
  }),
  createPreset('card.spotlight', 'card', 'cn-m-card-spotlight', {
    duration: 'base',
    easing: 'standard',
  }),
];
