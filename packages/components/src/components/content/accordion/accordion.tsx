import { Component, Element, Event, EventEmitter, Prop, h } from '@stencil/core';
import type { BreakpointCustomizable, Theme } from '../../../types';
import { getPrefixedTagNames, isDark, mapBreakpointPropToClasses, SubsetTextWeight } from '../../../utils';
import { HeadlineTag } from '../../basic/typography/headline/headline-utils';
import { AccordionChangeEvent, AccordionHeaderSize } from './accordion-utils';

@Component({
  tag: 'p-accordion',
  styleUrl: 'accordion.scss',
  shadow: true,
})
export class Accordion {
  @Element() public host!: HTMLElement;

  /** The text size. */
  @Prop() public size?: BreakpointCustomizable<AccordionHeaderSize> = 'small';

  /** The text weight. */
  @Prop() public weight?: SubsetTextWeight = 'semibold';

  /** Adapts the color when used on dark background. */
  @Prop() public theme?: Theme = 'light';

  /** Defines the heading used in accordion. */
  @Prop() public heading?: string;

  /** Sets a headline tag, so it fits correctly within the outline of the page. */
  @Prop() public tag?: HeadlineTag = 'h2';

  /** Defines if accordion is open. */
  @Prop() public open?: boolean;

  /** If it is the first Accordion it gets a border on top. */
  @Prop() public firstItem?: boolean;

  /** Emitted when accordion state is changed. */
  @Event({ bubbles: false }) public accordionChange: EventEmitter<AccordionChangeEvent>;

  public render(): JSX.Element {
    const labelledId = 'labelled';
    const controlsId = 'controls';

    const rootClasses = {
      ['root']: true,
      ['root--theme-dark']: isDark(this.theme),
      ['root--open']: this.open,
      ['root--weight-regular']: this.weight !== 'semibold',
      ['root--first-item']: this.firstItem,
      ...mapBreakpointPropToClasses('root--size', this.size),
    };

    const PrefixedTagNames = getPrefixedTagNames(this.host);

    return (
      <div class={rootClasses}>
        <PrefixedTagNames.pHeadline
          tag={this.tag}
          theme={this.theme}
          class="heading-wrapper"
          variant="inherit"
          onClick={this.handleAccordionClick}
        >
          <button aria-expanded={this.open} aria-controls={controlsId} id={labelledId}>
            <span class="heading">{this.heading || <slot name="heading" />}</span>
            <PrefixedTagNames.pIcon
              name="arrowHeadDown"
              aria-label={this.open ? 'Close icon' : 'Open icon'}
              class="icon"
              theme={this.theme}
            />
          </button>
        </PrefixedTagNames.pHeadline>
        <div id={controlsId} class="content" role="region" aria-labelledby={labelledId}>
          <slot />
        </div>
      </div>
    );
  }

  private handleAccordionClick = (): void => {
    this.accordionChange.emit({ open: !this.open });
  };
}
