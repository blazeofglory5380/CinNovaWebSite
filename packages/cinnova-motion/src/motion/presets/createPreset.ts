import type { MotionCategory, MotionPresetDefinition } from '../core/types';

export function createPreset(
  id: string,
  category: MotionCategory,
  className: string,
  options: Partial<Omit<MotionPresetDefinition, 'id' | 'category' | 'className'>> = {},
): MotionPresetDefinition {
  return {
    id,
    category,
    className,
    gpu: true,
    ...options,
  };
}
