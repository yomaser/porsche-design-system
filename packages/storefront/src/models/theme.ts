export const PLAYGROUND_THEME_TYPES = ['light', 'dark'] as const;
export type PlaygroundTheme = (typeof PLAYGROUND_THEME_TYPES)[number];

export const PLATFORM_THEME_TYPES = ['light', 'dark', 'auto'] as const;
export type PlatformTheme = (typeof PLATFORM_THEME_TYPES)[number];
