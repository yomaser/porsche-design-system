import { setCustomOptions } from '@porsche-design-system/shared/testing';

setCustomOptions({
  baseUrl: 'http://localhost:3000',
  fixturesDir: '../nextjs/tests/vrt/fixtures',
  resultsDir: 'tests/vrt/results',
});
