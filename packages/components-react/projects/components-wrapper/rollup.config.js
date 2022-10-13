import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
import generatePackageJson from 'rollup-plugin-generate-package-json';

const rootDir = '../..';
const projectDir = 'projects/components-wrapper';
const outputDir = 'dist/components-wrapper';
const input = `${projectDir}/src/public-api.ts`;

const typescriptOpts = {
  tsconfig: `${projectDir}/tsconfig.json`,
};

const external = [
  '@porsche-design-system/components-js',
  '@porsche-design-system/components-js/partials',
  '@porsche-design-system/components-js/utilities/js',
  'react',
  'react/jsx-runtime',
];

const packageJsonConfig = {
  baseContents: {
    main: 'index.js',
    module: 'esm/index.js',
    sideEffects: false,
  },
};

export default [
  {
    input,
    external,
    output: {
      dir: outputDir,
      format: 'cjs',
    },
    plugins: [
      typescript({
        ...typescriptOpts,
        declaration: true,
        declarationDir: outputDir,
        rootDir: 'src',
      }),
      copy({
        targets: [
          { src: `${rootDir}/LICENSE`, dest: outputDir },
          { src: `${rootDir}/OSS_NOTICE`, dest: outputDir },
          { src: `${projectDir}/README.md`, dest: outputDir },
          { src: `${projectDir}/package.json`, dest: outputDir },
          { src: '../components/CHANGELOG.md', dest: outputDir },
        ],
      }),
    ],
  },
  {
    input,
    external,
    output: {
      dir: `${outputDir}/esm`,
      format: 'esm',
    },
    plugins: [typescript(typescriptOpts)],
  },
  {
    input: `${projectDir}/src/partials.ts`,
    external,
    output: [
      {
        file: `${outputDir}/partials/index.js`,
        format: 'cjs',
        plugins: [generatePackageJson(packageJsonConfig)],
      },
      {
        file: `${outputDir}/partials/esm/index.js`,
        format: 'esm',
      },
    ],
    plugins: [typescript(typescriptOpts)],
  },
  {
    input: `${projectDir}/src/utilities/js.ts`,
    external,
    output: [
      {
        file: `${outputDir}/utilities/js/index.js`,
        format: 'cjs',
        plugins: [generatePackageJson(packageJsonConfig)],
      },
      {
        file: `${outputDir}/utilities/js/esm/index.js`,
        format: 'esm',
      },
    ],
    plugins: [
      typescript(typescriptOpts),
      copy({
        targets: [
          {
            src: `${projectDir}/src/utilities/scss.scss`,
            dest: `${outputDir}/utilities`,
          },
        ],
      }),
    ],
  },
  {
    input: `${projectDir}/src/testing.ts`,
    external: ['@testing-library/dom'],
    output: {
      dir: outputDir,
      format: 'cjs',
    },
    plugins: [typescript(typescriptOpts)],
  },
];
