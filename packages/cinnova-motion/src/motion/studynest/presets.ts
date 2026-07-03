import { createPreset } from '../presets/createPreset';
import { definePresets } from '../core/presetRegistry';

export const studynestPresets = [
  createPreset('studynest.flashcard', 'studynest', 'cn-m-sn-flashcard', { duration: 'moderate' }),
  createPreset('studynest.quizResults', 'studynest', 'cn-m-sn-quiz', { duration: 'moderate' }),
  createPreset('studynest.courseProgress', 'studynest', 'cn-m-sn-course', { duration: 'slow', essential: true }),
  createPreset('studynest.achievementUnlock', 'studynest', 'cn-m-sn-achievement', { duration: 'slow' }),
  createPreset('studynest.aiTutorThinking', 'studynest', 'cn-m-sn-tutor', { essential: false }),
];

definePresets(studynestPresets);
