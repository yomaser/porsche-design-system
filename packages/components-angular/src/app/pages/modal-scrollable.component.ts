import { Component } from '@angular/core';

@Component({
  selector: 'page-modal-scrollable',
  styles: [
    `
      .playground {
        height: 500px;
        padding: 0;
      }
    `
  ],
  template: `
    <div class="playground light" title="should show scrollable modal on light background">
      <p-modal [heading]="'Some Heading with a very long title across multiple lines'" [open]="'true'">
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
        dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
        clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet,
        consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed
        diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
        takimata sanctus est Lorem ipsum dolor sit amet.
        <br />
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
        dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
        clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet,
        consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed
        diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
        takimata sanctus est Lorem ipsum dolor sit amet.
        <p-modal-footer>
          <p-button>Confirm</p-button>
          <p-button variant="tertiary">Cancel</p-button>
        </p-modal-footer>
      </p-modal>
    </div>
  `
})
export class ModalScrollableComponent {
  constructor() {
    document.body.style.height = '500px';
  }
}
