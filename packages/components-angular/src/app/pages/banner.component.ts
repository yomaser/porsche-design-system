/* Auto Generated File */
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'page-banner',
  styles: [
    `
      .playground {
        padding: 0;
        transform: translate3d(0, 0, 0);
        margin: 16px 0 0;
        height: 20rem;
      }
    
      .playground::before {
        position: relative;
        top: 16px;
        left: 16px;
      }
    `,
  ],
  template: `
    <div class="playground light" title="should show banner with heading and description">
      <p-banner [open]="true" [heading]="'Heading'" [description]="'Description'"></p-banner>
    </div>

    <div class="playground light" title="should show banner with slotted heading and description">
      <p-banner [open]="true">
        <span slot="heading">Slotted heading</span>
        <span slot="description">
          <span>
            Slotted description. And some slotted and deeply nested <a [href]="'#'">anchor</a>, <b>bold</b>,
            <strong>strong</strong>, <em>emphasized</em> and <i>italic</i> text.
          </span>
        </span>
      </p-banner>
    </div>

    <div class="playground light" title="should show banner">
      <p-banner [open]="true">
        <span slot="title">Slotted title</span>
        <span slot="description">
          <span>
            Slotted description. And some slotted and deeply nested <a [href]="'#'">anchor</a>, <b>bold</b>,
            <strong>strong</strong>, <em>emphasized</em> and <i>italic</i> text.
          </span>
        </span>
      </p-banner>
    </div>

    <div class="playground light" title="should show banner with state neutral">
      <p-banner [open]="true" [state]="'neutral'">
        <span slot="title">Slotted Title (state=neutral)</span>
        <span slot="description">
          <span>
            Slotted description. And some slotted and deeply nested <a [href]="'#'">anchor</a>, <b>bold</b>,
            <strong>strong</strong>, <em>emphasized</em> and <i>italic</i> text.
          </span>
        </span>
      </p-banner>
    </div>

    <div class="playground light" title="should show banner with state warning">
      <p-banner [open]="true" [state]="'warning'">
        <span slot="title">Slotted Title (state=warning)</span>
        <span slot="description">
          <span>
            Slotted description. And some slotted and deeply nested <a [href]="'#'">anchor</a>, <b>bold</b>,
            <strong>strong</strong>, <em>emphasized</em> and <i>italic</i> text.
          </span>
        </span>
      </p-banner>
    </div>

    <div class="playground light" title="should show banner with state error">
      <p-banner [open]="true" [state]="'error'">
        <span slot="title">Slotted Title (state=error)</span>
        <span slot="description">
          <span>
            Slotted description. And some slotted and deeply nested <a [href]="'#'">anchor</a>, <b>bold</b>,
            <strong>strong</strong>, <em>emphasized</em> and <i>italic</i> text.
          </span>
        </span>
      </p-banner>
    </div>

    <div class="playground light" title="should show banner in persistent mode">
      <p-banner [open]="true" [persistent]="true">
        <span slot="title">Slotted Title (persistent=true)</span>
        <span slot="description">Slotted description</span>
      </p-banner>
    </div>

    <div class="playground light" title="should show banner without dismiss button">
      <p-banner [open]="true" [dismissButton]="false">
        <span slot="title">Slotted Title (dismissButton=false)</span>
        <span slot="description">Slotted description</span>
      </p-banner>
    </div>

    <div class="visualize-grid">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerComponent {}
