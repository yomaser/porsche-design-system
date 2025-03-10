import type { Page } from 'puppeteer';
import {
  expectA11yToMatchSnapshot,
  selectNode,
  setContentWithDesignSystem,
  setProperty,
  waitForStencilLifecycle,
} from '../helpers';
import type { FormState } from '@porsche-design-system/components/dist/types/bundle';

let page: Page;
beforeEach(async () => (page = await browser.newPage()));
afterEach(async () => await page.close());

type InitOptions = {
  state?: FormState;
};

const initFieldset = async (opts?: InitOptions) => {
  const { state = 'none' } = opts || {};

  await setContentWithDesignSystem(page, `<p-fieldset state="${state}" message="Some Message"></p-fieldset>`);
};

const getHost = () => selectNode(page, 'p-fieldset');
const getFieldset = () => selectNode(page, 'p-fieldset >>> fieldset');

describe('accessibility', () => {
  it('should expose correct initial accessibility tree', async () => {
    await initFieldset();
    const fieldset = await getFieldset();

    await expectA11yToMatchSnapshot(page, fieldset, { interestingOnly: false });
  });

  it('should expose correct accessibility tree property in error state', async () => {
    await initFieldset({ state: 'error' });
    const fieldset = await getFieldset();

    await expectA11yToMatchSnapshot(page, fieldset, { interestingOnly: false });
  });

  it('should expose correct accessibility tree property if error state added programmatically', async () => {
    await initFieldset();
    const host = await getHost();

    await setProperty(host, 'state', 'error');
    await waitForStencilLifecycle(page);

    const fieldset = await getFieldset();

    await expectA11yToMatchSnapshot(page, fieldset, { interestingOnly: false });
  });
});
