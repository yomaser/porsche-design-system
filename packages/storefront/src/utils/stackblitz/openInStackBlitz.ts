import sdk from '@stackblitz/sdk';
import { getVanillaJsProjectAndOpenOptions } from '@/utils/stackblitz/vanillaJsBoilerplate';
import { getReactProjectAndOpenOptions } from '@/utils/stackblitz/reactBoilerplate';
import { getAngularProjectAndOpenOptions } from '@/utils/stackblitz/angularBoilerplate';
import { getBackgroundColor, getPdsComponents } from '@/utils/stackblitz/helper';
import type {
  StackBlitzFrameworkOpts,
  FrameworksWithoutShared,
  GetStackblitzProjectAndOpenOptions,
  SharedImportKey,
  ExternalStackBlitzDependency,
} from '@/utils';
import type { Theme, ColorScheme, Framework } from '@/models';

// TODO: decide hasFrameworkMarkup in boilerplate
export type OpenInStackBlitzOpts = {
  markup: string;
  framework: FrameworksWithoutShared;
  theme: Theme;
  hasFrameworkMarkup: boolean;
  backgroundColorScheme: ColorScheme;
  sharedImportKeys?: SharedImportKey[];
  externalStackBlitzDependencies?: ExternalStackBlitzDependency[];
};

export const openInStackBlitz = (opts: OpenInStackBlitzOpts): void => {
  const {
    markup,
    framework,
    theme,
    hasFrameworkMarkup,
    externalStackBlitzDependencies,
    backgroundColorScheme,
    sharedImportKeys,
  } = opts;

  // TODO: move into react
  const pdsComponents = getPdsComponents(markup);

  const stackBlitzFrameworkOpts: StackBlitzFrameworkOpts = {
    markup,
    hasFrameworkMarkup,
    title: `Porsche Design System ${framework} sandbox`,
    description: 'Porsche Design System component example',
    globalStyles: `body { background: ${getBackgroundColor(theme, backgroundColorScheme)}; }`,
    pdsComponents,
    sharedImportKeys,
    externalStackBlitzDependencies,
  };

  const getProjectAndOpenOptionsCallbackMap: {
    [key in Exclude<Framework, 'shared'>]: GetStackblitzProjectAndOpenOptions;
  } = {
    'vanilla-js': getVanillaJsProjectAndOpenOptions,
    angular: getAngularProjectAndOpenOptions,
    react: getReactProjectAndOpenOptions,
  };

  const { openFile, ...project } = getProjectAndOpenOptionsCallbackMap[framework](stackBlitzFrameworkOpts);

  sdk.openProject(project, { openFile });
};
