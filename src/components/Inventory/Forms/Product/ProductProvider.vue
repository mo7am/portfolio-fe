<script lang="ts" setup>
import { computed, provide, ComputedRef } from "vue";

export type ProductProvider = ComputedRef<{
  initialData: any;
  form: any;
}>;

interface ProviderProps {
  initialData: any;
  form: any;
}

const props = withDefaults(defineProps<ProviderProps>(), {
  initialData: {},
  form: {},
});

provide<ProductProvider>(
  "product-provider",
  computed(() => {
    return {
      initialData: props.initialData,
      form: props.form,
    };
  })
);
</script>

<template>
  <slot></slot>
</template>
