import { createPreset } from './createPreset';

export const aiPresets = [
  createPreset('ai.thinking', 'ai', 'cn-m-ai-thinking', {
    duration: 'base',
    easing: 'linear',
    essential: false,
    description: 'AI thinking dots or pulse',
  }),
  createPreset('ai.typing', 'ai', 'cn-m-ai-typing', {
    duration: 'fast',
    easing: 'linear',
    essential: false,
  }),
  createPreset('ai.streaming', 'ai', 'cn-m-ai-streaming', {
    duration: 'base',
    easing: 'standard',
    essential: false,
    description: 'Streaming text reveal',
  }),
  createPreset('ai.pulse', 'ai', 'cn-m-ai-pulse', {
    duration: 'base',
    easing: 'standard',
    essential: false,
  }),
  createPreset('ai.processingRing', 'ai', 'cn-m-ai-processing-ring', {
    duration: 'base',
    easing: 'linear',
    essential: true,
    description: 'Processing ring — essential loading feedback',
  }),
  createPreset('ai.confidence', 'ai', 'cn-m-ai-confidence', {
    duration: 'moderate',
    easing: 'enter',
    essential: false,
  }),
];
