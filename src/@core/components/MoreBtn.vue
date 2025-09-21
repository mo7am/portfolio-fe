<script lang="ts" setup>
interface Props {
  menuList?: unknown[];
  itemProps?: boolean;
}

const props = defineProps<Props>();
</script>

<template>
  <IconBtn density="compact" color="disabled">
    <VIcon icon="tabler-dots-vertical" />

    <VMenu v-if="props.menuList" activator="parent">
      <VList>
        <VListItem
          v-for="(item, index) in props.menuList"
          :key="index"
          :value="index"
          @click="$emit('callShowMore')"
        >
          <VListItemTitle>{{ item.title }}</VListItemTitle>
        </VListItem>
      </VList>
    </VMenu>
  </IconBtn>
</template>
