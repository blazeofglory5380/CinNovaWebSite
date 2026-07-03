import { definePresets } from '../core/presetRegistry';
import { pagePresets } from './page';
import { heroPresets } from './hero';
import { cardPresets } from './card';
import { aiPresets } from './ai';
import { dashboardPresets } from './dashboard';
import { buttonPresets } from './button';
import { formPresets } from './form';
import { listPresets } from './list';
import { imagePresets } from './image';
import { loaderPresets } from './loader';

export const allCorePresets = [
  ...pagePresets,
  ...heroPresets,
  ...cardPresets,
  ...aiPresets,
  ...dashboardPresets,
  ...buttonPresets,
  ...formPresets,
  ...listPresets,
  ...imagePresets,
  ...loaderPresets,
];

definePresets(allCorePresets);

export {
  pagePresets,
  heroPresets,
  cardPresets,
  aiPresets,
  dashboardPresets,
  buttonPresets,
  formPresets,
  listPresets,
  imagePresets,
  loaderPresets,
};

export { createPreset } from './createPreset';
