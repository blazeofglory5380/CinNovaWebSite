import { createPreset } from './createPreset';

export const pagePresets = [
  createPreset('page.fade', 'page', 'cn-m-page-fade', {
    duration: 'moderate',
    easing: 'enter',
    description: 'Page fade in on route enter',
  }),
  createPreset('page.slide', 'page', 'cn-m-page-slide', {
    duration: 'moderate',
    easing: 'enter',
    description: 'Page slide up on enter',
  }),
  createPreset('page.scale', 'page', 'cn-m-page-scale', {
    duration: 'moderate',
    easing: 'enter',
    description: 'Page scale in from 0.98',
  }),
  createPreset('page.crossfade', 'page', 'cn-m-page-crossfade', {
    duration: 'moderate',
    easing: 'standard',
    description: 'Crossfade between route views',
  }),
  createPreset('route.transition', 'page', 'cn-m-route-transition', {
    duration: 'moderate',
    easing: 'standard',
    description: 'SPA route transition wrapper',
  }),
];
