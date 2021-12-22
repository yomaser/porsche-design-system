import { JSX, Component, Prop, h, Element, Event, EventEmitter, Listen } from '@stencil/core';
import type { AlignLabel, BreakpointCustomizable, ThemeExtendedElectric } from '../../../types';
import {
  attachComponentCss,
  getPrefixedTagNames,
  improveButtonHandlingForCustomElement,
  improveFocusHandlingForCustomElement,
  isDisabledOrLoading,
} from '../../../utils';
import { getComponentCss } from './switch-styles';

export type SwitchChangeEvent = { checked: boolean };

@Component({
  tag: 'p-switch',
  shadow: true,
})
export class Switch {
  @Element() public host!: HTMLElement;

  /** Aligns the label. */
  @Prop() public alignLabel?: AlignLabel = 'right';

  /** Show or hide label. For better accessibility it's recommended to show the label. */
  @Prop() public hideLabel?: BreakpointCustomizable<boolean> = false;

  /** Stretches the contents to max available space. */
  @Prop() public stretch?: BreakpointCustomizable<boolean> = false;

  /** Visualize the switch with on/off status. */
  @Prop() public checked?: boolean = false;

  /** Disables the switch. No events will be triggered while disabled state is active. */
  @Prop() public disabled?: boolean = false;

  /** Disables the switch and shows a loading indicator. No events will be triggered while loading state is active. */
  @Prop() public loading?: boolean = false;

  /** To remove the element from tab order. */
  @Prop() public tabbable?: boolean = true;

  /** Adapts the switch color depending on the theme. */
  @Prop() public theme?: ThemeExtendedElectric = 'light';

  /** Emitted when checked status is changed. */
  @Event({ bubbles: false }) public switchChange: EventEmitter<SwitchChangeEvent>;

  @Listen('click', { capture: true })
  public onClick(e: MouseEvent): void {
    if (this.isDisabledOrLoading) {
      e.stopPropagation();
    }
  }

  public componentDidLoad(): void {
    improveFocusHandlingForCustomElement(this.host);
    improveButtonHandlingForCustomElement(
      this.host,
      () => 'button',
      () => this.isDisabledOrLoading
    );
  }

  public componentWillRender(): void {
    attachComponentCss(
      this.host,
      getComponentCss,
      this.alignLabel,
      this.hideLabel,
      this.stretch,
      this.checked,
      this.loading,
      this.isDisabledOrLoading,
      this.theme
    );
  }

  public render(): JSX.Element {
    const PrefixedTagNames = getPrefixedTagNames(this.host);

    return (
      <label class="root">
        <PrefixedTagNames.pText tag="span" color="inherit" class="text" id="label">
          <slot />
        </PrefixedTagNames.pText>
        <button
          type="button"
          role="switch"
          aria-labelledby="label"
          aria-checked={this.checked ? 'true' : 'false'}
          aria-busy={this.loading ? 'true' : null}
          disabled={this.disabled}
          tabindex={this.tabbable ? 0 : -1}
          onClick={this.onSwitchClick}
        >
          <span class="toggle">
            {this.loading && (
              <PrefixedTagNames.pSpinner
                class="spinner"
                size="inherit"
                theme={this.checked ? 'light' : 'dark'}
                aria={{ 'aria-label': 'Loading state' }}
              />
            )}
          </span>
        </button>
      </label>
    );
  }

  private onSwitchClick = (): void => {
    this.switchChange.emit({ checked: !this.checked });
  };

  private get isDisabledOrLoading(): boolean {
    return isDisabledOrLoading(this.disabled, this.loading);
  }
}
