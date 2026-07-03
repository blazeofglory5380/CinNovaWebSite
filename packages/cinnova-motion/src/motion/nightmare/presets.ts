import { createPreset } from '../presets/createPreset';
import { definePresets } from '../core/presetRegistry';

export const nightmarePresets = [
  createPreset('nightmare.fog', 'nightmare', 'cn-m-nf-fog', { essential: false, duration: 'deliberate' }),
  createPreset('nightmare.fireflies', 'nightmare', 'cn-m-nf-firefly', { essential: false }),
  createPreset('nightmare.floatingDust', 'nightmare', 'cn-m-nf-dust', { essential: false }),
  createPreset('nightmare.magic', 'nightmare', 'cn-m-nf-magic', { duration: 'moderate' }),
  createPreset('nightmare.enemySpawn', 'nightmare', 'cn-m-nf-spawn', { duration: 'moderate' }),
  createPreset('nightmare.portal', 'nightmare', 'cn-m-nf-portal', { essential: false }),
  createPreset('nightmare.bossIntro', 'nightmare', 'cn-m-nf-boss', { duration: 'deliberate' }),
];

definePresets(nightmarePresets);
