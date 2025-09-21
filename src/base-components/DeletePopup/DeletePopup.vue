<script setup lang="ts">
import Lucide from "../Lucide";
import LoadingIcon from "../LoadingIcon";

const props = defineProps<{
  preview: boolean;
  isAdmin: boolean;
  itemName: string;
  deleteFn: (id: number) => void;
  isDeleting: boolean;
}>();

interface Emit {
  (e: "update:isDialogVisible", value: boolean): void;
}

const emit = defineEmits<Emit>();
const isDeletePopupVisible = ref(false);

const triggerDeletePopup = (value: boolean) => {
  isDeletePopupVisible.value = value;
};

watch(
  () => props.preview,
  (value) => {
    triggerDeletePopup(value);
  }
);

watch(isDeletePopupVisible, (value) => {
  emit("update:isDialogVisible", value);
});
</script>

<template>
  <VDialog v-model="isDeletePopupVisible" width="500">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="triggerDeletePopup(false)" />

    <VCard>
      <div class="py-8 px-4">
        <div class="mb-2 flex">
          <Lucide
            icon="AlertTriangle"
            class="m-auto w-16 h-16"
            :class="props.isAdmin ? 'text-black' : 'text-danger'"
          />
        </div>
        <div
          class="text-center text-xl"
          :class="props.isAdmin ? 'text-black' : 'text-danger'"
        >
          Are you sure you want to delete this
          {{ itemName }} ?
        </div>
        <div class="mt-4 flex justify-center">
          <VBtn :color="'warning'" @click="triggerDeletePopup(false)">No!</VBtn>
          &nbsp;&nbsp;&nbsp;
          <VBtn
            class="flex text-white"
            :color="props.isAdmin ? 'black' : 'primary'"
            @click="deleteFn"
          >
            <LoadingIcon
              icon="tail-spin"
              color="white"
              class="w-4 h-4 m-auto"
              v-if="isDeleting"
            />
            <span v-else>Yes?</span>
          </VBtn>
        </div>
      </div>
    </VCard>
  </VDialog>
</template>
