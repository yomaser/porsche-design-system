import * as fs from 'fs';
import * as path from 'path';
import globby from 'globby';
import { CDN_BASE_URL, FONTS_MANIFEST } from '@porsche-design-system/fonts';
import { buildStyle } from './style';

const createGlobalCSS = async (cdn: string, files: string[]): Promise<void> => {
  fs.mkdirSync(path.resolve('./dist/style'), { recursive: true });

  buildStyle({
    baseUrl: 'http://localhost:3001/fonts',
    fontsManifest: FONTS_MANIFEST,
    addContentBasedHash: false
  });

  const fontFaceCdnFileName = buildStyle({
    baseUrl: CDN_BASE_URL,
    fontsManifest: FONTS_MANIFEST,
    addContentBasedHash: true
  });

  const targetFile = path.normalize('./src/js/index.ts');
  const separator = '\n/* Auto Generated Below */';

  const oldContent = fs.readFileSync(targetFile, 'utf8');
  const newContent = `${oldContent.substr(
    0,
    oldContent.indexOf(separator) > 0 ? oldContent.indexOf(separator) : undefined
  )}${separator}

export const STYLE_CDN_URL = "${cdn}/${fontFaceCdnFileName}";`;

  fs.writeFileSync(targetFile, newContent);
};

(async (): Promise<void> => {
  const cdn = 'https://cdn.ui.porsche.com/porsche-design-system/style';
  const files = await globby('./src/**/*.@(woff|woff2)');

  await createGlobalCSS(cdn, files).catch((e) => {
    console.error(e);
    process.exit(1);
  });
})();
