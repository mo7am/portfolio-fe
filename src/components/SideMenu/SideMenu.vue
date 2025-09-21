<script setup lang="ts">
import { staticPrimaryColor } from "@/plugins/vuetify/theme";
import type { InventoryMenuItem as MenuItem } from "@/types/inventory";
import { useUserStore } from "@/stores/user";
import { useInventoryMenu } from "@/stores/inventory-menu";
import { usePOSSettingsMenu } from "@/stores/pos-settings-menu";
import { useLocationMenu } from "@/stores/locations-menu";
import { useTapeMenu } from "@/stores/tapes-menu";

const props = defineProps({
  menuType: {
    type: String,
    default: "Inventory",
  },
});

const userStore = useUserStore();

const items = computed(() => menuStore.value.getItems);

function removeByAttr(arr: any, attr: string, value: string, removed: boolean) {
  let i = arr.length;
  while (i--) {
    if (
      arr[i] &&
      arr[i].hasOwnProperty(attr) &&
      arguments.length > 2 &&
      arr[i][attr] === value
    ) {
      if (!removed) {
        arr.splice(i, 1);
      }
    }
  }
  return arr;
}

const menuStore = computed(() =>
  props.menuType === "Inventory"
    ? useInventoryMenu()
    : props.menuType === "POS Settings"
    ? usePOSSettingsMenu()
    : props.menuType === "Locations"
    ? useLocationMenu()
    : useTapeMenu()
);

// Checking Permissions
if (props.menuType === "Inventory") {
  removeByAttr(
    items.value,
    "title",
    "Inventory Settings",
    userStore.hasPermission("manage-inventory-settings")
  );
  removeByAttr(
    items.value,
    "title",
    "Categories",
    userStore.hasPermission("view-category")
  );
  removeByAttr(
    items.value,
    "title",
    "Products",
    userStore.hasPermission("view-product")
  );
  removeByAttr(
    items.value,
    "title",
    "Discounts",
    userStore.hasPermission("view-discount")
  );
  removeByAttr(
    items.value,
    "title",
    "Modifiers",
    userStore.hasPermission("view-modifier")
  );
  removeByAttr(
    items.value,
    "title",
    "Taxes",
    userStore.hasPermission("view-tax")
  );
  removeByAttr(
    items.value,
    "title",
    "Brands",
    userStore.hasPermission("view-brand")
  );
  removeByAttr(
    items.value,
    "title",
    "Order Types",
    userStore.hasPermission("view-order-type")
  );
} else if (props.menuType === "POS Settings") {
  removeByAttr(
    items.value,
    "title",
    "POS Settings",
    userStore.hasPermission("manage-pos-settings")
  );

  removeByAttr(
    items.value,
    "title",
    "Tips Management",
    userStore.hasPermission("view-tip") && userStore.getPosSettings.tips != 0
  );

  removeByAttr(
    items.value,
    "title",
    "Delivery Presets",
    userStore.hasPermission("view-delivery-presets") &&
      userStore.getPosSettings.delivery_fees != 0
  );

  removeByAttr(
    items.value,
    "title",
    "Receipts",
    userStore.hasPermission("view-receipt")
  );

  removeByAttr(
    items.value,
    "title",
    "Refund Reasons",
    userStore.hasPermission("view-reason")
  );
} else if (props.menuType === "Locations") {
  removeByAttr(
    items.value,
    "title",
    "Operators",
    userStore.hasPermission("view-user")
  );
  removeByAttr(
    items.value,
    "title",
    "Roles",
    userStore.hasPermission("view-roles")
  );
} else if (props.menuType === "X/Z Tapes") {
  removeByAttr(
    items.value,
    "title",
    "X/Z Reporst History",
    userStore.hasPermission("view-xz-tape-history")
  );

  removeByAttr(
    items.value,
    "title",
    "X Tapes",
    userStore.hasPermission("view-x-tape")
  );

  removeByAttr(
    items.value,
    "title",
    "Z Tapes",
    userStore.hasPermission("view-z-tape")
  );

  removeByAttr(
    items.value,
    "title",
    "X Tape Operator",
    userStore.hasPermission("view-x-tape_by_operator")
  );
}

const isDialogVisible = ref(false);
const windowSize = ref(window.innerWidth);

const activeItem = computed(() => menuStore.value.getActiveItem);

const setActiveItem = (item: MenuItem) => {
  menuStore.value.setActiveItem(item);
  isDialogVisible.value = false;
  if (props.menuType === "X/Z Tapes" && item.title == "X Tape Operator") {
    menuStore.value.setIsOperatorPopupVisible(true);
  }
};

window.addEventListener("resize", () => {
  windowSize.value = window.innerWidth;
});

watch(
  () => props.menuType,
  () => {
    menuStore.value.resetStore();
  }
);

onUnmounted(() => {
  menuStore.value.resetStore();
});
</script>
<template>
  <div
    class="h-fit lg:min-h-[643px] lg:h-full flex flex-col gap-4 p-4 bg-white dark:bg-surface shadow rounded"
    v-if="windowSize > 785"
  >
    <RouterLink
      :class="[
        'rounded-lg shadow flex items-center justify-between gap-4 px-4 py-3',
        {
          'bg-secondary dark:!bg-slate-600 text-primary':
            activeItem.title === item.title,
          'bg-[#fafafa] dark:bg-darkmode-bg': activeItem.title !== item.title,
        },
      ]"
      :to="item.path"
      @click="setActiveItem(item)"
      v-for="item in items"
    >
      <div class="flex flex-col">
        <span>{{ item.title }}</span>
        <div class="text-xs" v-if="item?.sub_title">
          <span>
            {{ item.sub_title }}
          </span>
        </div>
      </div>

      <Arrow
        :color="
          activeItem.title === item.title ? staticPrimaryColor : undefined
        "
      />
    </RouterLink>
  </div>
  <template v-else>
    <div class="h-fit">
      <button class="cursor-pointer" @click="isDialogVisible = true">
        <MenuBarsIcon />
      </button>
    </div>
    <VDialog v-model="isDialogVisible" width="500">
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

      <VCard>
        <div
          class="flex flex-col gap-4 px-4 py-8 bg-white dark:bg-surface shadow rounded"
        >
          <RouterLink
            class="p-4 py-3 rounded-lg shadow flex items-center justify-between gap-4"
            :class="{
              'bg-secondary dark:!bg-slate-600 text-primary':
                activeItem.title === item.title,
              'bg-[#f8f7fa] dark:bg-darkmode-bg':
                activeItem.title !== item.title,
            }"
            :to="item.path"
            @click="setActiveItem(item)"
            v-for="item in items"
          >
            <div class="flex flex-col">
              <span>{{ item.title }}</span>
              <div class="text-xs" v-if="item?.sub_title">
                <span>
                  {{ item.sub_title }}
                </span>
                <!-- <span v-if="item?.count !== undefined">
                  {{ item?.count }}
                </span> -->
              </div>
            </div>

            <Arrow
              :color="
                activeItem.title === item.title ? staticPrimaryColor : undefined
              "
            />
          </RouterLink>
        </div>
      </VCard>
    </VDialog>
  </template>
</template>
