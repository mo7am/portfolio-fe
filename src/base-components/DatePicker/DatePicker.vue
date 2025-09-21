<script setup lang="ts">
import FlatPickr from "vue-flatpickr-component";
import { useTheme } from "vuetify";

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
import { computed } from "vue";
import { ref } from "vue";
import { PropType } from "vue";
import { useAttrs } from "vue";
import { useFocus } from "@vueuse/core";
import { nextTick } from "vue";
import { watch } from "vue";
import { onMounted } from "vue";

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
  isTime: Boolean,
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
const menu = ref(false);
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
const clickedOutsidePicker = ref(false);

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
  if (!refFlatPicker.value?.fp?.calendarContainer) return;

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

const closeMenu = () => {
  clickedOutsidePicker.value = true;
  menu.value = false;
};

const onPickerClick = (e: any) => {
  const closestContainer = e?.target?.closest(`.flatpickr-calendar`);
  if (!closestContainer) {
    closeMenu();
  } else {
    clickedOutsidePicker.value = false;
  }
};

const hello = () => {
  if (props.isTime) {
    console.log(refFlatPicker.value);
  }
};

watch(menu, () => {
  if (clickedOutsidePicker.value) {
    menu.value = false;
    clickedOutsidePicker.value = false;
  } else {
    menu.value = true;
  }
});

onMounted(() => {
  window.addEventListener("click", onPickerClick);
});

onUnmounted(() => {
  window.removeEventListener("click", onPickerClick);
});
</script>

<template>
  <div class="app-picker-field">
    <VLabel
      v-if="fieldProps.label"
      class="mb-1 text-body-2 text-high-emphasis"
      :for="elementId"
      :text="fieldProps.label"
    />
    <span v-if="$attrs.isRequired" class="required-icon">*</span>
    <VMenu v-model="menu" location="top">
      <template #activator="{ props: activatorProps }">
        <VInput
          v-bind="{ ...inputProps, ...rootAttrs, ...activatorProps }"
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
                  <!-- simple input for inline prop -->
                  <FlatPickr
                    v-bind="compAttrs"
                    ref="refFlatPicker"
                    :model-value="modelValue"
                    @update:model-value="emitModelValue"
                    @on-open="isCalendarOpen = true"
                    @on-close="isCalendarOpen = false"
                    @on-change="!isTime ? closeMenu() : undefined"
                    v-if="isTime"
                  />
                  <input
                    :value="modelValue"
                    :placeholder="props.placeholder"
                    :readonly="isReadonly.value"
                    class="flat-picker-custom-style"
                    type="text"
                    v-else
                  />
                </div>
              </template>
            </VField>
          </template>
        </VInput>
      </template>
      <div class="relative w-fit">
        <!-- @click="(event: any) => onOutsideClick(event, () => clickedOutsidePicker = false)" -->
        <!-- <button
          type="button"
          @click="clickedOutsidePicker = true"
          class="bg-primary rounded-t-sm p-1 absolute top-[-20px] right-0"
        >
          <Lucide icon="X" class="w-4 h-4 m-auto" />
        </button> -->
        <!-- flat picker for inline props -->
        <FlatPickr
          v-bind="compAttrs"
          ref="refFlatPicker"
          :model-value="modelValue"
          @update:model-value="emitModelValue"
          @on-open="isCalendarOpen = true"
          @on-close="isCalendarOpen = false"
          @on-change="!isTime ? closeMenu() : undefined"
          v-if="!isTime"
        />
      </div>
    </VMenu>

    <!-- v-input -->
  </div>
</template>

<style lang="scss">
@import url("../../assets/styles/date_picker-styles.scss");
</style>
