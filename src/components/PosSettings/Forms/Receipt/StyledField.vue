<script setup lang="ts">
import Lucide from "@/base-components/Lucide/Lucide.vue";
import { GROUPED_FIELDS, DIRECTION_STYLES } from "./data";
import FileUploader from "@/base-components/FileUploader";

const props = defineProps<{
  field: any;
  keyVal: any;
  is_used?: boolean;
  isDeselectedByGroup?: boolean;
}>();

const emit = defineEmits([
  "selectField",
  "deSelectField",
  "deSelectFieldByGroup",
]);
const showMenu = ref(false);
const getOptionClassName =
  inject<(option: string) => string>("getOptionClassName");

const onFieldClick = () => {
  if (!props.is_used) {
    emit("selectField", props.field);
  } else {
    showMenu.value = !showMenu.value;
  }
};

const close = () => {
  showMenu.value = false;
};

const onFieldOptionStyleClick = (option: string) => {
  if (GROUPED_FIELDS.includes(props.field.name)) {
    props.field.selected_options[option] =
      !props.field.selected_options[option];

    if (props.field.name === "Taxes, Payment tool, fees and discounts") {
      if (!props.field.selected_options["Tax"]) {
        props.field.selected_options["Tax 1"] = false;
        props.field.selected_options["Tax 2"] = false;
        props.field.selected_options["split taxes"] = false;
      }
    }
    if (option === "split taxes") {
      if (props.field.options?.orderPayments) {
        const index = props.field.options.orderPayments.indexOf("Tax");
        if (index !== -1) {
          props.field.options.orderPayments.splice(index, 1, "Tax 1", "Tax 2");
        } else {
          const index1 = props.field.options.orderPayments.indexOf("Tax 1");
          const index2 = props.field.options.orderPayments.indexOf("Tax 2");
          if (index1 !== -1 && index2 === index1 + 1) {
            props.field.options.orderPayments.splice(index1, 2, "Tax");
          }
        }
      } else {
        const isTaxesSplitted = props.field.selected_options[option];
        props.field.selected_options["Tax 1"] = isTaxesSplitted;
        props.field.selected_options["Tax 2"] = isTaxesSplitted;
      }
    }

    return;
  }
  const optionIndex = props.field?.selected_styles?.findIndex(
    (o: string) => o === option
  );
  const isDirection = DIRECTION_STYLES.includes(option);

  if (optionIndex === -1) {
    if (isDirection) {
      const selectedDirIdx = props.field.selected_styles.findIndex(
        (o: string) => DIRECTION_STYLES.includes(o)
      );
      if (selectedDirIdx !== -1) {
        props.field.selected_styles[selectedDirIdx] = option;
        return;
      }
    }
    props.field.selected_styles.push(option);
  } else {
    props.field.selected_styles.splice(optionIndex, 1);
  }
};

const getGroupOptions = () => {
  return props.field.options.otherData;
};

const setLogo = (file: any) => {
  props.field.options.Logo = {
    image: file,
    is_editable: true,
  };
};

const onDeSelectClick = () => {
  emit("deSelectField", props.field, props.keyVal, false);
};

const addToDeselectedGroup = () => {
  emit("deSelectFieldByGroup", props.field, props.keyVal);
};

const showOptions = computed(() => {
  return (
    props.field.name === "Taxes, Payment tool, fees and discounts" ||
    (props.field?.type === "group" && props.field.name !== "Delivery Data")
  );
});
</script>
<template>
  <div class="relative w-full border-b py-[2px]">
    <div
      class="grid"
      :class="{
        'field-grid items-center gap-2': is_used,
      }"
    >
      <div
        class="w-4 h-4 flex rounded-sm border bg-white shadow-sm cursor-pointer"
        :class="{
          'bg-primary': isDeselectedByGroup,
        }"
        @click="addToDeselectedGroup"
        v-if="is_used"
      >
        <!-- v-if="is_used && !field.is_required" -->
        <Lucide
          icon="Check"
          class="w-4 h-4 m-auto text-white"
          v-if="isDeselectedByGroup"
        />
      </div>
      <!-- <div class="flex" v-else-if="is_used && field.is_required"></div> -->
      <button
        type="button"
        class="relative py-1 flex justify-between items-center"
        @click="onFieldClick"
      >
        <!-- :style="field.is_required ? 'margin-left:-35px' : ''" -->
        <p v-if="is_used">
          <VIcon icon="tabler-grip-vertical" /> {{ field.name }}
        </p>
        <p v-else class="flex">
          {{ field.name }}
          <span
            style="margin-top: -6px"
            v-if="field.is_required"
            class="required-icon"
            >*</span
          >
        </p>
        <p class="capitalize" v-if="!is_used">{{ field.type }}</p>
      </button>
    </div>

    <template v-if="is_used">
      <button
        class="absolute right-0 top-2"
        type="button"
        @click="onDeSelectClick"
        v-if="!isDeselectedByGroup"
      >
        <!-- v-if="!isDeselectedByGroup && !field.is_required" -->
        <Lucide icon="Trash2" class="w-4 h-4 text-danger cursor-pointer" />
      </button>
      <button
        v-if="field.name == 'Logo' || field.has_options"
        :style="'margin-right: 25px; margin-top: -3px'"
        class="absolute right-0 top-2"
        type="button"
        @click="onFieldClick"
      >
        <!-- :style="
          field.is_required
            ? 'margin-top: -3px'
            : 'margin-right: 25px; margin-top: -3px'
        " -->
        <VIcon
          :icon="'tabler-tool'"
          :size="'20'"
          class="w-4 h-4 text-info cursor-pointer"
        />
      </button>
      <div v-if="field.name == 'Logo' || (showMenu && field.has_options)">
        <VDialog v-model="showMenu" width="500">
          <!-- Dialog close btn -->
          <DialogCloseBtn @click="close()" />
          <VCard class="py-8 px-5">
            <templete>
              <div class="pb-2 flex flex-col gap-2" v-if="field.has_options">
                <div v-if="field?.options?.style?.length">
                  <h4 class="font-medium mb-1">Styles</h4>
                  <br />
                  <div
                    class="grid gap-1"
                    :class="[`grid-cols-${field?.options?.style?.length}`]"
                  >
                    <button
                      type="button"
                      variant="text"
                      class="px-2 text-center rounded-sm border hover:bg-slate-100 transition"
                      :class="{
                        '!border-green-600':
                          field?.selected_styles?.includes(option),
                      }"
                      @click="onFieldOptionStyleClick(option)"
                      v-for="option in field.options.style"
                      :key="option"
                    >
                      <span
                        :class="
                          getOptionClassName && getOptionClassName(option)
                        "
                      >
                        {{ option }}
                      </span>
                    </button>
                  </div>
                </div>
                <div v-if="field?.options?.direction?.length">
                  <h4 class="font-medium mb-1">Direction</h4>
                  <br />
                  <div
                    class="grid gap-1"
                    :class="[`grid-cols-${field?.options?.direction?.length}`]"
                  >
                    <button
                      type="button"
                      variant="text"
                      class="px-2 text-center rounded-sm border hover:bg-slate-100 transition"
                      :class="{
                        '!border-green-600':
                          field?.selected_styles?.includes(option),
                      }"
                      @click="onFieldOptionStyleClick(option)"
                      v-for="option in field.options.direction"
                      :key="option"
                    >
                      <span
                        :class="
                          getOptionClassName && getOptionClassName(option)
                        "
                      >
                        {{ option }}
                      </span>
                    </button>
                  </div>
                </div>
                <div v-if="showOptions">
                  <h4 class="font-medium mb-1">Options</h4>
                  <br />
                  <div class="grid gap-2">
                    <div
                      class="flex justify-between items-center gap-2"
                      v-for="option in getGroupOptions()"
                      :key="option"
                    >
                      <VLabel class="capitalize cursor-pointer" :for="option">{{
                        option
                      }}</VLabel>
                      <VSwitch
                        v-model="field.selected_options[option]"
                        :id="option"
                        :name="option"
                        class="cursor-pointer"
                        @click="onFieldOptionStyleClick(option)"
                      />
                    </div>
                  </div>
                </div>
                <div
                  class="flex flex-col gap-2"
                  v-if="field.name === 'Cash Discount'"
                >
                  <div class="border-b w-full pb-1">
                    <label class="font-bold" for="cash_types"
                      >Display when Paying by cash</label
                    >
                    <AppTextField
                      type="text"
                      v-model="field.display_when_paying_cash"
                      id="cash_types"
                      name="cash_types"
                      placeholder="You saved @value"
                      class="w-full"
                    />
                    <span class="mt-1 block text-sm text-slate-400"
                      >Use key @value to display the value</span
                    >
                  </div>
                  <div class="pb-1">
                    <label class="font-bold" for="other_types"
                      >Display when Paying with other types of payments</label
                    >
                    <AppTextField
                      type="text"
                      v-model="field.display_when_paying_other_types"
                      id="other_types"
                      name="other_types"
                      placeholder="You could have saved @value"
                    />
                    <span class="mt-1 block text-sm text-slate-400"
                      >Use key @value to display the value</span
                    >
                  </div>
                </div>
              </div>
              <div class="pb-2" v-if="field.name === 'Logo'">
                <FileUploader
                  :setFiles="setLogo"
                  :isLogoField="true"
                  :single="true"
                  :editFormFiles="
                    !field?.options?.Logo?.is_editable
                      ? [
                          {
                            file_name: field?.options?.Logo?.image?.dataURL,
                            url: field?.options?.Logo?.image?.dataURL,
                          },
                        ]
                      : []
                  "
                  :acceptedTypes="['png', 'jpg', 'jpeg']"
                />
              </div>
            </templete>
          </VCard>
        </VDialog>
      </div>
    </template>
  </div>
</template>
<style>
.field-grid {
  grid-template-columns: 20px 1fr;
}
</style>
