import { createPreset } from '../presets/createPreset';
import { definePresets } from '../core/presetRegistry';

export const techmatePresets = [
  createPreset('techmate.codeStreaming', 'techmate', 'cn-m-tm-code-stream', { essential: false }),
  createPreset('techmate.terminalTyping', 'techmate', 'cn-m-tm-terminal', { essential: false }),
  createPreset('techmate.gitDiffReveal', 'techmate', 'cn-m-tm-diff', { duration: 'fast' }),
  createPreset('techmate.aiCodeReview', 'techmate', 'cn-m-tm-review', { duration: 'base' }),
  createPreset('techmate.buildProgress', 'techmate', 'cn-m-tm-build', { duration: 'slow', essential: true }),
];

definePresets(techmatePresets);
