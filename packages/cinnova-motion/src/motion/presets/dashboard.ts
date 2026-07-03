import { createPreset } from './createPreset';

export const dashboardPresets = [
  createPreset('dashboard.kpiCountUp', 'dashboard', 'cn-m-dash-kpi', {
    duration: 'slow',
    easing: 'exit',
    description: 'KPI number count-up (use with useCountUp hook)',
  }),
  createPreset('dashboard.progressFill', 'dashboard', 'cn-m-dash-progress', {
    duration: 'slow',
    easing: 'enter',
  }),
  createPreset('dashboard.gaugeFill', 'dashboard', 'cn-m-dash-gauge', {
    duration: 'slow',
    easing: 'enter',
  }),
  createPreset('dashboard.tableRowReveal', 'dashboard', 'cn-m-dash-row-reveal', {
    duration: 'base',
    easing: 'enter',
  }),
  createPreset('dashboard.notificationSlide', 'dashboard', 'cn-m-dash-notification', {
    duration: 'moderate',
    easing: 'enter',
    essential: true,
    description: 'Notification slide-in — essential feedback',
  }),
];
