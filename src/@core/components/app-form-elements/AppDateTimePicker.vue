<script setup lang="ts">
import FlatPickr from "vue-flatpickr-component";
import { useTheme } from "vuetify";

// @ts-expect-error There won't be declaration file for it
import {
  VField,
  filterFieldProps,
  makeVFieldProps,
} from "vuetify/lib/components/VField/VField";

// @ts-expect-error There won't be declaration file for it
import { VInput, makeVInputProps } from "vuetify/lib/components/VInput/VInput";

// @ts-expect-error There won't be declaration file for it
import { filterInputAttrs } from "vuetify/lib/util/helpers";
import { useConfigStore } from "@core/stores/config";

// inherit Attribute make false
defineOptions({
  inheritAttrs: false,
});

const props = defineProps({
  autofocus: Boolean,
  counter: [Boolean, Number, String] as PropType<true | number | string>,
  counterValue: Function as PropType<(value: any) => number>,
  prefix: String,
  placeholder: String,
  persistentPlaceholder: Boolean,
  persistentCounter: Boolean,
  suffix: String,
  type: {
    type: String,
    default: "text",
  },
  modelModifiers: Object as PropType<Record<string, boolean>>,
  ...makeVInputProps({
    density: "compact",
    hideDetails: "auto",
  }),
  ...makeVFieldProps({
    variant: "outlined",
    color: "primary",
  }),
});

const emit = defineEmits<Emit>();

interface Emit {
  (e: "click:control", val: MouseEvent): true;
  (e: "mousedown:control", val: MouseEvent): true;
  (e: "update:focused", val: MouseEvent): true;
  (e: "update:modelValue", val: string): void;
  (e: "click:clear", el: MouseEvent): void;
}

const configStore = useConfigStore();
const attrs = useAttrs();

const [rootAttrs, compAttrs] = filterInputAttrs(attrs);

const [{ modelValue: _, ...inputProps }] = VInput.filterProps(props);
const [fieldProps] = filterFieldProps(props);

const refFlatPicker = ref();
const { focused } = useFocus(refFlatPicker);
const isCalendarOpen = ref(false);
const isInlinePicker = ref(false);

// flat picker prop manipulation
if (compAttrs.config && compAttrs.config.inline) {
  isInlinePicker.value = compAttrs.config.inline;
  Object.assign(compAttrs, { altInputClass: "inlinePicker" });
}

// v-field clear prop
const onClear = (el: MouseEvent) => {
  el.stopPropagation();

  nextTick(() => {
    emit("update:modelValue", "");

    emit("click:clear", el);
  });
};

const vuetifyTheme = useTheme();

const vuetifyThemesName = Object.keys(vuetifyTheme.themes.value);

// Themes class added to flat-picker component for light and dark support
const updateThemeClassInCalendar = () => {
  // ℹ️ Flatpickr don't render it's instance in mobile and device simulator
  if (!refFlatPicker.value.fp.calendarContainer) return;

  vuetifyThemesName.forEach((t) => {
    refFlatPicker.value.fp.calendarContainer.classList.remove(`v-theme--${t}`);
  });
  refFlatPicker.value.fp.calendarContainer.classList.add(
    `v-theme--${vuetifyTheme.global.name.value}`
  );
};

watch(() => configStore.theme, updateThemeClassInCalendar);

onMounted(() => {
  updateThemeClassInCalendar();
});

const emitModelValue = (val: string) => {
  emit("update:modelValue", val);
};

const elementId = computed(() => {
  const _elementIdToken = fieldProps.id || fieldProps.label;

  return _elementIdToken
    ? `app-picker-field-${_elementIdToken}-${Math.random()
        .toString(36)
        .slice(2, 7)}`
    : undefined;
});
</script>

<template>
  <div class="app-picker-field">
    <!-- v-input -->
    <VLabel
      v-if="fieldProps.label"
      class="mb-1 text-body-2 text-high-emphasis"
      :for="elementId"
      :text="fieldProps.label"
    />

    <VInput
      v-bind="{ ...inputProps, ...rootAttrs }"
      :model-value="modelValue"
      :hide-details="props.hideDetails"
      :class="[
        {
          'v-text-field--prefixed': props.prefix,
          'v-text-field--suffixed': props.suffix,
          'v-text-field--flush-details': ['plain', 'underlined'].includes(
            props.variant
          ),
        },
        props.class,
      ]"
      class="position-relative v-text-field"
      :style="props.style"
    >
      <template #default="{ id, isDirty, isValid, isDisabled, isReadonly }">
        <!-- v-field -->
        <VField
          v-bind="{ ...fieldProps, label: undefined }"
          :id="id.value"
          role="textbox"
          :active="focused || isDirty.value || isCalendarOpen"
          :focused="focused || isCalendarOpen"
          :dirty="isDirty.value || props.dirty"
          :error="isValid.value === false"
          :disabled="isDisabled.value"
          @click:clear="onClear"
        >
          <template #default="{ props: vFieldProps }">
            <div v-bind="vFieldProps">
              <!-- flat-picker  -->
              <FlatPickr
                v-if="!isInlinePicker"
                v-bind="compAttrs"
                ref="refFlatPicker"
                :model-value="modelValue"
                :placeholder="props.placeholder"
                :readonly="isReadonly.value"
                class="flat-picker-custom-style"
                :disabled="isReadonly.value"
                @on-open="isCalendarOpen = true"
                @on-close="isCalendarOpen = false"
                @update:model-value="emitModelValue"
              />

              <!-- simple input for inline prop -->
              <input
                v-if="isInlinePicker"
                :value="modelValue"
                :placeholder="props.placeholder"
                :readonly="isReadonly.value"
                class="flat-picker-custom-style"
                type="text"
              />
            </div>
          </template>
        </VField>
      </template>
    </VInput>

    <!-- flat picker for inline props -->
    <FlatPickr
      v-if="isInlinePicker"
      v-bind="compAttrs"
      ref="refFlatPicker"
      :model-value="modelValue"
      @update:model-value="emitModelValue"
      @on-open="isCalendarOpen = true"
      @on-close="isCalendarOpen = false"
    />
  </div>
</template>

<style lang="scss">
@import url("../../../assets/styles/date_picker-styles.scss");
</style>
