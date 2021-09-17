import {
  attachConstructedCss,
  buildGlobalStyles,
  buildHostStyles,
  buildResponsiveHostStyles,
  buildResponsiveStyles,
  buildSlottedStyles,
  slottedCssMap,
  getCachedConstructedCss,
  getCss,
  isObject,
  mergeDeep,
  supportsConstructableStylesheets,
} from '.';
import * as jssUtils from './jss';
import type { JssStyle, Styles } from 'jss';

describe('getCss()', () => {
  const data: { input: Styles; result: string }[] = [
    { input: { ':host': { display: 'block', marginLeft: 5 } }, result: ':host{display:block;margin-left:5px}' },
    {
      input: { ':host': { display: 'block', marginLeft: '5px !important' } },
      result: ':host{display:block;margin-left:5px !important}',
    },
    {
      input: { ':host': { display: 'block', width: 500, transition: 'width .25s ease' } },
      result: ':host{display:block;width:500px;transition:width .25s ease}',
    },
    {
      input: {
        ':host': { display: 'block', marginLeft: '5px !important' },
        '@media (min-width: 760px)': { ':host': { marginRight: '5px !important' } },
      },
      result:
        ':host{display:block;margin-left:5px !important}@media(min-width:760px){:host{margin-right:5px !important}}',
    },
    {
      input: {
        ':host': { display: 'block', marginLeft: '5px !important' },
        '@media (min-width: 760px)': { ':host': { marginRight: '5px !important' } },
        '@media (min-width: 1000px)': { ':host': { marginRight: '10px !important' } },
      },
      result:
        ':host{display:block;margin-left:5px !important}@media(min-width:760px){:host{margin-right:5px !important}}@media(min-width:1000px){:host{margin-right:10px !important}}',
    },
    {
      input: {
        ':host': { display: 'block', marginLeft: '5px !important' },
        '@media (min-width: 1000px)': { ':host': { marginRight: '10px !important' } },
        '@media (min-width: 760px)': { ':host': { marginRight: '5px !important' } },
      },
      result:
        ':host{display:block;margin-left:5px !important}@media(min-width:760px){:host{margin-right:5px !important}}@media(min-width:1000px){:host{margin-right:10px !important}}',
    },
    {
      input: { '@global': { div: { display: 'block' } } },
      result: 'div{display:block}',
    },
  ];
  it.each(
    data.map(({ input, result }) => [
      JSON.stringify(input), // for test description
      JSON.stringify(result), // for test description
      input,
      result,
    ])
  )(`should transform '%s' to %s`, (_, __, input: Styles, result: string) => {
    expect(getCss(input)).toBe(result);
  });
});

describe('supportsConstructableStylesheets()', () => {
  it('should return true if CSSStyleSheet constructor exists', () => {
    // due to polyfill
    expect(supportsConstructableStylesheets()).toBe(true);
  });

  it('should return false if CSSStyleSheet constructor does not exist', () => {
    const globalCSSStyleSheet = global.CSSStyleSheet;
    delete global.CSSStyleSheet;
    expect(supportsConstructableStylesheets()).toBe(false);
    global.CSSStyleSheet = globalCSSStyleSheet;
  });
});

describe('buildHostStyles()', () => {
  it('should return :host styles object', () => {
    expect(buildHostStyles({ marginLeft: 5 })).toStrictEqual({ ':host': { marginLeft: 5 } });
  });
});

describe('buildGlobalStyles()', () => {
  it('should return @global styles object', () => {
    expect(buildGlobalStyles({ div: { marginLeft: 5 } })).toStrictEqual({ '@global': { div: { marginLeft: 5 } } });
  });
});

describe('buildSlottedStyles()', () => {
  it('should return @global styles object with node selector and important styles', () => {
    const el = document.createElement('p-button');
    expect(buildSlottedStyles(el, { div: { marginLeft: 5 } })).toStrictEqual({
      '@global': { 'p-button': { div: { marginLeft: '5 !important' } } },
    });
  });
});

describe('buildResponsiveHostStyles()', () => {
  const getStyles = (val: number): JssStyle => ({ width: 100 * val });

  it('should return flat jss for simple type', () => {
    expect(buildResponsiveHostStyles(6, getStyles)).toStrictEqual({ ':host': { width: 600 } });
  });

  it('should return nested jss for responsive type', () => {
    expect(buildResponsiveHostStyles({ base: 6, xs: 3, s: 4, m: 5, l: 6, xl: 7 }, getStyles)).toStrictEqual({
      ':host': { width: 600 },
      '@media (min-width: 480px)': { ':host': { width: 300 } },
      '@media (min-width: 760px)': { ':host': { width: 400 } },
      '@media (min-width: 1000px)': { ':host': { width: 500 } },
      '@media (min-width: 1300px)': { ':host': { width: 600 } },
      '@media (min-width: 1760px)': { ':host': { width: 700 } },
    });
  });
});

describe('buildResponsiveStyles()', () => {
  const getStyles = (val: number): JssStyle => ({ root: { width: 100 * val } });

  it('should return flat jss for simple type', () => {
    expect(buildResponsiveStyles(6, getStyles)).toStrictEqual({ root: { width: 600 } });
  });

  it('should return nested jss for responsive type', () => {
    expect(buildResponsiveStyles({ base: 6, xs: 3, s: 4, m: 5, l: 6, xl: 7 }, getStyles)).toStrictEqual({
      root: { width: 600 },
      '@media (min-width: 480px)': { root: { width: 300 } },
      '@media (min-width: 760px)': { root: { width: 400 } },
      '@media (min-width: 1000px)': { root: { width: 500 } },
      '@media (min-width: 1300px)': { root: { width: 600 } },
      '@media (min-width: 1760px)': { root: { width: 700 } },
    });
  });
});

describe('isObject()', () => {
  it('should return true for object', () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ foo: 'bar' })).toBe(true);
  });

  it('should return false for other values', () => {
    expect(isObject('someString' as any)).toBe(false);
    expect(isObject(true as any)).toBe(false);
    expect(isObject([] as any)).toBe(false);
    expect(isObject(5 as any)).toBe(false);
  });
});

describe('mergeDeep()', () => {
  const data: { input: object[]; result: object }[] = [
    {
      input: [{}, { foo: 'bar' }],
      result: { foo: 'bar' },
    },
    {
      input: [{ foo: 'bar' }, {}, {}],
      result: { foo: 'bar' },
    },
    {
      input: [{ foo: 'bar' }, { xy: 1 }, { someVal: true }],
      result: { foo: 'bar', xy: 1, someVal: true },
    },
    {
      input: [{ foo: { key1: 'bar' } }, { foo: { key2: 'ok', key3: 'yea' }, some: 'thing' }],
      result: { foo: { key1: 'bar', key2: 'ok', key3: 'yea' }, some: 'thing' },
    },
    {
      input: [{ foo: { key1: 'bar' } }, { foo: { key1: 'ok' } }],
      result: { foo: { key1: 'ok' } },
    },
  ];
  it.each(
    data.map(({ input, result }) => [
      input.map((x) => JSON.stringify(x)).join(', '), // for test description
      JSON.stringify(result), // for test description
      input,
      result,
    ])
  )(`should be called with '%s' and return '%s'`, (_, __, input: object[], result: object) => {
    expect(mergeDeep(...input)).toStrictEqual(result);
  });
});

describe('attachCss()', () => {
  beforeEach(() => {
    slottedCssMap.clear();
  });

  it('should call getCachedComponentCss() with infinite parameters to retrieve cached css', () => {
    const host = document.createElement('p-some-component');
    host.attachShadow({ mode: 'open' });
    const spy = jest.spyOn(jssUtils, 'getCachedConstructedCss').mockImplementation(() => '');

    attachConstructedCss(host, (x: boolean) => 'some css', true);

    expect(spy).toHaveBeenCalledWith(host, expect.anything(), true);

    attachConstructedCss(host, (x: boolean, y: string, z: number) => 'some css', false, '', 1);

    expect(spy).toHaveBeenCalledWith(host, expect.anything(), false, '', 1);
  });

  describe('with CSSStyleSheet support', () => {
    it('should create CSSStyleSheet and apply it to shadowRoot', () => {
      const div = document.createElement('p-some-component');
      div.attachShadow({ mode: 'open' });

      expect(div.shadowRoot.adoptedStyleSheets.length).toBe(0);

      attachConstructedCss(div, () => ':host { display: "block" }');
      expect(div.shadowRoot.adoptedStyleSheets.length).toBe(1);
    });
  });

  describe('without CSSStyleSheet support', () => {
    it('should create style node and prepend it in shadowRoot', () => {
      const spy = jest.spyOn(jssUtils, 'supportsConstructableStylesheets').mockImplementation(() => false);

      const div = document.createElement('p-some-component');
      div.attachShadow({ mode: 'open' });
      expect(div.shadowRoot.querySelector('style')).toBeNull();

      const css = ':host { display: "block" }';
      attachConstructedCss(div, () => css);
      expect(div.shadowRoot.querySelector('style').innerHTML).toBe(css);

      spy.mockRestore();
    });
  });
});

describe('getCachedComponentCss()', () => {
  beforeEach(() => {
    slottedCssMap.clear();
  });

  it('should return css provided by css function', () => {
    const host = document.createElement('p-some-element');
    const getComponentCss = () => 'some css';

    expect(getCachedConstructedCss(host, getComponentCss)).toBe('some css');
  });

  it('should return css provided by css function depending on infinite arguments', () => {
    const host = document.createElement('p-some-element');
    const getComponentCss1 = (a: number, b: boolean) => `some css ${a} ${b}`;

    expect(getCachedConstructedCss(host, getComponentCss1, 1, true)).toBe('some css 1 true');

    const getComponentCss2 = (c: string) => `some css ${c}`;

    expect(getCachedConstructedCss(host, getComponentCss2, 'some string')).toBe('some css some string');
  });

  it('should call provided css function only once when it was already called before', () => {
    const host = document.createElement('p-some-element');
    const getComponentCss = jest.fn();

    getCachedConstructedCss(host, getComponentCss, 'some-param');

    expect(getComponentCss).toHaveBeenCalledTimes(1);

    getCachedConstructedCss(host, getComponentCss, 'some-param');

    expect(getComponentCss).toHaveBeenCalledTimes(1);

    getCachedConstructedCss(host, getComponentCss, 'another-param');

    expect(getComponentCss).toHaveBeenCalledTimes(2);
  });

  it('should call provided css function only once when it was already called before even with prefixed version of host', () => {
    const host = document.createElement('p-some-element');
    const hostPrefixed = document.createElement('my-prefix-p-some-element');
    const getComponentCss = jest.fn();

    getCachedConstructedCss(host, getComponentCss);

    expect(getComponentCss).toHaveBeenCalledTimes(1);

    getCachedConstructedCss(hostPrefixed, getComponentCss);

    expect(getComponentCss).toHaveBeenCalledTimes(1);
  });
});
