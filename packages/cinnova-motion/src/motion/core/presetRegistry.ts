import type { MotionPresetDefinition } from './types';

const registry = new Map<string, MotionPresetDefinition>();

export function definePresets(presets: MotionPresetDefinition[]): void {
  for (const preset of presets) {
    registry.set(preset.id, preset);
  }
}

export function getPreset(id: string): MotionPresetDefinition | undefined {
  return registry.get(id);
}

export function getAllPresets(): MotionPresetDefinition[] {
  return Array.from(registry.values());
}

export function getPresetsByCategory(
  category: MotionPresetDefinition['category'],
): MotionPresetDefinition[] {
  return getAllPresets().filter((p) => p.category === category);
}
