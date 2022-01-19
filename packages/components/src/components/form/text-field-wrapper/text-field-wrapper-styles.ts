import {
  addImportantToEachRule,
  buildSlottedStyles,
  getBaseSlottedStyles,
  getCss,
  getFocusStyles,
  getTransition,
  pxToRemWithUnit,
} from '../../../utils';
import type { BreakpointCustomizable } from '../../../utils';
import type { TextFieldWrapperUnitPosition } from './text-field-wrapper-utils';
import { getBaseChildStyles, getLabelStyles } from '../../../styles/form-styles';
import { isVisibleFormState } from '../../../utils/form-state';
import { srOnly } from '@porsche-design-system/utilities';
import type { FormState, Theme } from '../../../types';
import { getFunctionalComponentRequiredStyles } from '../../common/required/required-styles';
import { getFunctionalComponentStateMessageStyles } from '../../common/state-message/state-message-styles';
import { getThemedColors } from '../../../styles/colors';

export const getComponentCss = (
  hideLabel: BreakpointCustomizable<boolean>,
  state: FormState,
  hasUnitOrCounter: boolean,
  unitPosition: TextFieldWrapperUnitPosition,
  isPassword: boolean
): string => {
  const theme: Theme = 'light';
  const { baseColor, contrastMediumColor, activeColor, disabledColor, hoverColor } = getThemedColors(theme);
  const hasVisibleState = isVisibleFormState(state);

  return getCss({
    ':host': {
      display: 'block',
    },
    '@global': {
      ...addImportantToEachRule({
        ...getBaseChildStyles(
          'input',
          state,
          theme,
          !hasUnitOrCounter && {
            // padding is set via inline style if unit is present
            padding: pxToRemWithUnit(hasVisibleState ? 10 : 11),
          }
        ),
        '::slotted(input[type="number"])': {
          MozAppearance: 'textfield', // hides up/down spin button for Firefox
        },
        // Reset webkit autofill styles
        '::slotted(input:-internal-autofill-selected), ::slotted(input:-internal-autofill-previewed), ::slotted(input:-webkit-autofill), ::slotted(input:-webkit-autofill:focus)':
          {
            WebkitBackgroundClip: 'padding-box',
          },
        ...(isPassword && {
          '::slotted(input[type="password"]), ::slotted(input[type="text"])': {
            paddingRight: pxToRemWithUnit(48),
          },
        }),
        '::slotted(input[type="search"])': {
          paddingRight: pxToRemWithUnit(48),
        },
      }),
      button: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        margin: 0,
        width: pxToRemWithUnit(48),
        height: pxToRemWithUnit(48),
        padding: pxToRemWithUnit(12),
        boxSizing: 'border-box',
        outline: 'transparent none',
        appearance: 'none',
        border: 'none',
        textDecoration: 'none',
        background: 'transparent',
        cursor: 'pointer',
        color: baseColor,
        transition: getTransition('color'),
        ...getFocusStyles({ offset: hasVisibleState ? -5 : -4 }),
        '&:hover': {
          color: hoverColor,
        },
        '&:active': {
          color: activeColor,
        },
        '&:disabled': {
          color: disabledColor,
          cursor: 'not-allowed',
        },
      },
    },
    root: {
      display: 'block',
      position: 'relative',
    },
    ...getLabelStyles('input', hideLabel, state, theme, hasUnitOrCounter ? '$unit' : ''),
    ...getFunctionalComponentRequiredStyles(theme),
    ...getFunctionalComponentStateMessageStyles(theme, state),
    'sr-only': {
      ...srOnly(),
      padding: 0,
    },
    ...(hasUnitOrCounter && {
      unit: {
        position: 'absolute',
        bottom: 0,
        [unitPosition === 'suffix' ? 'right' : 'left']: 0,
        padding: pxToRemWithUnit(12),
        zIndex: 1,
        boxSizing: 'border-box',
        color: contrastMediumColor,
      },
    }),
  });
};

export const getSlottedCss = (host: HTMLElement): string => {
  return getCss(
    buildSlottedStyles(host, {
      ...getBaseSlottedStyles(),
      '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button, & input[type="search"]::-webkit-search-decoration':
        {
          WebkitAppearance: 'none',
          appearance: 'none',
        },
      '& input[type="text"]': {
        '&::-webkit-contacts-auto-fill-button, &::-webkit-credentials-auto-fill-button': {
          marginRight: '2.4375rem',
        },
      },
    })
  );
};
