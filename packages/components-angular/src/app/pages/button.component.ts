/* Auto Generated File */
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'page-button',
  template: `
    <div class="playground light auto-layout" title="should render button primary with label only">
      <p-button [variant]="'primary'">Some label</p-button>
      <p-button [variant]="'primary'" [loading]="true">Some label</p-button>
      <p-button [variant]="'primary'" [disabled]="true">Some label</p-button>
    </div>
    <div class="playground light auto-layout" title="should render button primary with label and icon">
      <p-button [variant]="'primary'" [icon]="'arrow-right'">Some label</p-button>
      <p-button [variant]="'primary'" [icon]="'arrow-right'" [loading]="true">Some label</p-button>
      <p-button [variant]="'primary'" [icon]="'arrow-right'" [disabled]="true">Some label</p-button>
    </div>
    <div class="playground light auto-layout" title="should render button primary without label">
      <p-button [variant]="'primary'" [hideLabel]="true" [icon]="'arrow-right'">Some label</p-button>
      <p-button [variant]="'primary'" [hideLabel]="true" [icon]="'arrow-right'" [loading]="true">Some label</p-button>
      <p-button [variant]="'primary'" [hideLabel]="true" [icon]="'arrow-right'" [disabled]="true">Some label</p-button>
    </div>

    <div class="playground light auto-layout" title="should render button primary as default with label only">
      <p-button>Some label</p-button>
      <p-button [loading]="true">Some label</p-button>
      <p-button [disabled]="true">Some label</p-button>
    </div>
    <div class="playground light auto-layout" title="should render button primary as default with label and icon">
      <p-button [icon]="'arrow-right'">Some label</p-button>
      <p-button [icon]="'arrow-right'" [loading]="true">Some label</p-button>
      <p-button [icon]="'arrow-right'" [disabled]="true">Some label</p-button>
    </div>
    <div class="playground light auto-layout" title="should render button primary as default without label">
      <p-button [hideLabel]="true" [icon]="'arrow-right'">Some label</p-button>
      <p-button [hideLabel]="true" [icon]="'arrow-right'" [loading]="true">Some label</p-button>
      <p-button [hideLabel]="true" [icon]="'arrow-right'" [disabled]="true">Some label</p-button>
    </div>

    <div class="playground light auto-layout" title="should render button secondary with label only">
      <p-button [variant]="'secondary'">Some label</p-button>
      <p-button [variant]="'secondary'" [loading]="true">Some label</p-button>
      <p-button [variant]="'secondary'" [disabled]="true">Some label</p-button>
    </div>
    <div class="playground light auto-layout" title="should render button secondary with label and icon">
      <p-button [variant]="'secondary'" [icon]="'arrow-right'">Some label</p-button>
      <p-button [variant]="'secondary'" [icon]="'arrow-right'" [loading]="true">Some label</p-button>
      <p-button [variant]="'secondary'" [icon]="'arrow-right'" [disabled]="true">Some label</p-button>
    </div>
    <div class="playground light auto-layout" title="should render button secondary without label">
      <p-button [variant]="'secondary'" [hideLabel]="true" [icon]="'arrow-right'">Some label</p-button>
      <p-button [variant]="'secondary'" [hideLabel]="true" [icon]="'arrow-right'" [loading]="true">Some label</p-button>
      <p-button [variant]="'secondary'" [hideLabel]="true" [icon]="'arrow-right'" [disabled]="true">Some label</p-button>
    </div>

    <div
      class="playground light auto-layout"
      title="should render button secondary if tertiary prop is set (deprecated) with label"
    >
      <p-button [variant]="'tertiary'">Some label</p-button>
      <p-button [variant]="'tertiary'" [loading]="true">Some label</p-button>
      <p-button [variant]="'tertiary'" [disabled]="true">Some label</p-button>
    </div>
    <div
      class="playground light auto-layout"
      title="should render button secondary if tertiary prop is set (deprecated) with label and icon"
    >
      <p-button [variant]="'tertiary'" [icon]="'arrow-right'">Some label</p-button>
      <p-button [variant]="'tertiary'" [icon]="'arrow-right'" [loading]="true">Some label</p-button>
      <p-button [variant]="'tertiary'" [icon]="'arrow-right'" [disabled]="true">Some label</p-button>
    </div>
    <div
      class="playground light auto-layout"
      title="should render button secondary if tertiary prop is set (deprecated) without label"
    >
      <p-button [variant]="'tertiary'" [hideLabel]="true" [icon]="'arrow-right'">Some label</p-button>
      <p-button [variant]="'tertiary'" [hideLabel]="true" [icon]="'arrow-right'" [loading]="true">Some label</p-button>
      <p-button [variant]="'tertiary'" [hideLabel]="true" [icon]="'arrow-right'" [disabled]="true">Some label</p-button>
    </div>

    <div class="playground light auto-layout" title="should render button primary with responsive label">
      <p-button [hideLabel]="{ base: true, xs: false, s: true, m: false, l: true, xl: false }" [icon]="'arrow-right'"
        >Some label</p-button
      >
    </div>

    <div class="playground light auto-layout" title="should render button with specific icon">
      <p-button [icon]="'delete'">Some label</p-button>
      <p-button [iconSource]="'./assets/icon-custom-kaixin.svg'">Some label</p-button>
      <p-button [icon]="'delete'" [variant]="'primary'">Some label</p-button>
      <p-button [iconSource]="'./assets/icon-custom-kaixin.svg'" [variant]="'primary'">Some label</p-button>
      <p-button [icon]="'delete'" [variant]="'tertiary'">Some label</p-button>
      <p-button [iconSource]="'./assets/icon-custom-kaixin.svg'" [variant]="'tertiary'">Some label</p-button>
    </div>

    <div class="playground light auto-layout" title="should render button with multiline label">
      <p-button style="width: 15rem">Lorem ipsum dolor sit amet, consetetur sadipscing</p-button>
      <p-button style="width: 15rem" [icon]="'arrow-right'">Lorem ipsum dolor sit amet, consetetur sadipscing</p-button>
      <p-button style="width: 15rem" [icon]="'arrow-right'" [loading]="true"
        >Lorem ipsum dolor sit amet, consetetur sadipscing</p-button
      >
    </div>

    <div class="playground light auto-layout" title="should render button with centered text/icon if set to 100% width">
      <p-button [variant]="'primary'" style="width: 100%">Some label</p-button>
      <p-button [variant]="'primary'" [icon]="'arrow-right'" style="width: 100%">Some label</p-button>
      <p-button [variant]="'primary'" [hideLabel]="true" [icon]="'arrow-right'" style="width: 100%">Some label</p-button>
      <p-button [variant]="'primary'" [loading]="true" style="width: 100%">Some label</p-button>
      <p-button [variant]="'primary'" [disabled]="true" style="width: 100%">Some label</p-button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {}
