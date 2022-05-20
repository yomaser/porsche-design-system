import {
  getFocusJssStyle,
  getHoverJssStyle,
  getThemedColors,
  getTransition,
  pxToRemWithUnit,
} from '../../../../styles';
import { textXSmall, textSmall } from '@porsche-design-system/utilities-v2';
import { getCss, isThemeDark } from '../../../../utils';
import type { Theme } from '../../../../types';
import type { StepperState } from './stepper-horizontal-item-utils';

const getColor = (
  state: StepperState,
  theme: Theme
): { baseColor: string; hoverColor: string; iconColor: string; invertedBaseColor: string; disabledColor: string } => {
  const { baseColor, hoverColor, warningColor, successColor, disabledColor } = getThemedColors(theme);
  const { baseColor: invertedBaseColor } = getThemedColors(isThemeDark(theme) ? 'light' : 'dark');

  const colorMap: { [key in StepperState]: string } = {
    current: 'inherit',
    complete: successColor,
    warning: warningColor,
  };

  return { baseColor, hoverColor, iconColor: colorMap[state], invertedBaseColor, disabledColor };
};

export const getComponentCss = (state: StepperState, isDisabled: boolean, theme: Theme): string => {
  const { baseColor, hoverColor, iconColor, invertedBaseColor, disabledColor } = getColor(state, theme);
  const isCurrentOrUndefined = state === 'current' || state === undefined;
  const hoverJssStyles = getHoverJssStyle();

  return getCss({
    '@global': {
      button: {
        display: 'flex',
        alignItems: 'center',
        height: pxToRemWithUnit(24),
        color: isDisabled ? disabledColor : baseColor,
        transition: getTransition('color'),
        padding: 0,
        background: 0,
        border: 0,
        ...textSmall,
        whiteSpace: 'nowrap',
        cursor: isDisabled ? 'not-allowed' : 'auto',
        ...getFocusJssStyle(),
        ...(!isCurrentOrUndefined && {
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          textDecoration: 'underline',
          ...(!isDisabled && {
            ...hoverJssStyles,
            '&:hover .icon': {
              color: hoverColor,
            },
          }),
        }),
      },
      text: {
        font: textXSmall.font,
        fill: isDisabled ? disabledColor : invertedBaseColor,
      },
    },
    'inner-circle': {
      fill: isDisabled ? invertedBaseColor : baseColor,
    },
    'outer-circle': {
      fill: disabledColor,
    },
    icon: {
      color: isDisabled ? disabledColor : iconColor,
      marginRight: pxToRemWithUnit(4),
      transition: getTransition('color'),
    },
    'step-count-svg-wrapper': {
      marginRight: pxToRemWithUnit(4),
      width: pxToRemWithUnit(24),
      height: pxToRemWithUnit(24),
    },
  });
};
