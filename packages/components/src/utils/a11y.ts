import { removeAttribute, setAttribute } from './dom';
import type { FormState, AriaAttributes } from '../types';

export type SetAriaAttributesOptions = {
  label?: string;
  message?: string;
  state?: FormState;
};

export const setAriaAttributes = (el: HTMLElement, opts: SetAriaAttributesOptions): void => {
  const { label, message, state } = opts;
  if (label) {
    setAttribute(el, 'aria-label', `${label}${message ? `. ${message}` : ''}`);
  }

  if (state === 'error') {
    setAttribute(el, 'aria-invalid', 'true');
  } else {
    removeAttribute(el, 'aria-invalid');
  }
};

export const parseAndGetAccessibilityAttributes = (input: AriaAttributes | string): AriaAttributes => {
  const attributes =
    typeof input === 'string'
      ? // input is potentially JSON parsable string, e.g. "{ base: 'block', l: 'inline' }" or "true" or "false"
        JSON.parse(
          input
            .replace(/'/g, '"') // convert single quotes to double quotes
            .replace(/[\s"]?([\w-]+)[\s"]?:/g, '"$1":') // wrap keys in double quotes
        )
      : // input is object, e.g. { base: 'block', l: 'inline' } or number, e.g. 123 or boolean, e.g. true
        input;

  // convert booleans to strings so that values are property set and not just empty attributes for true
  for (const attr in attributes) {
    const value = attributes[attr];
    if (typeof value === 'boolean') {
      attributes[attr] = `${value}`;
    }
  }

  return attributes;
};
