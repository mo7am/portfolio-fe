<script setup lang="ts">
import Lucide from "../Lucide";

const props = defineProps<{
  checked: boolean;
}>();
</script>
<template>
  <button
    type="button"
    class="border rounded-sm w-4 h-4 flex transition"
    :class="{
      'bg-primary': checked,
    }"
  >
    <Lucide icon="Check" class="w-3 h-3 m-auto" v-if="checked" />
  </button>
</template>
