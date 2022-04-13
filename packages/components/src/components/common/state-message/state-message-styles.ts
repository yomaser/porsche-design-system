import type { Styles } from 'jss';
import type { FormState, Theme } from '../../../types';
import { getTransition } from '../../../styles';
import { spacing } from '@porsche-design-system/utilities-v2';
import { getThemedFormStateColors } from '../../../styles/form-state-color-styles';

const { xSmall: spacingXSmall } = spacing;

export const getFunctionalComponentStateMessageStyles = (theme: Theme, state: FormState): Styles<'message'> => {
  return {
    message: {
      display: 'flex',
      marginTop: spacingXSmall,
      color: getThemedFormStateColors(theme, state).formStateColor,
      transition: getTransition('color'),
      '&__icon': {
        marginRight: spacingXSmall,
      },
    },
  };
};
