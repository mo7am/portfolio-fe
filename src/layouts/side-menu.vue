<script lang="ts" setup>
const IneventoryLayout = defineAsyncComponent(
  () => import("./components/IneventoryLayout.vue")
);

const { injectSkinClasses } = useSkins();
const route = useRoute();

const title = computed(() => getSideMenuPageTitle(route.fullPath));

injectSkinClasses();
</script>

<template>
  <IneventoryLayout :title="title" />
</template>

<style lang="scss">
// As we are using `layouts` plugin we need its styles to be imported
@use "@layouts/styles/default-layout";
</style>
