import { cbVRT, openPopovers } from '../../vrt/helpers/cb-vrt-helper';
import { test } from '@playwright/test';

test.describe('should have no visual regression', async () => {
  await cbVRT('overview', { scenario: (page) => openPopovers(page) });
});
