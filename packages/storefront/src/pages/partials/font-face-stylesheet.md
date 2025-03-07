# Font Face Stylesheet

**Function name:** `getFontFaceStylesheet()`

If you use the Porsche Design System components we inject a stylesheet with all font-face definitions into the head of
your application as soon as our core is loaded. Regarding which font-styles you use on your page, these fonts are
downloaded from our CDN. This can lead (for the first time) to a decent rendering glitch of your texts. To improve
rendering we recommend that you load the stylesheet on your own.

Therefore, we provide a ready to use partial in all `@porsche-design-system/components-{js|angular|react|vue}` packages
which needs to be injected into the `<head>` of your `index.html`.

We suggest that `getFontFaceStylesheet()` partial is implemented in every application that uses the Porsche Design
System therefore the partial provides additional link tags with `rel="preconnect"` and `rel="dns-prefetch"` to improve
the performance of the initial connection to our cdn.

An in-depth optimization guide can be found at
[Vanilla Js Optimization](must-know/initialization/vanilla-js#optimization).

## Supported options

| Option   | Description                                                                                                              | Type    | Default |
| -------- | ------------------------------------------------------------------------------------------------------------------------ | ------- | ------- | -------- |
| `cdn`    | Decides from which CDN the resources are loaded.                                                                         | `'auto' | 'cn'`   | `'auto'` |
| `format` | Defines the output format of the partial. By default it returns a html string, with `jsx` it returns valid jsx elements. | `'html' | 'jsx'`  | `'html'` |

## Examples

Project integration differs based on the project setup.  
The following showcases the most common ways.

<PartialDocs name="getFontFaceStylesheet" :params="params" location="head"></PartialDocs>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class Code extends Vue {
  public params = [
    {
      value: ""
    },
    {
      value: "{ cdn: 'cn' }",
      comment: 'force using China CDN',
    },
  ];
}
</script>
