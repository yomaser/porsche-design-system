import { hasVisibleIcon, hasSlottedSubline, throwIfParentIsPTextAndIconIsNone } from './button-link-pure-utils';
import { LinkButtonPureIconName } from '../types';

describe('hasVisibleIcon()', () => {
  it('should return true if called with valid iconName', () => {
    expect(hasVisibleIcon('highway')).toBe(true);
  });

  it('should return false if iconName = none', () => {
    expect(hasVisibleIcon('none')).toBe(false);
  });
});

describe('hasSlottedSubline()', () => {
  it('should return true with slotted subline', () => {
    const host = document.createElement('p-link-pure');
    const paragraph = document.createElement('p');
    paragraph.slot = 'subline';
    host.appendChild(paragraph);

    expect(hasSlottedSubline(host)).toBe(true);
  });

  it('should return false without subline', () => {
    const host = document.createElement('p-link-pure');
    expect(hasSlottedSubline(host)).toBe(false);
  });
});

describe('throwIfParentIsPTextAndIconIsNone()', () => {
  it('should print warning if parent is p-text and icon is none', () => {
    const spy = jest.spyOn(global.console, 'warn').mockImplementation(() => {});
    const parent = document.createElement('p-text');
    const child = document.createElement('button');
    parent.appendChild(child);

    throwIfParentIsPTextAndIconIsNone(child, 'none');
    expect(spy).toBeCalledTimes(1);
  });

  it('should not warn if iconName !== "none"', () => {
    const spy = jest.spyOn(global.console, 'warn').mockImplementation(() => {});
    const parent = document.createElement('p-text');
    const child = document.createElement('button');
    parent.appendChild(child);

    throwIfParentIsPTextAndIconIsNone(child, 'highway');

    expect(spy).toBeCalledTimes(0);
  });

  it('should not warn if parent element is !== "p-text"', () => {
    const spy = jest.spyOn(global.console, 'warn').mockImplementation(() => {});
    const child = document.createElement('button');

    throwIfParentIsPTextAndIconIsNone(child, 'none');
    expect(spy).toBeCalledTimes(0);
  });
});
