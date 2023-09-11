import type { ElementHandle, Page } from 'puppeteer';
import {
  addEventListener,
  BASE_URL,
  expectA11yToMatchSnapshot,
  getAttribute,
  getElementStyle,
  getEventSummary,
  getHTMLAttributes,
  getLifecycleStatus,
  getProperty,
  goto,
  selectNode,
  setContentWithDesignSystem,
  setProperty,
  waitForStencilLifecycle,
} from '../helpers';
import { Components } from '@porsche-design-system/components';

let page: Page;
beforeEach(async () => {
  page = await browser.newPage();
  // to allow copy-paste to clipboard
  await browser
    .defaultBrowserContext()
    .overridePermissions(`${BASE_URL}/#`, ['clipboard-read', 'clipboard-write', 'clipboard-sanitized-write']);
});
afterEach(async () => await page.close());

const getHost = () => selectNode(page, 'p-pin-code');
const getLabel = () => selectNode(page, 'p-pin-code >>> .label__text');
const getCurrentInput = () => selectNode(page, 'p-pin-code >>> #current-input');
const getMessage = () => selectNode(page, 'p-pin-code >>> .message');
const getHiddenInput = () => selectNode(page, 'p-pin-code input[slot="hidden-input"]');
const getInput = (n: number) => selectNode(page, `p-pin-code >>> .input-container input:nth-child(${n})`);
const getActiveElementsAriaLabelInShadowRoot = (element: ElementHandle): Promise<string> => {
  return element.evaluate((el) => el.shadowRoot.activeElement.ariaLabel);
};

type InitOptions = {
  props?: Components.PPinCode;
  slots?: {
    label?: string;
    description?: string;
    message?: string;
  };
  options?: {
    isWithinForm?: boolean;
    markupBefore?: string;
    markupAfter?: string;
  };
};

const initPinCode = (opts?: InitOptions) => {
  const { props = { name: 'name' }, slots, options } = opts || {};
  const { isWithinForm = false, markupBefore = '', markupAfter = '' } = options || {};
  const { label = '', description = '', message = '' } = slots || {};

  const markup = `${markupBefore}
    <p-pin-code ${getHTMLAttributes(props)}>
      ${label}
      ${description}
      ${message}
    </p-pin-code>
    ${markupAfter}`;

  return setContentWithDesignSystem(page, isWithinForm ? `<form onsubmit="return false;">${markup}</form>` : markup);
};

describe('label', () => {
  it('should not render label if label prop is not defined but should render if changed programmatically', async () => {
    await initPinCode();
    const pinCodeComponent = await getHost();
    expect(await getLabel()).toBeNull();

    await setProperty(pinCodeComponent, 'label', 'Some label');
    await waitForStencilLifecycle(page);

    expect(await getLabel()).not.toBeNull();
  });

  it('should focus input with id="current-input" when label text is clicked', async () => {
    await initPinCode({ props: { label: 'Some label' } });
    const label = await getLabel();
    const input = await getCurrentInput();

    await addEventListener(input, 'focus');
    expect((await getEventSummary(input, 'focus')).counter).toBe(0);

    await label.click();

    expect((await getEventSummary(input, 'focus')).counter).toBe(1);
  });

  it('should show hover state on input when label is hovered', async () => {
    await initPinCode({ props: { label: 'Some label' } });
    await page.mouse.move(0, 300); // avoid potential hover initially
    const label = await getLabel();
    const input = await getCurrentInput();
    const initialBorderColor = await getElementStyle(input, 'borderColor');

    expect(await getElementStyle(input, 'borderColor')).toBe(initialBorderColor);

    await label.hover();

    expect(await getElementStyle(input, 'borderColor')).not.toBe(initialBorderColor);
  });
});

describe('within form', () => {
  describe('hidden input', () => {
    it('should be rendered', async () => {
      await initPinCode({ options: { isWithinForm: true } });
      const hiddenInput = await getHiddenInput();

      expect(hiddenInput).not.toBeNull();
    });

    it('should not be visible', async () => {
      await initPinCode({ options: { isWithinForm: true } });
      const hiddenInput = await getHiddenInput();

      expect(await getElementStyle(hiddenInput, 'opacity')).toBe('0');
    });

    it('should sync with name, value, disabled and required props', async () => {
      await initPinCode({ options: { isWithinForm: true } });
      const host = await getHost();
      const hiddenInput = await getHiddenInput();

      expect(await getProperty(hiddenInput, 'name')).toBe('name');
      expect(await getAttribute(hiddenInput, 'value')).toBe('');
      expect(await getProperty(hiddenInput, 'required')).toBeFalsy();
      expect(await getProperty(hiddenInput, 'disabled')).toBeFalsy();

      await setProperty(host, 'name', 'updatedName');
      await setProperty(host, 'value', ['1', '2', '3', '4']);
      await setProperty(host, 'disabled', true);
      await setProperty(host, 'required', true);
      await waitForStencilLifecycle(page);

      expect(await getProperty(hiddenInput, 'name')).toBe('updatedName');
      expect(await getProperty(hiddenInput, 'value')).toBe('1234');
      expect(await getProperty(hiddenInput, 'required')).toBeTruthy();
      expect(await getProperty(hiddenInput, 'disabled')).toBeTruthy();
    });
  });

  it('should submit on key Enter', async () => {
    await initPinCode({ options: { isWithinForm: true } });
    const host = await getHost();
    const input = await getCurrentInput();
    const form = await selectNode(page, 'form');
    await addEventListener(form, 'submit');
    await setProperty(host, 'value', ['1', '2', '3', '4']);

    expect((await getEventSummary(form, 'submit')).counter, 'initial').toBe(0);

    await input.click();
    await page.keyboard.press('Enter');
    await waitForStencilLifecycle(page);

    expect((await getEventSummary(form, 'submit')).counter, 'after Enter').toBe(1);
    expect(
      await form.evaluate((form: HTMLFormElement) => Array.from(new FormData(form).values()).join()),
      'after Enter'
    ).toEqual('1234');
  });
});

describe('update event', () => {
  it('should not render hidden input', async () => {
    await initPinCode();
    const hiddenInput = await getHiddenInput();

    expect(hiddenInput).toBeNull();
  });

  it('should emit update event on valid input and focus next input if there is one', async () => {
    await initPinCode();
    const host = await getHost();
    await addEventListener(host, 'update');
    const currentInput = await getCurrentInput();

    await currentInput.click();
    await waitForStencilLifecycle(page);

    expect((await getEventSummary(host, 'update')).counter, 'before input').toBe(0);
    expect(await getActiveElementsAriaLabelInShadowRoot(host)).toBe('1-4');

    page.keyboard.press('1');
    await waitForStencilLifecycle(page);

    expect((await getEventSummary(host, 'update')).counter, 'after input').toBe(1);
    expect(await getActiveElementsAriaLabelInShadowRoot(host)).toBe('2-4');
    expect((await getEventSummary(host, 'update')).details, 'after input').toEqual([
      {
        value: ['1', '', '', ''],
      },
    ]);

    page.keyboard.press('2');
    await waitForStencilLifecycle(page);

    expect((await getEventSummary(host, 'update')).counter, 'after input').toBe(2);
    expect(await getActiveElementsAriaLabelInShadowRoot(host)).toBe('3-4');
    expect((await getEventSummary(host, 'update')).details, 'after input').toEqual([
      {
        value: ['1', '', '', ''],
      },
      {
        value: ['1', '2', '', ''],
      },
    ]);

    page.keyboard.press('3');
    await waitForStencilLifecycle(page);

    expect((await getEventSummary(host, 'update')).counter, 'after input').toBe(3);
    expect(await getActiveElementsAriaLabelInShadowRoot(host)).toBe('4-4');
    expect((await getEventSummary(host, 'update')).details, 'after input').toEqual([
      {
        value: ['1', '', '', ''],
      },
      {
        value: ['1', '2', '', ''],
      },
      {
        value: ['1', '2', '3', ''],
      },
    ]);

    page.keyboard.press('4');
    await waitForStencilLifecycle(page);

    expect((await getEventSummary(host, 'update')).counter, 'after input').toBe(4);
    expect(await getActiveElementsAriaLabelInShadowRoot(host)).toBe('4-4');
    expect((await getEventSummary(host, 'update')).details, 'after input').toEqual([
      {
        value: ['1', '', '', ''],
      },
      {
        value: ['1', '2', '', ''],
      },
      {
        value: ['1', '2', '3', ''],
      },
      {
        value: ['1', '2', '3', '4'],
      },
    ]);
  });

  // (alphanumeric, "Dead" (e.g. ^¨), "Process" (e.g.^ in firefox)
  it('should not emit update event on not valid input', async () => {
    await initPinCode();
    const host = await getHost();
    await addEventListener(host, 'update');
    const input = await getCurrentInput();

    await input.click();
    await waitForStencilLifecycle(page);

    expect((await getEventSummary(host, 'update')).counter, 'before input').toBe(0);

    page.keyboard.press('a');
    await waitForStencilLifecycle(page);

    expect((await getEventSummary(host, 'update')).counter, 'after input').toBe(0);
    expect((await getEventSummary(host, 'update')).details, 'after input').toEqual([]);
    expect(await getProperty(input, 'value')).toBe('');

    page.keyboard.press('^');
    await waitForStencilLifecycle(page);

    expect((await getEventSummary(host, 'update')).counter, 'after input').toBe(0);
    expect((await getEventSummary(host, 'update')).details, 'after input').toEqual([]);
    expect(await getProperty(input, 'value')).toBe('');
  });

  it('should emit update event on backspace and focus correct input element', async () => {
    await initPinCode();
    const host = await getHost();
    await setProperty(host, 'value', ['1', '2', '3', '4']);
    await addEventListener(host, 'update');
    const input4 = await getInput(4);

    await input4.click();
    await waitForStencilLifecycle(page);

    expect((await getEventSummary(host, 'update')).counter, 'before backspace').toBe(0);

    page.keyboard.press('Backspace');
    await waitForStencilLifecycle(page);

    expect((await getEventSummary(host, 'update')).counter, 'after backspace').toBe(1);
    expect(await getActiveElementsAriaLabelInShadowRoot(host)).toBe('4-4');
    expect((await getEventSummary(host, 'update')).details, 'after backspace').toEqual([
      {
        value: ['1', '2', '3', ''],
      },
    ]);

    page.keyboard.press('Backspace');
    await waitForStencilLifecycle(page);

    expect((await getEventSummary(host, 'update')).counter, 'after backspace').toBe(2);
    expect(await getActiveElementsAriaLabelInShadowRoot(host)).toBe('3-4');
    expect((await getEventSummary(host, 'update')).details, 'after backspace').toEqual([
      {
        value: ['1', '2', '3', ''],
      },
      {
        value: ['1', '2', '', ''],
      },
    ]);
  });

  it('should emit update event on delete and focus correct input element', async () => {
    await initPinCode();
    const host = await getHost();
    await setProperty(host, 'value', ['1', '2', '3', '4']);
    await addEventListener(host, 'update');
    const input1 = await getInput(1);

    await input1.click();
    await waitForStencilLifecycle(page);

    expect((await getEventSummary(host, 'update')).counter, 'before delete').toBe(0);

    page.keyboard.press('Delete');
    await waitForStencilLifecycle(page);

    expect((await getEventSummary(host, 'update')).counter, 'after delete').toBe(1);
    expect(await getActiveElementsAriaLabelInShadowRoot(host)).toBe('1-4');
    expect((await getEventSummary(host, 'update')).details, 'after delete').toEqual([
      {
        value: ['', '2', '3', '4'],
      },
    ]);

    page.keyboard.press('Delete');
    await waitForStencilLifecycle(page);

    expect((await getEventSummary(host, 'update')).counter, 'after delete').toBe(2);
    expect(await getActiveElementsAriaLabelInShadowRoot(host)).toBe('2-4');
    expect((await getEventSummary(host, 'update')).details, 'after delete').toEqual([
      {
        value: ['', '2', '3', '4'],
      },
      {
        value: ['', '', '3', '4'],
      },
    ]);
  });
});

describe('events', () => {
  describe('onInput', () => {
    it('should spread value over input elements and focus last input element', async () => {
      await initPinCode();
      const host = await getHost();
      const input1 = await getInput(1);
      const input2 = await getInput(2);
      const input3 = await getInput(3);
      const input4 = await getInput(4);
      await addEventListener(input4, 'focus');

      expect((await getEventSummary(input4, 'focus')).counter).toBe(0);

      await input1.type('1234');
      await waitForStencilLifecycle(page);

      expect(await getProperty(input1, 'value')).toBe('1');
      expect(await getProperty(input2, 'value')).toBe('2');
      expect(await getProperty(input3, 'value')).toBe('3');
      expect(await getProperty(input4, 'value')).toBe('4');
      expect(await getActiveElementsAriaLabelInShadowRoot(host)).toBe('4-4');
      expect(await getProperty(host, 'value')).toStrictEqual(['1', '2', '3', '4']);
    });

    it('should spread value over input elements and focus last empty input element if value is too short', async () => {
      await initPinCode();
      const host = await getHost();
      const input1 = await getInput(1);
      const input2 = await getInput(2);
      const input3 = await getInput(3);
      const input4 = await getInput(4);
      await addEventListener(input4, 'focus');

      expect((await getEventSummary(input4, 'focus')).counter).toBe(0);

      await input1.type('12');
      await waitForStencilLifecycle(page);

      expect(await getProperty(input1, 'value')).toBe('1');
      expect(await getProperty(input2, 'value')).toBe('2');
      expect(await getProperty(input3, 'value')).toBe('');
      expect(await getProperty(input4, 'value')).toBe('');
      expect(await getActiveElementsAriaLabelInShadowRoot(host)).toBe('3-4');
      expect(await getProperty(host, 'value')).toStrictEqual(['1', '2', '', '']);
    });
  });

  // TODO: support for onPaste event is currently very low, therefore this test is commented out
  xit('should spread value over input elements and focus last input element on paste', async () => {
    await goto(page, ''); // need to have actual window.location
    await initPinCode();
    const host = await getHost();
    const input1 = await getInput(1);
    const input2 = await getInput(2);
    const input3 = await getInput(3);
    const input4 = await getInput(4);
    await addEventListener(input4, 'focus');

    expect((await getEventSummary(input4, 'focus')).counter).toBe(0);

    await page.bringToFront();
    await page.evaluate(async () => await navigator.clipboard.writeText('1234'));
    await input1.focus();
    await page.evaluate(async () => await navigator.clipboard.readText());
    await waitForStencilLifecycle(page);

    // await page.keyboard.down('Meta');
    // await page.keyboard.press('KeyV');
    // await page.keyboard.up('Meta');
    // await waitForStencilLifecycle(page);

    expect(await getProperty(input1, 'value')).toBe('1');
    expect(await getProperty(input2, 'value')).toBe('2');
    expect(await getProperty(input3, 'value')).toBe('3');
    expect(await getProperty(input4, 'value')).toBe('4');
    expect(await getActiveElementsAriaLabelInShadowRoot(host)).toBe('4-4');
  });
});

describe('disabled state', () => {
  it('should have not-allowed cursor', async () => {
    await initPinCode({ props: { disabled: true } });
    const input = await getCurrentInput();

    expect(await getElementStyle(input, 'cursor')).toBe('not-allowed');
  });

  it('should not be focusable', async () => {
    await initPinCode({ props: { disabled: true }, options: { markupAfter: '<p-button>Some Button</p-button>' } });
    const button = await selectNode(page, 'p-button');
    await addEventListener(button, 'focus');

    expect((await getEventSummary(button, 'focus')).counter, 'before focus').toBe(0);

    await page.keyboard.press('Tab');
    expect((await getEventSummary(button, 'focus')).counter, 'before focus').toBe(1);
  });
});

describe('loading state', () => {
  it('should have not-allowed cursor', async () => {
    await initPinCode({ props: { loading: true } });
    const input = await getCurrentInput();

    expect(await getElementStyle(input, 'cursor')).toBe('not-allowed');
  });

  it('should be focusable but input can not be changed', async () => {
    await initPinCode({ props: { loading: true } });
    const input = await getCurrentInput();
    await addEventListener(input, 'focus');

    expect(await getProperty(input, 'value')).toBe('');
    expect((await getEventSummary(input, 'focus')).counter, 'before focus').toBe(0);

    await page.keyboard.press('Tab');
    expect((await getEventSummary(input, 'focus')).counter, 'before focus').toBe(1);

    await page.keyboard.press('1');
    expect(await getProperty(input, 'value')).toBe('');
  });

  it('should be possible to navigate through inputs by key=Tab/Shift+Tab', async () => {
    await initPinCode({ props: { loading: true }, options: { markupAfter: '<p-button>Some Button</p-button>' } });
    const host = await getHost();
    const button = await selectNode(page, 'p-button');
    await addEventListener(button, 'focus');

    await page.keyboard.press('Tab');
    expect(await getActiveElementsAriaLabelInShadowRoot(host)).toBe('1-4');

    await page.keyboard.press('Tab');
    expect(await getActiveElementsAriaLabelInShadowRoot(host)).toBe('2-4');

    await page.keyboard.press('Tab');
    expect(await getActiveElementsAriaLabelInShadowRoot(host)).toBe('3-4');

    await page.keyboard.press('Tab');
    expect(await getActiveElementsAriaLabelInShadowRoot(host)).toBe('4-4');

    await page.keyboard.press('Tab');
    expect((await getEventSummary(button, 'focus')).counter, 'after focus').toBe(1);
  });
});

describe('lifecycle', () => {
  it('should work without unnecessary round trips on init', async () => {
    await initPinCode();
    const status = await getLifecycleStatus(page);

    expect(status.componentDidLoad['p-pin-code'], 'componentDidLoad: p-pin-code').toBe(1);

    expect(status.componentDidLoad.all, 'componentDidLoad: all').toBe(1);
    expect(status.componentDidUpdate.all, 'componentDidUpdate: all').toBe(0);
  });

  it('should work without unnecessary round trips after prop change', async () => {
    await initPinCode();
    const host = await getHost();

    await setProperty(host, 'label', 'Some Label');
    await waitForStencilLifecycle(page);
    const status = await getLifecycleStatus(page);

    expect(status.componentDidUpdate['p-pin-code'], 'componentDidUpdate: p-pin-code').toBe(1);

    expect(status.componentDidLoad.all, 'componentDidLoad: all').toBe(1);
    expect(status.componentDidUpdate.all, 'componentDidUpdate: all').toBe(1);
  });
});

describe('accessibility', () => {
  it('should expose correct initial accessibility tree', async () => {
    await initPinCode({ props: { label: 'Some label' } });
    const input = await getCurrentInput();

    await expectA11yToMatchSnapshot(page, input);
  });

  it('should expose correct accessibility tree with description text', async () => {
    await initPinCode({ props: { label: 'Some label', description: 'Some description' } });
    const input = await getCurrentInput();

    await expectA11yToMatchSnapshot(page, input);
  });

  it('should expose correct accessibility tree in error state', async () => {
    await initPinCode({
      props: { label: 'Some label', description: 'Some description', state: 'error', message: 'Some error message' },
    });
    const input = await getCurrentInput();
    const message = await getMessage();

    await expectA11yToMatchSnapshot(page, input, { message: 'Of Input' });
    await expectA11yToMatchSnapshot(page, message, { message: 'Of Message', interestingOnly: false });
  });

  it('should expose correct accessibility tree in disabled state', async () => {
    await initPinCode({
      props: { label: 'Some label', description: 'Some description', disabled: true },
    });
    const input = await getCurrentInput();

    await expectA11yToMatchSnapshot(page, input);
  });

  it('should expose correct accessibility tree in loading state', async () => {
    await initPinCode({
      props: { label: 'Some label', description: 'Some description', loading: true },
    });
    const input = await getCurrentInput();

    await expectA11yToMatchSnapshot(page, input);
  });

  it('should expose correct accessibility tree in required state', async () => {
    await initPinCode({
      props: { label: 'Some label', description: 'Some description', required: true },
    });
    const input = await getCurrentInput();

    await expectA11yToMatchSnapshot(page, input);
  });

  it('should add/remove accessibility tree if state changes programmatically', async () => {
    await initPinCode({ props: { label: 'Some label' } });
    const host = await getHost();

    await setProperty(host, 'state', 'error');
    await setProperty(host, 'message', 'Some error message.');
    await waitForStencilLifecycle(page);

    const input = await getCurrentInput();
    const message = await getMessage();

    await expectA11yToMatchSnapshot(page, input, { message: 'Of Input when state = error' });
    await expectA11yToMatchSnapshot(page, message, {
      message: 'Of Message when state = error',
      interestingOnly: false,
    });

    await setProperty(host, 'state', 'success');
    await setProperty(host, 'message', 'Some success message.');
    await waitForStencilLifecycle(page);

    await expectA11yToMatchSnapshot(page, input, { message: 'Of Input when state = success' });
    await expectA11yToMatchSnapshot(page, message, {
      message: 'Of Message when state = success',
      interestingOnly: false,
    });

    await setProperty(host, 'state', 'none');
    await setProperty(host, 'message', '');
    await waitForStencilLifecycle(page);

    await expectA11yToMatchSnapshot(page, input, { message: 'Of Input when state = none' });
  });
});
