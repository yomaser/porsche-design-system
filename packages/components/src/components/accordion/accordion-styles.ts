import type { BreakpointCustomizable, Theme } from '../../types';
import type { AccordionSize } from './accordion-utils';
import { buildResponsiveStyles, getCss, mergeDeep } from '../../utils';
import {
  getTransition,
  transitionDuration,
  getThemedColors,
  addImportantToEachRule,
  hostHiddenStyles,
  hoverMediaQuery,
  prefersColorSchemeDarkMediaQuery,
  colorSchemeStyles,
} from '../../styles';
import {
  fontWeightSemiBold,
  fontSizeTextSmall,
  fontSizeTextMedium,
  spacingStaticSmall,
  textSmallStyle,
  fontLineHeight,
  borderRadiusSmall,
  borderWidthBase,
  fontSizeTextXXSmall,
} from '@porsche-design-system/utilities-v2';

export const getComponentCss = (
  size: BreakpointCustomizable<AccordionSize>,
  compact: boolean,
  open: boolean,
  theme: Theme
): string => {
  const { primaryColor, hoverColor, focusColor, contrastLowColor } = getThemedColors(theme);
  const {
    primaryColor: primaryColorDark,
    hoverColor: hoverColorDark,
    focusColor: focusColorDark,
    contrastLowColor: contrastLowColorDark,
  } = getThemedColors('dark');

  return getCss({
    '@global': {
      ':host': addImportantToEachRule({
        display: 'block',
        ...(!compact && {
          borderBottom: `1px solid ${contrastLowColor}`,
          ...prefersColorSchemeDarkMediaQuery(theme, {
            borderColor: contrastLowColorDark,
          }),
        }),
        ...colorSchemeStyles,
        ...hostHiddenStyles,
      }),
      button: {
        display: 'flex',
        position: 'relative',
        justifyContent: 'space-between',
        width: '100%',
        textDecoration: 'none',
        border: 0,
        outline: 0,
        margin: 0, // Removes default button margin on safari 15
        gap: '24px',
        background: 'transparent',
        cursor: 'pointer',
        textAlign: 'start',
        color: primaryColor,
        ...prefersColorSchemeDarkMediaQuery(theme, {
          color: primaryColorDark,
        }),
        ...textSmallStyle,
        fontWeight: fontWeightSemiBold,
        ...buildResponsiveStyles(size, (s: AccordionSize) => ({
          fontSize: s === 'medium' ? fontSizeTextMedium : fontSizeTextSmall,
          padding: `${compact ? '4px' : s === 'medium' ? '20px' : '15px'} 0`,
        })),
        // mergeDeep needed because of hoverMediaQuery in certain modes not wrapping keys and therefore overriding "&::before" key
        ...mergeDeep(
          {
            '&::before': {
              content: '""',
              position: 'absolute',
              borderRadius: borderRadiusSmall,
              left: '-4px',
              right: '-4px',
              ...(compact
                ? {
                    top: '2px',
                    bottom: '2px',
                  }
                : {
                    top: '6px',
                    bottom: '6px',
                  }),
            },
          },
          hoverMediaQuery({
            '&::before': {
              transition: getTransition('background-color'),
            },
            '&:hover::before': {
              background: hoverColor,
              ...prefersColorSchemeDarkMediaQuery(theme, {
                background: hoverColorDark,
              }),
            },
          })
        ),
        '&:focus::before': {
          border: `${borderWidthBase} solid ${focusColor}`,
          ...prefersColorSchemeDarkMediaQuery(theme, {
            borderColor: focusColorDark,
          }),
        },
        '&:not(:focus-visible)::before': {
          border: 0,
        },
      },
    },
    heading: {
      margin: 0,
    },
    'icon-container': {
      height: fontLineHeight,
      width: fontLineHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      width: fontLineHeight,
      height: fontLineHeight,
      fontSize: fontSizeTextXXSmall,
      transform: open ? 'rotate3d(0)' : 'rotate3d(0,0,1,90deg)',
      transition: getTransition('transform'),
    },
    collapsible: {
      color: primaryColor, // enables color inheritance for slotted content
      ...prefersColorSchemeDarkMediaQuery(theme, {
        color: primaryColorDark,
      }),
      display: 'grid',
      ...(open
        ? {
            gridTemplateRows: '1fr',
            visibility: 'visible',
            transition: `grid-template-rows ${transitionDuration} ease-out`,
            paddingBottom: compact ? spacingStaticSmall : '24px',
          }
        : {
            gridTemplateRows: '0fr',
            visibility: 'hidden',
            transition: `grid-template-rows ${transitionDuration} ease-out, visibility 0s linear ${transitionDuration}`,
          }),
      '& div': {
        overflow: open ? 'visible' : 'hidden',
        // Fix overflow issues for overlapping content (e.g. select dropdown)
        animation: open ? `$overflow ${transitionDuration}` : 'none',
        // Necessary to make focus outlines fully visible
        padding: '4px',
        margin: '-4px',
      },
    },
    '@keyframes overflow': {
      from: { overflow: 'hidden' },
      to: { overflow: 'hidden' },
    },
  });
};
