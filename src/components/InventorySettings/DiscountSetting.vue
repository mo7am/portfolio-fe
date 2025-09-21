<script setup lang="ts">
import Lucide from "@/base-components/Lucide";
import type { Discount } from "@/types/inventory";

const props = defineProps<{
  discount: Discount;
  isInPopup?: boolean;
  isSelected?: boolean;
}>();
const emit = defineEmits(["click", "deselectDiscount", "editDiscountClick"]);

const onDiscountClick = () => {
  emit("click", props.discount);
};

const onDeselectDiscount = () => {
  emit(
    "deselectDiscount",
    {
      ...props.discount,
      pre_selected: props.discount.status === "active",
    },
    props.isInPopup
  );
};

const onEditDiscountClick = () => {
  emit("editDiscountClick", props.discount.id);
};
</script>

<template>
  <div>
    <div
      class="relative flex justify-between items-center border-b"
      :class="isInPopup ? 'cursor-pointer' : 'not-in-popup'"
      @click="onDiscountClick()"
    >
      <div class="flex items-start gap-2 relative">
        <div
          v-if="isInPopup"
          class="w-4 h-4 mt-[3px] flex rounded-sm border bg-white shadow-sm cursor-pointer"
          :class="{
            'check-box transition': !isInPopup,
            'bg-primary': isSelected,
          }"
          @click="onDeselectDiscount()"
        >
          <Lucide
            icon="Check"
            class="w-4 h-4 m-auto text-white"
            v-if="isSelected"
          />
        </div>
        <div
          :class="{
            'box transition': !isInPopup,
          }"
        >
          <p class="font-medium">
            {{ discount.type === "amount" ? "$" : "" }}
            {{ makeFLoat(discount.amount, "") }}
            {{ discount.type !== "amount" ? "%" : "" }}
          </p>
          <p class="capitalize">{{ discount.type }}</p>
        </div>
      </div>
      <div
        class="flex items-center gap-1 cursor-pointer"
        @click="onEditDiscountClick()"
      >
        <p class="font-medium">{{ discount.name }}</p>
        <Lucide
          icon="ChevronRight"
          class="w-4 h-4 text-gray-500"
          v-if="!isInPopup"
        />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.not-in-popup {
  .check-box {
    transform: translateX(-100px);
  }

  &:hover .check-box {
    transform: translateX(0);
  }

  .text-box {
    transform: translateX(-24px);
  }

  &:hover .text-box {
    transform: translateX(0);
  }
}
</style>
