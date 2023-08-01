/* Auto Generated File */
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'page-multi-select',
  styles: [
    `
      @media only screen and (min-width: 760px) {
        #app,
        :host {
          display: grid;
          grid-template-columns: repeat(2, 50%);
        }
      }
    `,
  ],
  template: `
    <div class="playground light" title="should render basic multi select">
      <p-multi-select [name]="'name'" [label]="'Some Label'" [description]="'Some description'">
        <p-multi-select-option [value]="'a'">Option A</p-multi-select-option>
        <p-multi-select-option [value]="'b'">Option B</p-multi-select-option>
        <p-multi-select-option [value]="'c'">Option C</p-multi-select-option>
        <p-multi-select-option [value]="'d'">Option D</p-multi-select-option>
        <p-multi-select-option [value]="'e'">Option E</p-multi-select-option>
        <p-multi-select-option [value]="'f'">Option F</p-multi-select-option>
      </p-multi-select>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectComponent {}
