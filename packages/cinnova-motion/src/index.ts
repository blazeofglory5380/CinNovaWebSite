/**
 * @cinnova/motion v1.0
 * CinNova Motion Library — official animation infrastructure
 */

import './motion/motion.css';
import './motion/motion-products.css';

// Register core presets
import './motion/presets';

// Register product presets
import './motion/kiddo/presets';
import './motion/nightmare/presets';
import './motion/realestate/presets';
import './motion/techmate/presets';
import './motion/poisonguard/presets';
import './motion/studynest/presets';

export { MotionProvider, useMotionContext } from './motion/core/MotionProvider';
export * from './motion/core';
export * from './motion/hooks';
export * from './motion/components';
export * from './motion/transitions';
export * from './motion/presets';
export * from './motion/ai';
export * from './motion/dashboard';
export * from './motion/hero';
export * from './motion/loaders';
export * from './motion/effects';

// Product namespaces
export * as kiddo from './motion/kiddo';
export * as nightmare from './motion/nightmare';
export * as realestate from './motion/realestate';
export * as techmate from './motion/techmate';
export * as poisonguard from './motion/poisonguard';
export * as studynest from './motion/studynest';

export { getPreset, getAllPresets, getPresetsByCategory } from './motion/core/presetRegistry';
