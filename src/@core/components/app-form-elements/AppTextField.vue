<script lang="ts" setup>
defineOptions({
  name: "AppTextField",
  inheritAttrs: false,
});
const elementId = computed(() => {
  const attrs = useAttrs();
  const _elementIdToken = attrs.id || attrs.label;

  return _elementIdToken
    ? `app-text-field-${_elementIdToken}-${Math.random()
        .toString(36)
        .slice(2, 7)}`
    : undefined;
});

const label = computed(() => useAttrs().label as string | undefined);
</script>

<template>
  <div class="app-text-field flex-grow-1" :class="$attrs.class">
    <VLabel v-if="label" :for="elementId" class="mb-2" :text="label">
      <span v-if="$attrs.isRequired" class="required-icon">*</span>
    </VLabel>
    <div class="relative">
      <VTextField
        v-bind="{
          ...$attrs,
          class: null,
          label: undefined,
          variant: 'outlined',
          id: elementId,
        }"
      >
        <template v-for="(_, name) in $slots" #[name]="slotProps">
          <slot :name="name" v-bind="slotProps || {}" />
        </template>
        <span v-if="$attrs.hasInnerLabel"
          >{{ $attrs.innerLabelValue }} &nbsp;</span
        >
      </VTextField>

      <svg
        v-if="$attrs.isSearchBox"
        class="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-7 text-primary"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-4.78-4.78m-7.07 1.62a8 8 0 111.41-1.41L21 21"
        ></path>
      </svg>
      <svg
        v-if="$attrs.hasClosedBtn && $attrs.isSelectedItem"
        @click="$emit('callRemoveOption')"
        class="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-7 text-primary"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
      <svg
        :id="`${$attrs.currentId}`"
        v-if="$attrs.hasCapsLock"
        viewBox="-1.6 -1.6 19.20 19.20"
        xmlns="http://www.w3.org/2000/svg"
        fill="#ff6f61"
        class="mr-6 absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-7 text-primary"
        stroke="#ff6f61"
        stroke-width="0.00016"
        transform="matrix(-1, 0, 0, 1, 0, 0)rotate(0)"
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke="#CCCCCC"
          stroke-width="0.032"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M7.27 1.047a1 1 0 0 1 1.46 0l6.345 6.77c.6.638.146 1.683-.73 1.683H11.5v1a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1H1.654C.78 9.5.326 8.455.924 7.816L7.27 1.047zM4.5 13.5a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1z"
          ></path>
        </g>
      </svg>
    </div>
  </div>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .left-11 {
    left: 11.9rem;
  }
}
</style>
