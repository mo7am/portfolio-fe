<script setup lang="ts">
import { useInventoryMenu } from "@/stores/inventory-menu";
import type { VForm } from "vuetify/components/VForm";
import { removeError } from "@/utils/helper";

const refForm = ref<VForm>();
const props = defineProps<{
  isInProduct?: boolean;
}>();
const emit = defineEmits(["closePopup"]);
const api = inject<any>("api");
const form = reactive<any>({
  name: "",
  multiselect: false,
  countable: false,
  forced: false,
  options: [],
});
const isLoading = reactive({
  initial: false,
  submitting: false,
});
const initialData = ref<any>({});
const menuStore = useInventoryMenu();

const getEditModifier = async (id: number) => {
  isLoading.initial = true;
  try {
    const res = await api.inventory.modifier.getEditModifier(id);
    initialData.value = await res?.data;
    const modifier = initialData.value?.modifier;
    if (modifier) {
      Object.keys(form).forEach((key) => {
        form[key] = modifier[key];
      });
    }
  } catch (error) {
    console.log(error);
  }
  isLoading.initial = false;
};

const onSubmit = async () => {
  if (!(await refForm.value?.validate())?.valid) {
    return;
  }
  isLoading.submitting = true;
  try {
    if (menuStore.getIDToEdit && !props.isInProduct) {
      await api.inventory.modifier.editModifier(menuStore.getIDToEdit, form);
    } else {
      await api.inventory.modifier.createModifier(form);
    }

    if (!props.isInProduct) {
      menuStore.setIsPopupVisible(false);
      menuStore.setIsGetData();
    } else {
      emit("closePopup");
    }
  } catch (error) {
    console.log(error);
  }
  isLoading.submitting = false;
};

const setMultiselect = () => {
  form.multiselect = !form.multiselect;
  removeError("multiselect");
};

const setCountable = () => {
  form.countable = !form.countable;
  removeError("countable");
};

const setForced = () => {
  form.forced = !form.forced;
  removeError("forced");
};

watch(
  () => form.multiselect,
  (value) => {
    if (value) {
      removeError("multiselect");
    }
  },
  {
    deep: true,
  }
);

watch(
  () => menuStore.getIDToEdit,
  (value) => {
    if (value && !props.isInProduct) {
      getEditModifier(value);
    }
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div class="mt-4" v-if="isLoading.initial">Loading...</div>
  <VForm
    ref="refForm"
    @submit.prevent="onSubmit"
    class="flex flex-col gap-4 mt-4"
    v-else
  >
    <div id="name">
      <AppTextField
        v-model="form.name"
        label="Name"
        placeholder="Type Here..."
        :rules="[requiredValidator, alphaNumericValidator(form.name)]"
        :isRequired="true"
      />
    </div>
    <div class="flex justify-between">
      <div class="flex flex-col" id="multiselect">
        <label class="text-base" @click="emit('closePopup')" for="multiselect1"
          >Multi Select</label
        >
      </div>
      <div>
        <VSwitch
          class="cursor-pointer"
          @click="setMultiselect()"
          v-model="form.multiselect"
          id="multiselect1"
          color="success"
        />
      </div>
    </div>
    <div class="flex justify-between">
      <div class="flex flex-col" id="countable">
        <label class="text-base" for="countable1">Countable Options</label>
      </div>
      <div>
        <VSwitch
          class="cursor-pointer"
          @click="setCountable()"
          v-model="form.countable"
          id="countable1"
          color="success"
        />
      </div>
    </div>
    <div class="flex justify-between">
      <div class="flex flex-col" id="forced">
        <label class="text-base" for="forced1">Forced</label>
      </div>
      <div>
        <VSwitch
          class="cursor-pointer"
          @click="setForced()"
          v-model="form.forced"
          id="forced1"
          color="success"
        />
      </div>
    </div>
    <div id="options">
      <ModifierOptions :options="form.options" />
    </div>
    <div class="flex justify-end mt-4">
      <VBtn type="submit" class="w-fit px-10">{{
        isLoading.submitting ? "Loading..." : "Save"
      }}</VBtn>
    </div>
  </VForm>
</template>
