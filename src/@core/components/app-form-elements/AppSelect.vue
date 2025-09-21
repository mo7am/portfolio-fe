<script lang="ts" setup>
defineOptions({
  name: "AppSelect",
  inheritAttrs: false,
});

const elementId = computed(() => {
  const attrs = useAttrs();
  const _elementIdToken = attrs.id || attrs.label;

  return _elementIdToken
    ? `app-select-${_elementIdToken}-${Math.random().toString(36).slice(2, 7)}`
    : undefined;
});

const label = computed(() => useAttrs().label as string | undefined);
</script>

<template>
  <div class="app-select flex-grow-1 relative" :class="$attrs.class">
    <VLabel v-if="label" :for="elementId" class="mb-2" :text="label">
      <span v-if="$attrs.isRequired" class="required-icon">*</span>
    </VLabel>
    <span v-if="$attrs.showHint" class="dots" variant="outlined">
      <VIcon
        size="15"
        icon="tabler-exclamation-circle"
        class="mr-1 cursor-pointer"
        style="margin-left: 5px"
      />
      <VTooltip open-delay="500" location="top" activator="parent">
        <span>{{ $attrs.messageHint }}</span>
      </VTooltip>
    </span>

    <VSelect
      v-bind="{
        ...$attrs,
        placeholder: '',
        class: null,
        label: undefined,
        variant: 'outlined',
        id: elementId,
        menuProps: {
          contentClass: [
            'app-inner-list',
            'app-select__content',
            'v-select__content',
            $attrs.multiple !== undefined ? 'v-list-select-multiple' : '',
          ],
        },
      }"
    >
      <template v-for="(_, name) in $slots" #[name]="slotProps">
        <slot :name="name" v-bind="slotProps || {}" />
      </template>
    </VSelect>
    <span
      class="absolute top-[58%] z-[-1] text-[#aaa8b0] left-[14px]"
      v-if="!$attrs.modelValue && !($attrs.modelValue as any)?.length"
      >{{ $attrs.placeholder }}</span
    >
  </div>
</template>
