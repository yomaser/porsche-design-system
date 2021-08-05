import {
  addImportantToEachRule,
  buildGlobalStyles,
  buildHostStyles,
  getCss,
  isDark,
  pxToRemWithUnit,
  transitionDuration,
  transitionTimingFunction,
} from '../../../../utils';
import type { FormState, Theme } from '../../../../types';
import { color, font } from '@porsche-design-system/utilities';
import type { JssStyle } from 'jss';

const getBoxShadow = (color: string): string => `${color} 0 0 0 1px inset`;
const getStateBoxShadow = (color: string): string => `${color} 0 0 0 2px inset`;

export const getComponentCss = (disabled: boolean, state: FormState, theme: Theme): string => {
  const isDarkTheme = isDark(theme);
  const {
    default: textColor,
    background: { default: backgroundColor },
    neutralContrast: { medium: contrastMediumColor, high: contrastHighColor },
    state: { disabled: disabledColor },
    notification,
  } = isDarkTheme ? color.darkTheme : color;

  const stateColor = notification[state];
  const stateHoverColor = (
    isDarkTheme ? { success: '#017d14', error: '#d30303' } : { success: '#014d0c', error: '#a30000' }
  )[state];

  const [boxShadow, boxShadowHover] = stateColor
    ? [getStateBoxShadow('currentColor'), getStateBoxShadow(stateHoverColor)]
    : [getBoxShadow('currentColor'), getBoxShadow(contrastHighColor)];

  const placeHolderStyles: JssStyle = {
    opacity: 1,
    color: textColor,
  };

  return getCss({
    ...buildHostStyles({
      color: stateColor || contrastMediumColor, // allow override by select-wrapper when label is hovered
      ...addImportantToEachRule({
        display: 'block',
        position: 'absolute',
        bottom: '2px',
        left: '2px',
        width: `calc(100% - ${pxToRemWithUnit(44)})`,
      }),
    }),
    ...buildGlobalStyles({
      input: {
        display: 'block',
        position: 'relative',
        zIndex: 1,
        width: '100%',
        height: pxToRemWithUnit(44),
        padding: pxToRemWithUnit(10),
        outline: 'none',
        appearance: 'none',
        boxSizing: 'border-box',
        border: 'none',
        opacity: 0,
        fontFamily: font.family,
        ...font.size.small,
        fontWeight: font.weight.regular,
        textIndent: 0,
        cursor: 'text',
        color: textColor,
        background: backgroundColor,
        '&::placeholder': placeHolderStyles,
        '&::-webkit-input-placeholder': placeHolderStyles,
        '&::-moz-placeholder': placeHolderStyles,
        '&:-ms-input-placeholder': placeHolderStyles,
        '&:-moz-placeholder': placeHolderStyles,
        '&:focus': {
          opacity: 1,
          '&+$span': {
            outlineColor: stateColor || contrastMediumColor,
          },
        },
        ...(disabled
          ? {
              cursor: 'not-allowed',
              '&+$span': {
                cursor: 'not-allowed',
                boxShadow: stateColor ? getStateBoxShadow(stateColor) : getBoxShadow(disabledColor),
              },
            }
          : {
              '&:hover+$span': {
                boxShadow: boxShadowHover,
              },
            }),
      },
      span: {
        position: 'absolute',
        inset: `${pxToRemWithUnit(-2)} ${pxToRemWithUnit(-42)} ${pxToRemWithUnit(-2)} ${pxToRemWithUnit(-2)}`,
        outline: '1px solid transparent',
        outlineOffset: 2,
        transition: `box-shadow ${transitionDuration} ${transitionTimingFunction}`,
        pointerEvents: 'all',
        cursor: 'pointer',
        boxShadow: boxShadow,
        ...(!disabled && {
          '&:hover': {
            boxShadow: boxShadowHover,
          },
        }),
      },
    }),
  });
};
