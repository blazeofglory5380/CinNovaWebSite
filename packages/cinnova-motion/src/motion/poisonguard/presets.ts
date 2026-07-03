import { createPreset } from '../presets/createPreset';
import { definePresets } from '../core/presetRegistry';

export const poisonguardPresets = [
  createPreset('poisonguard.scan', 'poisonguard', 'cn-m-pg-scan-line', { essential: true, duration: 'base' }),
  createPreset('poisonguard.riskAnalysis', 'poisonguard', 'cn-m-pg-risk', { essential: true }),
  createPreset('poisonguard.hazardPulse', 'poisonguard', 'cn-m-pg-hazard', { duration: 'base' }),
  createPreset('poisonguard.chemicalHighlight', 'poisonguard', 'cn-m-pg-chemical', { duration: 'fast', essential: true }),
  createPreset('poisonguard.reportGeneration', 'poisonguard', 'cn-m-pg-report', { duration: 'moderate', essential: true }),
];

definePresets(poisonguardPresets);
