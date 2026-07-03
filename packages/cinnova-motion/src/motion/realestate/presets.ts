import { createPreset } from '../presets/createPreset';
import { definePresets } from '../core/presetRegistry';

export const realestatePresets = [
  createPreset('realestate.houseTransformation', 'realestate', 'cn-m-re-transform', { duration: 'deliberate' }),
  createPreset('realestate.beforeAfterSlider', 'realestate', 'cn-m-re-slider', { duration: 'slow' }),
  createPreset('realestate.scoreGauge', 'realestate', 'cn-m-re-score', { duration: 'slow' }),
  createPreset('realestate.roiAnimation', 'realestate', 'cn-m-re-roi', { duration: 'moderate' }),
  createPreset('realestate.propertyComparison', 'realestate', 'cn-m-re-compare', { duration: 'base' }),
];

definePresets(realestatePresets);
