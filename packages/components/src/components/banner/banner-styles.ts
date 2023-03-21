import type { JssStyle } from 'jss';
import type { KeyframesDirection } from './banner-styles-shared';
import { getAnimationIn, getAnimationOut, getKeyframes, getKeyframesMobile } from './banner-styles-shared';
import {
  dropShadowHighStyle,
  getMediaQueryMin,
  getMediaQueryMinMax,
  gridColumnWidthS,
  gridColumnWidthXXL,
  gridGap,
  gridSafeZoneBase,
  gridSafeZoneS,
  gridSafeZoneXXL,
  gridWidthMax,
} from '@porsche-design-system/utilities-v2';
import { getCss } from '../../utils';
import { BANNER_Z_INDEX } from '../../constants';
import { addImportantToEachRule, hostHiddenStyles } from '../../styles';

const cssVariableTop = '--p-banner-position-top';
const cssVariableBottom = '--p-banner-position-bottom';
const cssVariableAnimationDuration = '--p-animation-duration';
const cssVariableZIndex = '--p-internal-banner-z-index';

const mediaQueryBaseToS = getMediaQueryMinMax('base', 's');
const mediaQueryS = getMediaQueryMin('s');
const mediaQueryXXL = getMediaQueryMin('xxl');

const bannerPositionVertical = '56px';
const bannerPositionHorizontalBase = gridSafeZoneBase;
const bannerPositionHorizontalS = `calc(${gridSafeZoneS} + ${gridGap} + ${gridColumnWidthS})`;
const bannerPositionHorizontalXXL = `calc(max(0px, 50% - ${gridWidthMax} / 2) + ${gridSafeZoneXXL} + ${gridGap} + ${gridColumnWidthXXL})`;

const getKeyframesDesktop = (direction: KeyframesDirection, topVar: string): JssStyle =>
  getKeyframes(direction, {
    opacity: 0,
    transform: `translate3d(0,calc(-100% - var(${topVar})),0)`, // space before and after "-" is crucial
  });

export const getComponentCss = (): string => {
  return getCss({
    '@global': {
      ':host': {
        opacity: 0,
        ...addImportantToEachRule({
          [cssVariableTop]: bannerPositionVertical,
          [cssVariableBottom]: bannerPositionVertical,
          position: 'fixed',
          left: bannerPositionHorizontalBase,
          right: bannerPositionHorizontalBase,
          margin: 0,
          padding: 0,
          width: 'auto',
          zIndex: `var(${cssVariableZIndex},${BANNER_Z_INDEX})`,
          willChange: 'opacity,transform',
          [mediaQueryBaseToS]: {
            bottom: `var(${cssVariableBottom})`,
          },
          [mediaQueryS]: {
            top: `var(${cssVariableTop})`,
            left: bannerPositionHorizontalS,
            right: bannerPositionHorizontalS,
          },
          [mediaQueryXXL]: {
            left: bannerPositionHorizontalXXL,
            right: bannerPositionHorizontalXXL,
          },
          ...hostHiddenStyles,
        }),
        '&(.hydrated),&(.ssr)': {
          [mediaQueryBaseToS]: getAnimationIn('mobileIn', cssVariableAnimationDuration),
          [mediaQueryS]: getAnimationIn('desktopIn', cssVariableAnimationDuration),
        },
        '&(.banner--close)': {
          [mediaQueryBaseToS]: getAnimationOut('mobileOut'),
          [mediaQueryS]: getAnimationOut('desktopOut'),
        },
      },
      '@keyframes mobileIn': getKeyframesMobile('in', cssVariableBottom),
      '@keyframes mobileOut': getKeyframesMobile('out', cssVariableBottom),
      '@keyframes desktopIn': getKeyframesDesktop('in', cssVariableTop),
      '@keyframes desktopOut': getKeyframesDesktop('out', cssVariableTop),
    },
    root: dropShadowHighStyle,
  });
};
