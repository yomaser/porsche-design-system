import type { Theme } from '../../../utils/theme';
import type { FormState } from '../../../utils/form/form-state';
import { FunctionalComponent, h, Host } from '@stencil/core';
import { getRole, getPrefixedTagNames } from '../../../utils';
import { getDataThemeDarkAttribute } from '../../../utils/theme';

type StateMessageProps = {
  id?: string;
  state: FormState;
  message: string;
  theme: Theme;
  host: HTMLElement;
};

export const StateMessage: FunctionalComponent<StateMessageProps> = ({ id, state, message, theme, host }) => {
  const PrefixedTagNames = getPrefixedTagNames(host);
  const isErrorState = state === 'error';

  return (
    <Host {...getDataThemeDarkAttribute(theme)}>
      <span id={id} class="message" role={getRole(state)}>
        <PrefixedTagNames.pIcon
          name={isErrorState ? 'exclamation' : 'check'}
          color={isErrorState ? 'notification-error' : 'notification-success'}
          theme={theme}
          aria-hidden="true"
        />
        {message || <slot name="message" />}
      </span>
    </Host>
  );
};
