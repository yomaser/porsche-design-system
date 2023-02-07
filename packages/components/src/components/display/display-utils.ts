import type { TextAlign } from '../text/text-align';

export const DISPLAY_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
export type DisplayTag = typeof DISPLAY_TAGS[number];

export const DISPLAY_SIZES = ['medium', 'large', 'inherit'] as const;
export type DisplaySize = typeof DISPLAY_SIZES[number];

export const DISPLAY_COLORS = ['primary', 'inherit'] as const;
export type DisplayColor = typeof DISPLAY_COLORS[number];

export type DisplayAlign = TextAlign;
