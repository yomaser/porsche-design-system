<script setup lang="ts">
  import { PInlineNotification } from '@porsche-design-system/components-vue';
  import { ref } from 'vue';

  const isActive = ref(false);
  const onShow = (): void => {
    isActive.value = true;
  };
  const onDismiss = (): void => {
    isActive.value = false;
  };
</script>

<template>
  <button type="button" @click="onShow">Show Inline Notification</button>
  <PInlineNotification
    v-if="isActive"
    :heading="'Some heading'"
    :description="'Some description.'"
    @dismiss="onDismiss"
  ></PInlineNotification>
</template>
