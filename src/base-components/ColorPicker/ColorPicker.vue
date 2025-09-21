<script setup lang="ts">
const emit = defineEmits(["setColor"]);
const customColor = ref("");

const setColor = (color: string) => {
  emit("setColor", color);
};
</script>
<template>
  <div>
    <button type="button">
      <ColorPickerIcon />
    </button>

    <VMenu activator="parent" :close-on-content-click="false">
      <VList>
        <VListItem>
          <VColorPicker
            v-model="customColor"
            mode="hex"
            :modes="['hex']"
            @update:model-value="setColor"
          />
        </VListItem>
      </VList>
    </VMenu>
  </div>
</template>
