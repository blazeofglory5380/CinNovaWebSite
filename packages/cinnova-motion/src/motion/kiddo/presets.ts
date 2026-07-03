import { createPreset } from '../presets/createPreset';
import { definePresets } from '../core/presetRegistry';

export const kiddoPresets = [
  createPreset('kiddo.stars', 'kiddo', 'cn-m-kd-star', { description: 'Star reward pop' }),
  createPreset('kiddo.balloons', 'kiddo', 'cn-m-kd-balloon', { duration: 'slow' }),
  createPreset('kiddo.characterBounce', 'kiddo', 'cn-m-kd-bounce', { essential: false }),
  createPreset('kiddo.celebration', 'kiddo', 'cn-m-kd-celebrate', { duration: 'slow' }),
  createPreset('kiddo.worldTransition', 'kiddo', 'cn-m-kd-world', { duration: 'moderate' }),
  createPreset('kiddo.readingEffect', 'kiddo', 'cn-m-kd-reading', { duration: 'base' }),
];

definePresets(kiddoPresets);
