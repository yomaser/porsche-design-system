import type { HeadingTag } from './heading-tag';
import { HEADING_TAGS } from './heading-tag';
import type { BreakpointCustomizable, TypographyAlign, TypographyAlignDeprecated } from '../../types';
import { hasSpecificSlottedTag } from '../../utils';

export const HEADING_SIZES = ['small', 'medium', 'large', 'x-large', 'xx-large', 'inherit'] as const;
export type HeadingSize = (typeof HEADING_SIZES)[number];

export const HEADING_COLORS = ['primary', 'inherit'] as const;
export type HeadingColor = (typeof HEADING_COLORS)[number];

/** @deprecated */
export type HeadingAlignDeprecated = TypographyAlignDeprecated;
export type HeadingAlign = TypographyAlign;

const headingSizeToTagMap: Record<HeadingSize, string> = {
  small: 'h6',
  medium: 'h5',
  large: 'h4',
  'x-large': 'h3',
  'xx-large': 'h2',
  inherit: 'h2',
};

export const getHeadingTagType = (
  host: HTMLElement,
  size: BreakpointCustomizable<HeadingSize>,
  tag: HeadingTag
): string => {
  if (hasSpecificSlottedTag(host, HEADING_TAGS.join())) {
    return 'div';
  } else if (tag) {
    return tag;
  } else {
    return headingSizeToTagMap[size as HeadingSize] || 'h2';
  }
};
