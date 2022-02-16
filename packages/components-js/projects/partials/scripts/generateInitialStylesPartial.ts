import { withoutTagsOption } from './utils';
import { INTERNAL_TAG_NAMES, TAG_NAMES, TAG_NAMES_WITH_SKELETON } from '@porsche-design-system/shared';
import { joinArrayElementsToString } from './utils';
import {
  getButtonLinkPureSkeletonCss,
  getButtonLinkSkeletonCss,
  getCheckboxRadioWrapperSkeletonCss,
  getFieldsetTextListWrapperSkeletonCss,
  getHeadlineSkeletonCss,
  getSelectTextFieldWrapperSkeletonCss,
  getTextAndTextListSkeletonCss,
  getTextareaWrapperSkeletonCss,
  SKELETON_COLOR_THEME_PLACEHOLDER,
  SKELETON_LINEAR_GRADIENT_COLOR_1,
  SKELETON_LINEAR_GRADIENT_COLOR_2,
} from '../../../../components/src/styles/skeletons';

// TODO: use array of components to provide skeletons
// TODO: remove skeleton styles after all are hydrated

const skeletonChunkNamesTypeLiteral = joinArrayElementsToString(TAG_NAMES_WITH_SKELETON, ' | ');

const tagNames = joinArrayElementsToString(TAG_NAMES.filter((x) => !INTERNAL_TAG_NAMES.includes(x)));

const tagNamesWithSkeleton = joinArrayElementsToString(TAG_NAMES_WITH_SKELETON);

export const generateInitialStylesPartial = (): string => {
  // 'any' is fallback when COMPONENT_CHUNK_NAMES is an empty array because components-js wasn't built, yet
  const types = `export type SkeletonComponentChunkName = ${skeletonChunkNamesTypeLiteral || 'any'};

  type GetInitialStylesOptions = {
  skeletonComponents?: SkeletonComponentChunkName[];
  prefix?: string;
  ${withoutTagsOption}
  theme?: 'light' | 'dark';
  format?: Format;
};
type GetInitialStylesOptionsFormatHtml = Omit<GetInitialStylesOptions, 'withoutTags'> & {
  format: 'html';
};
type GetInitialStylesOptionsFormatJsx = Omit<GetInitialStylesOptions, 'withoutTags'> & {
   format: 'jsx';
};
type GetInitialStylesOptionsWithoutTags = Omit<GetInitialStylesOptions, 'format'>;`;

  const skeletonTypes = `type SkeletonStylesOptions = {
  prefixedTagNamesWithSkeleton: string[];
  prefixedUnusedTagNamesWithSkeleton: string[];
  prefix?: string;
  theme?: 'light' | 'dark';
}`;

  const skeletonKeyframes = '@keyframes pulse{0%{opacity:1}50%{opacity: 0.75}}100%{opacity:1}';

  const skeletonStyles = {
    'p-button|p-link': getButtonLinkSkeletonCss(),
    'p-button-pure|p-link-pure': getButtonLinkPureSkeletonCss(),
    'p-checkbox-wrapper|p-radio-button-wrapper': getCheckboxRadioWrapperSkeletonCss(),
    'p-fieldset-wrapper|p-text-list': getFieldsetTextListWrapperSkeletonCss(),
    'p-headline': getHeadlineSkeletonCss(),
    'p-select-wrapper|p-text-field-wrapper': getSelectTextFieldWrapperSkeletonCss(),
    'p-text|p-text-list-item': getTextAndTextListSkeletonCss(),
    'p-textarea-wrapper': getTextareaWrapperSkeletonCss(),
  };

  const initialStylesFunction = `export function getInitialStyles(opts?: GetInitialStylesOptionsFormatHtml): string;
export function getInitialStyles(opts?: GetInitialStylesOptionsFormatJsx): JSX.Element;
export function getInitialStyles(opts?: GetInitialStylesOptionsWithoutTags): string;
export function getInitialStyles(opts?: GetInitialStylesOptions): string | JSX.Element {
  const { skeletonComponents, prefix, withoutTags, theme, format }: GetInitialStylesOptions = {
    skeletonComponents: [],
    prefix: '',
    withoutTags: false,
    theme: 'light',
    format: 'html',
    ...opts
  };

  const tagNames = [${tagNames}];
  const prefixedTagNames = getPrefixedTagNames(tagNames, prefix);

  const tagNamesWithSkeleton: SkeletonComponentChunkName[] = [${tagNamesWithSkeleton}];

  const invalidComponentChunkNames = skeletonComponents.filter((x) => !tagNamesWithSkeleton.includes(x));

  if (invalidComponentChunkNames.length) {
    throw new Error(\`The following supplied skeleton component names are invalid:
  \${invalidComponentChunkNames.join(', ')}

Please use only valid component chunk names:
  \${tagNamesWithSkeleton.join(', ')}\`);
  }

  const usedTagNamesWithSkeleton = tagNamesWithSkeleton.filter((skeletonTagName) => skeletonComponents.includes(skeletonTagName));
  const prefixedTagNamesWithSkeleton = getPrefixedTagNames(usedTagNamesWithSkeleton, prefix);
  const prefixedUnusedTagNamesWithSkeleton = getPrefixedTagNames(tagNamesWithSkeleton.filter((skeletonTagName) => !skeletonComponents.includes(skeletonTagName)), prefix);

  const initialVisibilityHiddenStyles = prefixedTagNames.join(',') + '{visibility:hidden}';

  const mergedStyles = \`\${initialVisibilityHiddenStyles}\${getSkeletonStyles({prefixedTagNamesWithSkeleton,prefixedUnusedTagNamesWithSkeleton, prefix, theme})}\`;
  const markup = format === 'html' ?  \`<style>\${mergedStyles}</style>\` : <style>{mergedStyles}</style>;

  return withoutTags
    ? mergedStyles
    : markup;
};`;

  const skeletonStylesFunction = `const getSkeletonStyles = (opts?: SkeletonStylesOptions): string => {
  const options: SkeletonStylesOptions = {
     prefixedTagNamesWithSkeleton: [],
     prefixedUnusedTagNamesWithSkeleton: [],
     prefix: '',
     theme: 'light',
     ...opts
  };
  const { prefixedTagNamesWithSkeleton, prefixedUnusedTagNamesWithSkeleton, prefix, theme } = options;

  const skeletonStylesWithKey = ${JSON.stringify(skeletonStyles)};
  let skeletonStyles = prefixedTagNamesWithSkeleton.map((prefixedTagName)=>{
    let tagNameToFind = prefixedTagName;

    if(prefix){
      const prefixRegExp = new RegExp(\`\${prefix}-\`, 'g');
      tagNameToFind = prefixedTagName.replace(prefixRegExp, '');
    }
    const tagNameToFindRegExp = new RegExp(\`(\${tagNameToFind}(?!-))\`, 'g');

    const skeletonStyleKey = Object.keys(skeletonStylesWithKey)[
        Object.keys(skeletonStylesWithKey).findIndex(
          (skeletonStyleKey) => skeletonStyleKey.split('|').some((x) => x.match(tagNameToFindRegExp))
        )
    ];
    let skeletonStyle = skeletonStylesWithKey[skeletonStyleKey];
    if (skeletonStyle) {
      if (prefix) {
        skeletonStyleKey.split('|').forEach(key => {
          skeletonStyle = skeletonStyle.replace(new RegExp(\`(\${key}(?!-))\`, 'g'), prefix + '-' + key);
        });
      };

      delete skeletonStylesWithKey[skeletonStyleKey];

      return skeletonStyle;
    } else {
      return '';
    }
  }).join('');

  // remove unused skeleton selectors
  prefixedUnusedTagNamesWithSkeleton.forEach((tagName) => {
    const unusedSkeletonTagName = new RegExp(\`((?:,)*\${tagName}:not\\\\(\\\\.hydrated\\\\)(?:\\\\:\\\\:(?:after|before))*)\`, 'g');
    skeletonStyles = skeletonStyles.replace(unusedSkeletonTagName, '');
  });

  skeletonStyles = skeletonStyles.replace(/${SKELETON_COLOR_THEME_PLACEHOLDER}/g,\`\${theme === 'light' ? '#E3E4E5': '#626669'}\`);
  skeletonStyles = skeletonStyles.replace(/${SKELETON_LINEAR_GRADIENT_COLOR_1}/g,\`\${theme === 'light' ? '#E3E4E5': '#656871'}\`);
  skeletonStyles = skeletonStyles.replace(/${SKELETON_LINEAR_GRADIENT_COLOR_2}/g,\`\${theme === 'light' ? '#0000000d': '#888b94'}\`);

  const result = skeletonStyles + \`\${prefixedTagNamesWithSkeleton.length ? '${skeletonKeyframes}' : ''}\`;
  // escape the "at" sign for sed replace command to work properly
  return result.replace(/(@)/g, '\\\\$1');
};`;

  const helperFunction = `const getPrefixedTagNames = (tagNames: string[], prefix?: string): string[] => {
  return prefix ? tagNames.map((x) => \`\${prefix}-\${x}\`) : tagNames;
}
`;

  return [types, skeletonTypes, helperFunction, initialStylesFunction, skeletonStylesFunction].join('\n\n');
};
