<script setup lang="ts">
import { GROUPED_FIELDS, OPTIONS_USED_CLASS_NAMES } from "./data";

const props = defineProps<{
  type: string;
  fields: any[];
  selectedFields: any[];
  showDeleteBtn: boolean;
}>();
const emit = defineEmits(["save", "reset", "deselectByGroup"]);

const onSelectField = (field: any, index: number) => {
  let fieldCopy = JSON.parse(JSON.stringify(field));
  if (fieldCopy?.has_options) {
    if (GROUPED_FIELDS.includes(fieldCopy.name)) {
      const options: any = {};
      if (fieldCopy.name == "Items & Details") {
        if (props.type == "kitchen-bar") {
          fieldCopy.options = fieldCopy.options.otherData.filter(
            (item: any) => item !== "Discounts" && item !== "Comment"
          );
        }
        if (props.type == "terminal") {
          fieldCopy.options = fieldCopy.options.otherData.filter(
            (item: any) =>
              item !== "Discounts" &&
              item !== "Comment" &&
              item !== "Highlight modifiers"
          );
        }
      }
      const received_options = field.options.otherData;
      received_options.forEach((option: string) => {
        options[option] = false;
      });
      fieldCopy = {
        ...fieldCopy,
        selected_options: options,
      };
    } else {
      fieldCopy = {
        ...fieldCopy,
        selected_styles: [],
      };
    }
    if (fieldCopy.name === "Cash Discount") {
      fieldCopy = {
        ...fieldCopy,
        display_when_paying_cash: "You saved @value",
        display_when_paying_other_types: "You could have saved @value",
      };
    }
  }

  if (field.type !== "repeatable") {
    props.fields[index]["inactive"] = true;
  }

  if (field.name === "Logo") {
    fieldCopy = {
      ...fieldCopy,
      options: {
        Logo: {},
      },
    };
  }

  props.selectedFields.push(fieldCopy);
};

const getOptionClassName = (option: string) => OPTIONS_USED_CLASS_NAMES[option];

const onSaveClick = () => {
  emit("save");
};

const onResetClick = () => {
  emit("reset");
};

provide("getOptionClassName", getOptionClassName);
</script>
<template>
  <template v-if="props.fields.length">
    <div class="flex justify-end gap-2">
      <VBtn
        variant="tonal"
        type="button"
        class="w-[120px]"
        @click="onResetClick"
        >Reset</VBtn
      >
      <VBtn type="button" class="w-[120px]" @click="onSaveClick">Save</VBtn>
    </div>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 mt-4">
      <div class="sm:border-r sm:pr-2">
        <h3 class="font-medium text-lg border-b pb-1">Fields</h3>
        <div class="flex flex-col">
          <template v-for="(field, index) in props.fields">
            <StyledField
              :field="field"
              :is_used="false"
              :isDeselectedByGroup="false"
              @selectField="onSelectField(field, index)"
              :keyVal="index"
              v-if="!field?.inactive"
            />
          </template>
        </div>
      </div>
      <div class="sm:border-r sm:px-2 relative">
        <h3 class="font-medium text-lg border-b pb-1">Used</h3>

        <VBtn
          variant="text"
          class="absolute top-[-10px] right-[10px]"
          @click="emit('deselectByGroup')"
          v-if="showDeleteBtn"
        >
          Delete
        </VBtn>
        <div class="flex flex-col">
          <slot></slot>
        </div>
      </div>
      <div
        class="mt-4 col-span-full lg:mt-0 lg:col-span-1 sm:border-r sm:px-10"
      >
        <ReceiptTemplate
          :order="null"
          :transaction="null"
          :posSetting="null"
          :fields="props.selectedFields"
          class="md:w-[265px] mx-auto lg:w-auto"
        />
      </div>
    </div>
  </template>
  <div v-else>No Records found!</div>
</template>
