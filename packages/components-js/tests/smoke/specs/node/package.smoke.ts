import * as path from 'path';
import * as globby from 'globby';
import * as fs from 'fs';
import { checkPackage, createPackageFromNpm, type Analysis } from '@arethetypeswrong/core';
import { createRequire } from 'node:module';
import componentsJsPackageJson from '../../../../dist/components-wrapper/package.json';

const nodeRequire = createRequire(import.meta.url);

describe('package content', () => {
  const componentsJsFilePath = nodeRequire.resolve('@porsche-design-system/components-js');
  const componentsJsPackageDir = path.resolve(componentsJsFilePath, '../..');
  const filePaths = globby.sync(`${componentsJsPackageDir}/**/*.{js,mjs,cjs}`);

  it.each(filePaths.map((filePath) => [filePath.replace(componentsJsPackageDir, 'dist/components-wrapper'), filePath]))(
    'should not contain CDN_BASE_URL_DYNAMIC placeholder or localhost in bundled js file: %s',
    (_, filePath) => {
      const fileContent = fs.readFileSync(path.resolve(componentsJsPackageDir, filePath), 'utf8');
      expect(fileContent).not.toContain('CDN_BASE_URL_DYNAMIC');
      expect(fileContent).not.toContain('localhost');
    }
  );
});

describe('package.json files', () => {
  const packages = [
    '@porsche-design-system/components-js',
    '@porsche-design-system/components-angular',
    '@porsche-design-system/components-react',
    '@porsche-design-system/components-vue',
  ] as const;

  type PackageName = (typeof packages)[number];

  it.each<PackageName>(packages)('should have correct entrypoints for %s', async (packageName) => {
    const pathName = path
      .resolve(nodeRequire.resolve(packageName), '../package.json')
      .replace(/(wrapper\/).+\/(package\.json)/, '$1$2'); // get rid of nested folders if there are any
    const pkgJson = JSON.parse(fs.readFileSync(pathName, 'utf8'));

    if (packageName === '@porsche-design-system/components-angular') {
      // adjust and ignore stuff that is added by ng-packagr
      pkgJson.exports['.'].default = './cjs/index.cjs';
      pkgJson.exports['.'].import = './esm/index.mjs';

      delete pkgJson.exports['.'].es2015;
      delete pkgJson.exports['.'].es2020;
      delete pkgJson.exports['.'].esm2020;
      delete pkgJson.exports['.'].node;
    } else {
      // adjust and ignore stuff that is ssr related
      delete pkgJson.exports['./ssr'];

      // map `public-api` filenames to `index` because `components-js` calls it `index`
      pkgJson.exports['.'] = Object.fromEntries(
        Object.entries<string>(pkgJson.exports['.']).map(([key, val]) => [key, val.replace('public-api', 'index')])
      );
    }

    expect(pkgJson.version).toBe(componentsJsPackageJson.version);
    expect(pkgJson.exports).toEqual({
      './package.json': './package.json',
      '.': {
        types: './esm/index.d.ts',
        import: './esm/index.mjs',
        default: './cjs/index.cjs',
      },
      './jsdom-polyfill': {
        types: './jsdom-polyfill/index.d.ts',
        default: './jsdom-polyfill/index.cjs',
      },
      './partials': {
        types: './partials/index.d.ts',
        default: './partials/index.cjs',
      },
      './styles': {
        types: './styles/esm/index.d.ts',
        import: './styles/esm/index.mjs',
        default: './styles/cjs/index.cjs',
        sass: './styles/_index.scss',
      },
      './testing': {
        types: './testing/index.d.ts',
        default: './testing/index.cjs',
      },
    });

    const result = (await checkPackage(await createPackageFromNpm(`${pkgJson.name}@${pkgJson.version}`))) as Analysis;

    if (result.problems.length) {
      console.error(result.problems);
    }

    expect(result.problems).toHaveLength(0);
  });
});
