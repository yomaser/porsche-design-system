import {
  getFocusJssStyle,
  getThemedColors,
  pxToRemWithUnit,
  getTransition,
  addImportantToEachRule,
} from '../../../../styles';
import { getCss } from '../../../../utils';
import type { TagDismissibleColor } from './tag-dismissible-utils';
import { textSmall, fontWeight, getScreenReaderOnlyJssStyle, fontStyle } from '@porsche-design-system/utilities-v2';
import { getThemedBackgroundColor } from '../tag-status/tag-status-styles';

export const getComponentCss = (color: TagDismissibleColor, hasLabel: boolean): string => {
  const themedColors = getThemedColors('light');
  const { baseColor, contrastLowColor, contrastMediumColor } = themedColors;

  return getCss({
    '@global': {
      ':host': {
        display: 'inline-flex',
        verticalAlign: 'top',
      },
      button: {
        position: 'relative',
        minHeight: pxToRemWithUnit(48),
        padding: `${pxToRemWithUnit(4)} ${pxToRemWithUnit(46)} ${pxToRemWithUnit(4)} ${pxToRemWithUnit(16)}`,
        borderRadius: pxToRemWithUnit(4),
        border: 0,
        cursor: 'pointer',
        background: getThemedBackgroundColor(color, themedColors),
        color: baseColor,
        textAlign: 'left',
        ...textSmall,
        ...getFocusJssStyle({ color: baseColor }),
        transition: getTransition('background-color'),
        '&:hover': {
          background: contrastLowColor,
        },
      },
      '::slotted': addImportantToEachRule({
        '&(strong),&(b)': {
          fontWeight: fontWeight.bold,
        },
        '&(em),&(i)': {
          fontStyle: fontStyle,
        },
      }),
    },
    ...(hasLabel && {
      label: {
        display: 'block',
        marginBottom: pxToRemWithUnit(-4),
        color: contrastMediumColor,
        fontSize: pxToRemWithUnit(14),
        lineHeight: pxToRemWithUnit(20),
      },
    }),
    icon: {
      position: 'absolute',
      top: '50%',
      marginTop: pxToRemWithUnit(-12),
      right: pxToRemWithUnit(12),
    },
    'sr-only': getScreenReaderOnlyJssStyle(),
  });
};
