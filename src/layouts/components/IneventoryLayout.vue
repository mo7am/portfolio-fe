<script lang="ts" setup>
import { staticPrimaryColor } from "@/plugins/vuetify/theme";

const DefaultLayoutWithHorizontalNav = defineAsyncComponent(
  () => import("./DefaultLayoutWithHorizontalNav.vue")
);

const props = defineProps({
  title: {
    type: String,
    default: "Inventory",
  },
});
// SECTION: Loading Indicator
const isFallbackStateActive = ref(false);
const refLoadingIndicator = ref<any>(null);

// watching if the fallback state is active and the refLoadingIndicator component is available
watch(
  [isFallbackStateActive, refLoadingIndicator],
  () => {
    if (isFallbackStateActive.value && refLoadingIndicator.value)
      refLoadingIndicator.value.fallbackHandle();

    if (!isFallbackStateActive.value && refLoadingIndicator.value)
      refLoadingIndicator.value.resolveHandle();
  },
  { immediate: true }
);
</script>

<template>
  <DefaultLayoutWithHorizontalNav>
    <section>
      <div class="flex items-center gap-2">
        <div class="bg-secondary dark:!bg-surface p-2 shadow rounded flex">
          <BoxIcon
            :color="staticPrimaryColor"
            class="w-[20px] h-[20px] m-auto"
          />
        </div>
        <p class="text-xl">{{ title }}</p>
      </div>
      <div class="grid ineventory-grid gap-4 mt-4">
        <SideMenu :menuType="title" />
        <div class="flex flex-col gap-4">
          <SearchBar :menuType="title" />
          <RouterView v-slot="{ Component }">
            <Suspense
              :timeout="0"
              @fallback="isFallbackStateActive = true"
              @resolve="isFallbackStateActive = false"
            >
              <Component :is="Component" />
            </Suspense>
          </RouterView>
        </div>
      </div>
    </section>
  </DefaultLayoutWithHorizontalNav>
</template>
<style>
.ineventory-grid {
  grid-template-columns: 400px 1fr;
}

@media screen and (max-width: 1000px) {
  .ineventory-grid {
    grid-template-columns: 275px 1fr;
  }
}

@media screen and (max-width: 785px) {
  .ineventory-grid {
    grid-template-columns: 60px 1fr;
  }
}

@media screen and (max-width: 450px) {
  .ineventory-grid {
    grid-template-columns: 1fr;
  }
}
</style>
