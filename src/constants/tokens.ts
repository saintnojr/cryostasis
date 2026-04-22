// Design tokens — mirrors tailwind.config.js and CSS variables
// Use these in inline styles or anywhere Tailwind classes aren't available

export const COLORS = {
  bg:           '#0A0A0A',
  bg2:          '#111111',
  bg3:          '#1A1A1A',
  fg:           '#F0F0F0',
  mid:          '#888888',
  dim:          '#444444',
  border:       'rgba(240,240,240,0.08)',
  borderStrong: 'rgba(240,240,240,0.15)',
} as const;

export const FONTS = {
  logo:     'var(--font-logo)',
  headline: 'var(--font-headline)',
  ui:       'var(--font-ui)',
} as const;

// Shared Framer Motion easing curve used across all transitions
export const EASE_EXPO = [0.23, 1, 0.32, 1] as const;
