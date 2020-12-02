import {
  addEventListener,
  getActiveElementId,
  getBrowser, getStyleOnFocus,
  initAddEventListener,
  selectNode, setAttribute,
  setContentWithDesignSystem, expectedStyleOnFocus,
  waitForStencilLifecycle, getOutlineStyle, waitForInheritedCSSTransition
} from '../helpers';
import { Page } from 'puppeteer';

describe('link social', () => {
  let page: Page;

  beforeEach(async () => {
    page = await getBrowser().newPage();
    await initAddEventListener(page);
  });
  afterEach(async () => await page.close());

  const initLinkSocial = ({ useSlottedAnchor }: { useSlottedAnchor: boolean } = { useSlottedAnchor: false }): Promise<void> => {
    return setContentWithDesignSystem(
      page,
      `
      <p-link-social onclick="return false;" ${!useSlottedAnchor ? 'href="#"' : ''} icon="logo-facebook">
        ${useSlottedAnchor ? '<a onclick="return false;" href="">' : ''}
        Some label
        ${useSlottedAnchor ? '</a>' : ''}
      </p-link-social>`
    );
  };

  const getLinkSocialHost = () => selectNode(page, 'p-link-social');
  const getLinkSocialRealLink = () => selectNode(page, 'p-link-social >>> a');
  const getSlottedLink = () => selectNode(page, 'p-link-social a');

  it('should render', async () => {
    await setContentWithDesignSystem(page, `<p-link-social href="#" icon="logo-facebook">Some label</p-link-social>`);
    const el = await getLinkSocialRealLink();
    expect(el).toBeDefined();
  });

  it('should dispatch correct click events', async () => {
    await setContentWithDesignSystem(
      page,
      `<div><p-link-social id="hostElement" href="about:blank#" icon="logo-facebook">Some label</p-link-social></div>`
    );

    const wrapper = await selectNode(page, 'div');
    const host = await getLinkSocialHost();
    const link = await getLinkSocialRealLink();

    const events = [];
    await addEventListener(wrapper, 'click', (ev) => events.push(ev));

    await link.click();
    await host.click();
    await waitForStencilLifecycle(page);

    expect(events.length).toBe(2);
    for (const event of events) {
      expect(event.target.id).toBe('hostElement');
    }
  });

  it(`should trigger focus&blur events at the correct time`, async () => {
    await setContentWithDesignSystem(
      page,
      `
          <div id="wrapper">
            <a href="#" id="before">before</a>
            <p-link-social href="#" icon="logo-facebook" id="my-link-social">Some label</p-link-social>
            <a href="#" id="after">after</a>
          </div>
    `
    );
    const link = await getLinkSocialHost();
    const before = await selectNode(page, '#before');
    const after = await selectNode(page, '#after');

    let beforeFocusCalls = 0;
    await addEventListener(before, 'focus', () => beforeFocusCalls++);
    let linkFocusCalls = 0;
    await addEventListener(link, 'focus', () => linkFocusCalls++);
    let linkFocusInCalls = 0;
    await addEventListener(link, 'focusin', () => linkFocusInCalls++);
    let linkBlurCalls = 0;
    await addEventListener(link, 'blur', () => linkBlurCalls++);
    let linkFocusOutCalls = 0;
    await addEventListener(link, 'focusout', () => linkFocusOutCalls++);
    let afterFocusCalls = 0;
    await addEventListener(after, 'focus', () => afterFocusCalls++);

    expect(beforeFocusCalls).toBe(0);
    expect(linkFocusCalls).toBe(0);
    expect(linkFocusInCalls).toBe(0);
    expect(linkBlurCalls).toBe(0);
    expect(linkFocusOutCalls).toBe(0);
    expect(afterFocusCalls).toBe(0);
    expect(await getActiveElementId(page)).toBe('');

    await page.keyboard.press('Tab');
    await waitForStencilLifecycle(page);
    expect(beforeFocusCalls).toBe(1);
    expect(linkFocusCalls).toBe(0);
    expect(linkFocusInCalls).toBe(0);
    expect(linkBlurCalls).toBe(0);
    expect(linkFocusOutCalls).toBe(0);
    expect(afterFocusCalls).toBe(0);
    expect(await getActiveElementId(page)).toBe('before');

    await page.keyboard.press('Tab');
    await waitForStencilLifecycle(page);
    expect(beforeFocusCalls).toBe(1);
    expect(linkFocusCalls).toBe(1);
    expect(linkFocusInCalls).toBe(1);
    expect(linkBlurCalls).toBe(0);
    expect(linkFocusOutCalls).toBe(0);
    expect(afterFocusCalls).toBe(0);
    expect(await getActiveElementId(page)).toBe('my-link-social');

    await page.keyboard.press('Tab');
    await waitForStencilLifecycle(page);
    expect(beforeFocusCalls).toBe(1);
    expect(linkFocusCalls).toBe(1);
    expect(linkFocusInCalls).toBe(1);
    expect(linkBlurCalls).toBe(1);
    expect(linkFocusOutCalls).toBe(1);
    expect(afterFocusCalls).toBe(1);
    expect(await getActiveElementId(page)).toBe('after');

    // tab back
    await page.keyboard.down('ShiftLeft');
    await page.keyboard.press('Tab');
    await waitForStencilLifecycle(page);
    expect(beforeFocusCalls).toBe(1);
    expect(linkFocusCalls).toBe(2);
    expect(linkFocusInCalls).toBe(2);
    expect(linkBlurCalls).toBe(1);
    expect(linkFocusOutCalls).toBe(1);
    expect(afterFocusCalls).toBe(1);
    expect(await getActiveElementId(page)).toBe('my-link-social');

    await page.keyboard.down('ShiftLeft');
    await page.keyboard.press('Tab');
    await waitForStencilLifecycle(page);
    expect(beforeFocusCalls).toBe(2);
    expect(linkFocusCalls).toBe(2);
    expect(linkFocusInCalls).toBe(2);
    expect(linkBlurCalls).toBe(2);
    expect(linkFocusOutCalls).toBe(2);
    expect(afterFocusCalls).toBe(1);
    expect(await getActiveElementId(page)).toBe('before');

    await page.keyboard.up('ShiftLeft');
  });

  it(`should provide methods to focus&blur the element`, async () => {
    await setContentWithDesignSystem(
      page,
      `
          <div id="wrapper">
            <a href="#" id="before">before</a>
            <p-link-social href="#" icon="logo-facebook">Some label</p-link-social>
          </div>
    `
    );

    const linkHasFocus = () => page.evaluate(() => document.activeElement === document.querySelector('p-link-social'));

    const link = await getLinkSocialHost();
    const before = await selectNode(page, '#before');
    await before.focus();
    expect(await linkHasFocus()).toBe(false);
    await link.focus();
    expect(await linkHasFocus()).toBe(true);
    await page.evaluate(() => {
      const linkElement = document.querySelector('p-link-social') as HTMLElement;
      linkElement.blur();
    });
    expect(await linkHasFocus()).toBe(false);
  });

  describe('focus state', () => {
    it('should be shown by keyboard navigation only for shadowed <a>', async () => {
      await initLinkSocial();

      const link = await getLinkSocialRealLink();
      const hidden = expectedStyleOnFocus({color: 'transparent'});
      const visible = expectedStyleOnFocus({color: 'default'}); // because of button click, :focus-visible & :hover

      expect(await getOutlineStyle(link)).toBe(hidden);

      await link.click();
      await waitForInheritedCSSTransition(page);

      expect(await getOutlineStyle(link)).toBe(hidden);

      await page.keyboard.down('ShiftLeft');
      await page.keyboard.press('Tab');
      await page.keyboard.up('ShiftLeft');
      await page.keyboard.press('Tab');

      expect(await getOutlineStyle(link)).toBe(visible);
    });

    it('should show outline of shadowed <a> when it is focused', async () => {
      await initLinkSocial();

      const host = await getLinkSocialHost();
      const link = await getLinkSocialRealLink();

      expect(await getStyleOnFocus(link)).toBe(expectedStyleOnFocus());

      await setAttribute(host, 'theme', 'dark');
      await waitForStencilLifecycle(page);
      expect(await getStyleOnFocus(link)).toBe(expectedStyleOnFocus({theme: 'dark'}));
    });

    it('should show outline of slotted <a> when it is focused', async () => {
      await initLinkSocial({useSlottedAnchor: true});

      const host = await getLinkSocialHost();
      const link = await getSlottedLink();

      expect(await getStyleOnFocus(link, 'outline', {pseudo: '::before'})).toBe(expectedStyleOnFocus());

      await setAttribute(host, 'theme', 'dark');
      await waitForStencilLifecycle(page);
      expect(await getStyleOnFocus(link, 'outline', {pseudo: '::before'})).toBe(expectedStyleOnFocus({theme: 'dark'}));
    });
  });
});
