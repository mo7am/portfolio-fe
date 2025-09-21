<script setup lang="ts">
import Lucide from "@/base-components/Lucide/Lucide.vue";

type Option = {
  [key: string]: number | boolean | string | undefined;
  id?: number;
  name: string;
  price: number;
  is_default: boolean;
};

const props = defineProps<{
  options: Option[];
}>();

const isPopupVisible = ref(false);
const optionName = ref("");
const indexToDelete = ref(-1);
const indexToEdit = ref(-1);
const optionForm = reactive<Option>({
  name: "",
  price: 0,
  is_default: false,
});

const resetForm = () => {
  optionForm.name = "";
  optionForm.price = 0;
  optionForm.is_default = false;
};

const closePopup = () => {
  isPopupVisible.value = false;
  indexToDelete.value = -1;
  indexToEdit.value = -1;
  const timer = setTimeout(() => {
    indexToDelete.value = -1;
    indexToEdit.value = -1;
    resetForm();
  }, 400);

  return () => {
    clearTimeout(timer);
  };
};

const setIsDefault = () => {
  optionForm.is_default = !optionForm.is_default;
};

const saveOption = () => {
  if (indexToEdit.value !== -1) {
    Object.keys(optionForm).forEach((key) => {
      props.options[indexToEdit.value][key] = optionForm[key];
    });
  } else {
    props.options.push({
      ...optionForm,
    });
  }
  closePopup();

  const resetTimer = setTimeout(() => {
    resetForm();
  }, 400);

  return () => {
    clearTimeout(resetTimer);
  };
};

const deleteOption = () => {
  props.options.splice(indexToDelete.value, 1);
  closePopup();
};

const onAddClick = () => {
  indexToDelete.value = -1;
  indexToEdit.value = -1;
  isPopupVisible.value = true;
};

const onEditClick = (index: number) => {
  indexToDelete.value = -1;
  indexToEdit.value = index;
  isPopupVisible.value = true;
  Object.keys(optionForm).forEach((key) => {
    optionForm[key] = props.options[index][key];
  });
};

const checkNegativeNumber = useDebounceFn((form: any, field: any) => {
  if (!isInt(form[field])) {
    form[field] = 0;
  }
}, 600);
</script>
<template>
  <div>
    <h3 class="font-medium text-base">Options</h3>
    <div
      class="flex flex-col gap-2 py-2 max-h-[200px] overflow-auto"
      v-if="options.length"
    >
      <div class="grid grid-cols-4">
        <h3 class="font-medium text-center text-sm">Name</h3>
        <h3 class="font-medium text-center text-sm">Price</h3>
        <h3 class="font-medium text-center text-sm">Is Default?</h3>
        <h3 class="font-medium text-center text-sm">Actions</h3>
      </div>
      <div
        class="grid grid-cols-4"
        v-for="(option, index) in options"
        :key="option.id || index"
      >
        <h3 class="text-center text-sm">{{ option.name }}</h3>
        <h3 class="text-center text-sm">$ {{ option.price }}</h3>
        <h3 class="text-center flex text-sm">
          <Lucide
            icon="Check"
            class="text-success w-4 h-4 m-auto"
            v-if="option.is_default"
          />
          <Lucide icon="X" class="text-danger w-4 h-4 m-auto" v-else />
        </h3>
        <div class="flex justify-center gap-2">
          <button
            type="button"
            @click="
              (indexToDelete = index),
                (isPopupVisible = true),
                (optionName = option.name)
            "
          >
            <Lucide icon="Trash2" class="w-4 h-4 text-danger" />
          </button>
          <button type="button" @click="onEditClick(index)">
            <Lucide icon="Edit" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <div class="text-slate-300 mt-2" v-else>No Records Found!</div>
    <VBtn
      type="button"
      variant="text"
      class="p-2 mt-2 mr-auto"
      @click="onAddClick"
    >
      <Lucide icon="Plus" class="w-4 h-4 mr-2" />
      Add Option
    </VBtn>
  </div>

  <VDialog v-model="isPopupVisible" width="500">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="closePopup" />

    <VCard>
      <div class="py-8 px-4">
        <h3 class="font-medium text-lg" v-if="indexToDelete == -1">
          Create Option
        </h3>

        <template v-if="indexToDelete !== -1">
          <div class="mb-2 flex">
            <Lucide icon="AlertTriangle" class="text-danger m-auto w-16 h-16" />
          </div>
          <div class="text-center text-xl text-danger">
            Are you sure you want delete this option ({{ optionName }}) ?
          </div>
          <div class="mt-4 flex justify-center">
            <VBtn :color="'warning'" @click="closePopup">No!</VBtn>
            &nbsp;&nbsp;&nbsp;
            <VBtn @click="deleteOption">Yes?</VBtn>
          </div>
        </template>
        <template v-else>
          <div class="flex flex-col gap-4 mt-4">
            <div>
              <AppTextField
                type="text"
                v-model="optionForm.name"
                label="Name"
                placeholder="Type Here..."
                :isRequired="true"
              />
            </div>
            <div>
              <AppTextField
                type="number"
                v-model="optionForm.price"
                label="Price"
                placeholder="$ 0.00"
                :min="0"
                :isRequired="true"
              />
            </div>
            <div class="flex justify-between">
              <div class="flex flex-col">
                <label class="text-base" for="is_default">Default ?</label>
              </div>
              <div>
                <VSwitch
                  class="cursor-pointer"
                  @click="setIsDefault()"
                  v-model="optionForm.is_default"
                  id="is_default"
                  color="success"
                />
              </div>
            </div>
            <VBtn
              class="ml-auto mt-2"
              :disabled="!(optionForm.name && optionForm.price)"
              @click="saveOption"
              >Save</VBtn
            >
          </div>
        </template>
      </div>
    </VCard>
  </VDialog>
</template>
