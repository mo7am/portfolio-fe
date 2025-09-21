<script setup lang="ts">
import {
  Category,
  Brand,
  Discount,
  Modifier,
  OrderType,
  Product,
  Tax,
} from "@/components/Inventory/Forms";
import { Receipt, Preset, Reason } from "@/components/PosSettings/Forms";
import { Tape } from "@/components/Tape";
import { Operator } from "@/components/Operator";
import Role from "@/components/Role/Form.vue";
import Lucide from "@/base-components/Lucide/Lucide.vue";
import { useUserStore } from "@/stores/user";
import { useInventoryMenu } from "@/stores/inventory-menu";
import { usePOSSettingsMenu } from "@/stores/pos-settings-menu";
import { useLocationMenu } from "@/stores/locations-menu";
import { useTapeMenu } from "@/stores/tapes-menu";

const userStore = useUserStore();

const ComponentsToAdd: {
  [key: string]: any;
} = {
  // Inv Menu Components
  Category,
  Brand,
  Discount,
  Modifier,
  OrderType,
  Product,
  Tax,
  // POS Settings Menu Components
  Receipt,
  Reason,
  Tip: Preset,
  DeliveryPreset: Preset,

  // Locations Menu Components
  Operator,
  Role,

  // Tapes Menu Components
  XTape: Tape,
  ZTape: Tape,
  "X/ZTape": Tape,
  XTapeOperator: Tape,
};

const props = defineProps({
  menuType: {
    type: String,
    default: "Inventory",
  },
});

const menuStore = computed(() =>
  props.menuType === "Inventory"
    ? useInventoryMenu()
    : props.menuType === "POS Settings"
    ? usePOSSettingsMenu()
    : props.menuType === "Locations"
    ? useLocationMenu()
    : useTapeMenu()
);

const computedIsPopupVisible = computed(
  () => menuStore.value.getIsPopupVisible
);
const computedIsDeletePopupVisible = computed(
  () => menuStore.value.getIsDeletePopupVisible
);
const isDeleting = computed(() => menuStore.value.getIsDeleting);
const activeItem = computed(() => menuStore.value.getActiveItem);
const isSearchFieldVisible = computed(
  () => activeItem.value.title !== "Inventory Settings"
);

const isSearchFieldVisibleForPos = computed(
  () => activeItem.value.title !== "POS Settings"
);

const search = ref(menuStore.value.getSearchValue);
const isPopupVisible = ref(computedIsPopupVisible.value);
const isDeletePopupVisible = ref(computedIsDeletePopupVisible.value);

const searchItems = useDebounceFn((value: string) => {
  menuStore.value.setSearchValue(value);
}, 600);

const triggerPopup = (value: boolean) => {
  menuStore.value.setIsPopupVisible(value);
  isPopupVisible.value = value;

  if (value) {
    menuStore.value.setIDToEdit(0);
  }
  if (activeItem.value.add_btn_title == "Role") {
    menuStore.value.setIDToClone(0);
  }
};

const triggerDeletePopup = (value: boolean) => {
  menuStore.value.setIsDeletePopupVisible(value);
  isDeletePopupVisible.value = value;

  if (value) {
    menuStore.value.setIDToEdit(0);
  }
};

const deleteRecord = () => {
  menuStore.value.setIsDeleteRecord();
};

watch(search, (value) => {
  searchItems(value);
});

watch(computedIsPopupVisible, (value) => {
  isPopupVisible.value = value;
});

watch(isPopupVisible, (value) => {
  if (!value) {
    menuStore.value.setIsPopupVisible(false);
  }
});

watch(computedIsDeletePopupVisible, (value) => {
  isDeletePopupVisible.value = value;
});

watch(isDeletePopupVisible, (value) => {
  if (!value) {
    menuStore.value.setIsDeletePopupVisible(false);
  }
});

watch(
  () => menuStore.value.getSearchValue,
  (value) => {
    if (!value) search.value = value;
  }
);
</script>
<template>
  <!-- TODO check this userStore.hasPermission(activeItem.permission || '') -->
  <div
    v-if="isSearchFieldVisible && isSearchFieldVisibleForPos"
    class="grid search-bar-grid gap-4"
  >
    <div class="search-style">
      <div class="relative bg-white rounded-5">
        <AppTextField
          v-model="search"
          type="text"
          placeholder="Search"
          :isSearchBox="true"
          :readonly="activeItem.add_btn_title == 'X/Z Tape' ? true : false"
          @click="
            activeItem.add_btn_title == 'X/Z Tape'
              ? menuStore.setIsSearchPopupVisible(true)
              : ''
          "
        />
      </div>
    </div>
    <VBtn
      v-if="
        activeItem.add_btn_title &&
        userStore.hasPermission(activeItem.permission || '')
      "
      type="button"
      @click="triggerPopup(true)"
    >
      <PlusIcon class="md:mr-2" />
      <span class="hidden md:block">
        {{ props.menuType == "X/Z Tapes" ? "Create" : "Add" }}
        {{ activeItem.add_btn_title }}
      </span>
    </VBtn>
  </div>
  <div
    v-else-if="isSearchFieldVisible && isSearchFieldVisibleForPos"
    class="grid gap-4"
  >
    <div class="search-style">
      <AppTextField
        v-model="search"
        type="text"
        placeholder="Search"
        :isSearchBox="true"
        :readonly="activeItem.add_btn_title == 'X/Z Tape' ? true : false"
        @click="
          activeItem.add_btn_title == 'X/Z Tape'
            ? menuStore.setIsSearchPopupVisible(true)
            : ''
        "
      />
    </div>
  </div>
  <template v-if="activeItem.add_btn_title">
    <VDialog
      v-model="isPopupVisible"
      :width="activeItem.add_btn_title == 'Role' ? 1000 : 500"
    >
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="triggerPopup(false)" />

      <VCard>
        <div class="py-8 px-4">
          <h3 class="font-medium text-lg">
            {{
              menuStore.getIDToEdit != 0 && menuStore.getIDToClone == 0
                ? "Edit"
                : "Create"
            }}
            {{ activeItem.add_btn_title }}
          </h3>
          <Component
            :is="ComponentsToAdd[activeItem.add_btn_title.replace(' ', '')]"
          />
        </div>
      </VCard>
    </VDialog>

    <VDialog v-model="isDeletePopupVisible" width="500">
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="triggerDeletePopup(false)" />

      <VCard>
        <div class="py-8 px-4">
          <div class="mb-2 flex">
            <Lucide icon="AlertTriangle" class="text-danger m-auto w-16 h-16" />
          </div>
          <div class="text-center text-xl text-danger">
            Are you sure you want to delete this
            {{ activeItem.add_btn_title.toLowerCase() }} ?
          </div>
          <div class="mt-4 flex justify-center">
            <VBtn :color="'warning'" @click="triggerDeletePopup(false)"
              >No!</VBtn
            >
            &nbsp;&nbsp;&nbsp;
            <VBtn @click="deleteRecord">{{
              isDeleting ? "Loading..." : "Yes?"
            }}</VBtn>
          </div>
        </div>
      </VCard>
    </VDialog>
  </template>
</template>
<style scoped>
.search-bar-grid {
  grid-template-columns: 1fr 200px;
}

@media screen and (max-width: 760px) {
  .search-bar-grid {
    grid-template-columns: 1fr auto;
  }
}
</style>
