# Vue

<TableOfContents></TableOfContents>

## Prefixing

In case of a micro-service architecture, multiple instances and versions of the Porsche Design System can be combined in
a final application. This could cause conflicts due to the way how custom webcomponents are registered in the browser.
During the bootstrap phase of the Porsche Design System, custom elements are defined. If a second application wants to
register Porsche Design System again it will cause issues especially when different versions are used.

A way of preventing those conflicts is by using a unique custom prefix for the components. Simply pass your desired
prefix to the `prefix` property of `PorscheDesignSystemProvider`.

```tsx
// pages/App.vue

<script setup lang="ts">
  import AppComponent from './components/AppComponent.vue';
  import { PorscheDesignSystemProvider } from '@porsche-design-system/components-vue';
</script>

<template>
  <PorscheDesignSystemProvider prefix="sample-prefix">
    <AppComponent />
  </PorscheDesignSystemProvider>
</template>
```

In the following example the `PHeading` component will render as `<sample-prefix-p-heading>`.

```tsx
// AppComponent.vue

<script setup lang="ts">
  import { ref } from 'vue';
  import { PHeading } from '@porsche-design-system/components-vue';
</script>

<template>
  <PHeading>Heading</PHeading>
</template>
```
