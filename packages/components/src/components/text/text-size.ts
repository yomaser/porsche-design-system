// TODO: should be a shared type in shared types folder
export const TEXT_SIZES = ['xx-small', 'x-small', 'small', 'medium', 'large', 'x-large', 'inherit'] as const;
export type TextSize = (typeof TEXT_SIZES)[number];
